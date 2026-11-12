import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const TRIPS = 'trips';
export const HISTORY_PAGE_SIZE = 20; 

// Historial paginado: más reciente primero, con filtros de fechas y método de pago.
// lastDoc: último documento de la página anterior (para cargar la siguiente)
export const getTripHistory = async ({ driverId, from, to, paymentMethod, lastDoc }) => {
  const constraints = [where('driverId', '==', driverId), where('status', '==', 'paid')];

  if (paymentMethod) constraints.push(where('paymentMethod', '==', paymentMethod));
  if (from) constraints.push(where('completedAt', '>=', Timestamp.fromDate(from)));
  if (to) constraints.push(where('completedAt', '<=', Timestamp.fromDate(to)));

  constraints.push(orderBy('completedAt', 'desc'));
  if (lastDoc) constraints.push(startAfter(lastDoc));
  constraints.push(limit(HISTORY_PAGE_SIZE));

  const snapshot = await getDocs(query(collection(db, TRIPS), ...constraints));

  return {
    trips: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === HISTORY_PAGE_SIZE,
  };
};

// Escucha en tiempo real los viajes pagados desde una fecha (para las ganancias)
export const listenToPaidTripsSince = (driverId, from, onChange, onError) => {
  const q = query(
    collection(db, TRIPS),
    where('driverId', '==', driverId),
    where('status', '==', 'paid'),
    where('completedAt', '>=', Timestamp.fromDate(from)),
    orderBy('completedAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
};

// Un viaje por su id (para el detalle)
export const getTrip = async (tripId) => {
  const snapshot = await getDoc(doc(db, TRIPS, tripId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};