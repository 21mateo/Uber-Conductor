import {
  collection,
  doc,
  query,
  where,
  limit,
  onSnapshot,
  runTransaction,
  updateDoc,
  writeBatch,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const TRIPS = 'trips';
const DRIVERS = 'drivers';

const createError = (code) => {
  const error = new Error(code);
  error.code = code;
  return error;
};

// ---------- Solicitudes ----------

// Escucha en tiempo real las solicitudes pendientes de un conductor.
// Devuelve la función para dejar de escuchar.
export const listenToTripRequests = (driverId, onChange, onError) => {
  const q = query(
    collection(db, TRIPS),
    where('driverId', '==', driverId),
    where('status', '==', 'requested')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const requests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // La más antigua primero
      requests.sort(
        (a, b) =>
          (a.createdAt?.toMillis() ?? Date.now()) - (b.createdAt?.toMillis() ?? Date.now())
      );
      onChange(requests);
    },
    onError
  );
};

// Acepta una solicitud. La transacción revisa que siga disponible antes de aceptarla.
export const acceptTrip = async (tripId) => {
  const tripRef = doc(db, TRIPS, tripId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(tripRef);
    if (!snapshot.exists() || snapshot.data().status !== 'requested') {
      throw createError('trip/not-available');
    }
    transaction.update(tripRef, {
      status: 'accepted',
      isActive: true,
      acceptedAt: serverTimestamp(),
    });
  });
};

// Rechaza una solicitud. reason: 'driver' (la rechazó) o 'timeout' (se acabó el tiempo)
export const rejectTrip = async (tripId, reason) => {
  await updateDoc(doc(db, TRIPS, tripId), {
    status: 'rejected',
    rejectReason: reason,
    rejectedAt: serverTimestamp(),
  });
};

// ---------- Viaje activo ----------

// Escucha el viaje activo del conductor (o null si no tiene)
export const listenToActiveTrip = (driverId, onChange, onError) => {
  const q = query(
    collection(db, TRIPS),
    where('driverId', '==', driverId),
    where('isActive', '==', true),
    limit(1)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const first = snapshot.docs[0];
      onChange(first ? { id: first.id, ...first.data() } : null);
    },
    onError
  );
};

// accepted → driver_arriving: el conductor va hacia el punto de recogida
export const startPickup = async (tripId) => {
  await updateDoc(doc(db, TRIPS, tripId), {
    status: 'driver_arriving',
    driverArrivingAt: serverTimestamp(),
  });
};

// driver_arriving → in_progress: el pasajero está a bordo.
export const startTrip = async (tripId, routeCoordinates) => {
  await updateDoc(doc(db, TRIPS, tripId), {
    status: 'in_progress',
    route: routeCoordinates || null,
    startedAt: serverTimestamp(),
  });
};

// in_progress → completed: se guardan tarifa, comisión y ganancia (de calculateFare)
export const completeTrip = async (tripId, fareResult) => {
  await updateDoc(doc(db, TRIPS, tripId), {
    status: 'completed',
    fare: fareResult.fare,
    commission: fareResult.commission,
    commissionRate: fareResult.commissionRate, 
    tip: fareResult.tip,
    driverEarnings: fareResult.driverEarnings,
    paymentStatus: 'pending',
    completedAt: serverTimestamp(),
  });
};

export const cancelTrip = async (tripId) => {
  await updateDoc(doc(db, TRIPS, tripId), {
    status: 'cancelled',
    cancelledBy: 'driver',
    isActive: false,
    cancelledAt: serverTimestamp(),
  });
};

// ---------- Cobro ----------

// El pasajero decide pagar en efectivo
export const switchToCash = async (tripId) => {
  await updateDoc(doc(db, TRIPS, tripId), { paymentMethod: 'cash' });
};

// Pago en efectivo recibido. La plataforma no recibió el dinero, así que
// la comisión se descuenta del saldo del conductor (puede quedar negativo).
// writeBatch: las dos escrituras se hacen juntas o ninguna.
export const confirmCashPayment = async (trip) => {
  const batch = writeBatch(db);
  batch.update(doc(db, TRIPS, trip.id), {
    status: 'paid',
    paymentStatus: 'cash',
    paidAt: serverTimestamp(),
  });
  batch.update(doc(db, DRIVERS, trip.driverId), {
    balance: increment(-trip.commission),
  });
  await batch.commit();
};

export const closeTrip = async (tripId) => {
  await updateDoc(doc(db, TRIPS, tripId), { isActive: false });
};