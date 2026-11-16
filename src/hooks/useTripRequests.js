import { useEffect, useState } from 'react';
import { listenToTripRequests } from '../services/tripService';
import { requestNotificationPermission, notifyNewRequest } from '../services/notificationService';

// Hook personalizado: solicitudes de viaje en tiempo real
// enabled: solo se escucha mientras el conductor está Disponible
export default function useTripRequests(driverId, enabled) {
  const [requests, setRequests] = useState([]);

  // Al ponerse Disponible se pide permiso de notificaciones
  useEffect(() => {
    if (enabled) requestNotificationPermission();
  }, [enabled]);

  useEffect(() => {
    if (!driverId || !enabled) {
      setRequests([]);
      return;
    }

    const unsubscribe = listenToTripRequests(driverId, setRequests, (error) =>
      console.log('Error escuchando solicitudes:', error)
    );

    // Función de limpieza: deja de escuchar al pasar a No disponible
    return unsubscribe;
  }, [driverId, enabled]);

  // Se muestra una solicitud a la vez: la más antigua
  const request = requests[0] || null;

  // Notifica cada solicitud nueva (una sola vez por solicitud)
  useEffect(() => {
    if (request) notifyNewRequest(request);
  }, [request?.id]);

  return { request, pendingCount: requests.length };
}