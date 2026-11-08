import { useEffect, useState } from 'react';
import { listenToTripRequests } from '../services/tripService';

// Hook personalizado: solicitudes de viaje en tiempo real
// enabled: solo se escucha mientras el conductor está Disponible
export default function useTripRequests(driverId, enabled) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!driverId || !enabled) {
      setRequests([]);
      return;
    }

    const unsubscribe = listenToTripRequests(driverId, setRequests, (error) =>
      console.log('Error escuchando solicitudes:', error)
    );

    return unsubscribe;
  }, [driverId, enabled]);

  // Se muestra una solicitud a la vez: la más antigua
  return { request: requests[0] || null, pendingCount: requests.length };
}