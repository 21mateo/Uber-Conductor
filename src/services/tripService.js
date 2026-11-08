import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  runTransaction,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const TRIPS = 'trips';

const createError = (code) => {
  const error = new Error(code);
  error.code = code;
  return error;
};

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