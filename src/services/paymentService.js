import { BACKEND_URL } from '../config/backendConfig';

const TIMEOUT_MS = 15000; // si el backend no responde en 15 s, se cancela

const createError = (code, serverMessage) => {
  const error = new Error(code);
  error.code = code;
  error.serverMessage = serverMessage;
  return error;
};

// Hace un POST al backend y devuelve la respuesta en JSON
const postToBackend = async (path, body) => {
  if (!BACKEND_URL) throw createError('payment/no-backend');

  // AbortController: permite cancelar la petición si tarda demasiado
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    console.log('No se pudo conectar con el backend:', error.message);
    throw createError('payment/backend-unreachable');
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw createError('payment/failed', data.error);
  return data;
};

// La app envía el tripId y el monto; el backend crea la preferencia (PDF sección 4, paso 2)
export const createMercadoPagoPayment = (trip) =>
  postToBackend('/payments/create', { tripId: trip.id, amount: trip.fare + (trip.tip || 0) });

// Le pide al backend que consulte en Mercado Pago si el viaje ya se pagó
export const verifyMercadoPagoPayment = (tripId) => postToBackend('/payments/verify', { tripId });