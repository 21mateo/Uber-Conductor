// Backend del proyecto: crea los pagos en Mercado Pago y actualiza Firestore.
// La llave secreta de Mercado Pago SOLO vive aquí, en backend/.env (PDF sección 4).
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const PORT = process.env.PORT || 3000;

if (!process.env.MP_ACCESS_TOKEN) {
  console.error('❌ Falta MP_ACCESS_TOKEN en backend/.env');
  process.exit(1);
}

// ---------- Firebase Admin (permiso de administrador para escribir en Firestore) ----------
const serviceAccountPath = path.resolve(
  __dirname,
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
);
initializeApp({ credential: cert(require(serviceAccountPath)) });
const db = getFirestore();

// ---------- Mercado Pago ----------
const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Estados de Mercado Pago → estados de nuestra app (Aprobado, Pendiente, Rechazado)
const MP_STATUS = {
  approved: 'approved',
  authorized: 'pending',
  pending: 'pending',
  in_process: 'pending',
  in_mediation: 'pending',
  rejected: 'rejected',
  cancelled: 'rejected',
  refunded: 'rejected',
  charged_back: 'rejected',
};

// Guarda el resultado del pago en el viaje.
// Transacción: si el viaje ya estaba pagado no se hace nada (evita sumar el saldo dos veces).
const applyPaymentToTrip = async (tripId, payment) => {
  const tripRef = db.collection('trips').doc(tripId);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(tripRef);
    if (!snapshot.exists) return;
    const trip = snapshot.data();
    if (trip.status === 'paid') return;

    const paymentStatus = MP_STATUS[payment.status] || 'pending';
    const update = { paymentStatus, paymentId: String(payment.id) };

    if (paymentStatus === 'approved') {
      update.status = 'paid';
      update.paidAt = FieldValue.serverTimestamp();
      // Pago por la pasarela: la ganancia del conductor se suma a su saldo (PDF sección 5)
      transaction.update(db.collection('drivers').doc(trip.driverId), {
        balance: FieldValue.increment(trip.driverEarnings),
      });
    }

    transaction.update(tripRef, update);
  });

  return MP_STATUS[payment.status] || 'pending';
};

// ---------- Servidor ----------
const app = express();
app.use(cors());
app.use(express.json());

// Para probar que el backend está vivo (abrir en el navegador del celular)
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend UberClone funcionando 🚗' });
});

// 1. La app envía tripId y monto → se crea la preferencia de pago (PDF sección 4, paso 2 y 3)
app.post('/payments/create', async (req, res) => {
  try {
    const { tripId, amount } = req.body;
    if (!tripId) return res.status(400).json({ error: 'Falta el tripId' });

    const tripRef = db.collection('trips').doc(tripId);
    const snapshot = await tripRef.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'El viaje no existe' });

    const trip = snapshot.data();
    if (trip.status !== 'completed') {
      return res.status(400).json({ error: 'El viaje no está listo para cobrar' });
    }

    // Seguridad: el monto se compara con el guardado en Firestore, no se confía en la app
    const expectedAmount = trip.fare + (trip.tip || 0);
    if (Number(amount) !== expectedAmount) {
      return res.status(400).json({ error: 'El monto no coincide con el del viaje' });
    }

    // URL de retorno: la misma dirección con la que la app llamó al backend
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const returnUrl = `${baseUrl}/payments/return`;

    const body = {
      items: [
        {
          id: tripId,
          title: `Viaje UberClone (${trip.distanceKm} km)`,
          quantity: 1,
          unit_price: expectedAmount,
          currency_id: 'COP',
        },
      ],
      external_reference: tripId, // así sabemos a qué viaje pertenece el pago
      // Botón "Volver al sitio" del checkout. No se usa auto_return porque
      // Mercado Pago no lo acepta con una IP local (solo con un dominio real)
      back_urls: { success: returnUrl, failure: returnUrl, pending: returnUrl },
    };

    let preference;
    try {
      preference = await new Preference(mpClient).create({ body });
    } catch (error) {
      // Si Mercado Pago tampoco acepta la URL de retorno, se crea sin ella:
      // la app verifica el pago al cerrar el checkout (/payments/verify)
      console.log('Mercado Pago rechazó la URL de retorno, se crea sin ella:', error.message);
      delete body.back_urls;
      preference = await new Preference(mpClient).create({ body });
    }

    await tripRef.update({ preferenceId: preference.id, paymentStatus: 'pending' });

    console.log(`💳 Preferencia creada para el viaje ${tripId}: ${expectedAmount} COP`);
    res.json({ preferenceId: preference.id, checkoutUrl: preference.init_point });
  } catch (error) {
    console.error('Error creando la preferencia:', error.message || error);
    res.status(500).json({ error: 'No se pudo crear el pago en Mercado Pago' });
  }
});

// 2. URL de retorno: Mercado Pago redirige aquí después del pago (PDF sección 4, paso 5)
app.get('/payments/return', async (req, res) => {
  const { payment_id: paymentId, external_reference: tripId } = req.query;
  let status = 'pending';

  try {
    if (paymentId && tripId && paymentId !== 'null') {
      // Se consulta el pago directamente a Mercado Pago (no se confía en la URL)
      const payment = await new Payment(mpClient).get({ id: paymentId });
      if (payment.external_reference === tripId) {
        status = await applyPaymentToTrip(tripId, payment);
        console.log(`✅ Pago ${paymentId} del viaje ${tripId}: ${status}`);
      }
    }
  } catch (error) {
    console.error('Error en la URL de retorno:', error.message || error);
  }

  const messages = {
    approved: '✅ Pago aprobado',
    pending: '⏳ Pago pendiente',
    rejected: '❌ Pago rechazado',
  };
  res.send(`
    <html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="font-family: sans-serif; text-align: center; padding: 40px;">
      <h1>${messages[status]}</h1>
      <p>Ya puedes cerrar esta ventana y volver a la app.</p>
    </body></html>
  `);
});

// 3. La app pide verificar el pago (por si la URL de retorno no alcanzó a cargar)
app.post('/payments/verify', async (req, res) => {
  try {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ error: 'Falta el tripId' });

    // Busca los pagos de este viaje en Mercado Pago, el más reciente primero
    const result = await new Payment(mpClient).search({
      options: { external_reference: tripId, sort: 'date_created', criteria: 'desc' },
    });
    const payments = result.results || [];
    if (payments.length === 0) return res.json({ paymentStatus: 'pending' });

    const payment = payments.find((p) => p.status === 'approved') || payments[0];
    const paymentStatus = await applyPaymentToTrip(tripId, payment);

    console.log(`🔎 Verificación del viaje ${tripId}: ${paymentStatus}`);
    res.json({ paymentStatus });
  } catch (error) {
    console.error('Error verificando el pago:', error.message || error);
    res.status(500).json({ error: 'No se pudo verificar el pago' });
  }
});

// '0.0.0.0' permite que el celular se conecte usando la IP del PC
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend escuchando en el puerto ${PORT}`);
  console.log('   Desde el celular usa: http://<IP de tu PC>:' + PORT);
});