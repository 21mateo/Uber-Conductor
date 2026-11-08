import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { updateDriverLocation } from '../services/driverService';

const SEND_INTERVAL_MS = 5000; // cada cuánto se guarda la ubicación en Firestore

const toCoords = (position) => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
});

// Hook personalizado: ubicación del conductor
// uid: id del conductor
// isTracking: true mientras está Disponible y en la pantalla de Inicio
export default function useDriverLocation(uid, isTracking) {
  const [location, setLocation] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) setPermissionDenied(true);
          return;
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) setLocation(toCoords(position));
      } catch (error) {
        console.log('No se pudo obtener la ubicación:', error);
      }
    };

    loadLocation();

    // Limpieza: si la pantalla se cierra antes de terminar, no se actualiza el estado
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Mientras está Disponible: seguir la ubicación y guardarla en Firestore
  useEffect(() => {
    if (!isTracking || !uid) return;

    let subscription = null;
    let cancelled = false;
    let lastSent = 0;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }

      const newSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: SEND_INTERVAL_MS, distanceInterval: 10 },
        (position) => {
          const coords = toCoords(position);
          setLocation(coords);

          const now = Date.now();
          if (now - lastSent >= SEND_INTERVAL_MS) {
            lastSent = now;
            updateDriverLocation(uid, coords).catch((error) =>
              console.log('No se pudo guardar la ubicación:', error)
            );
          }
        }
      );

      if (cancelled) {
        newSubscription.remove();
      } else {
        subscription = newSubscription;
      }
    };

    startTracking();

    return () => {
      cancelled = true;
      if (subscription) subscription.remove();
    };
  }, [isTracking, uid]);

  return { location, permissionDenied };
}