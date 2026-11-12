import { useEffect, useMemo, useState } from 'react';
import { listenToPaidTripsSince } from '../services/historyService';
import { startOfDay, startOfWeek, startOfMonth } from '../utils/dates';
import { summarizeTrips, tripsSince } from '../utils/earnings';

// Hook personalizado: ganancias de hoy, la semana y el mes 
export default function useEarnings(driverId) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!driverId) return;

    // Se trae desde lo más antiguo entre el lunes y el día 1 del mes
    // (la semana puede empezar en el mes anterior)
    const from = new Date(Math.min(startOfWeek().getTime(), startOfMonth().getTime()));

    const unsubscribe = listenToPaidTripsSince(
      driverId,
      from,
      (list) => {
        setTrips(list);
        setLoading(false);
      },
      (err) => {
        console.log('Error cargando ganancias:', err);
        setError('No se pudieron cargar las ganancias.');
        setLoading(false);
      }
    );

    // Limpieza: deja de escuchar al salir
    return unsubscribe;
  }, [driverId]);

  // useMemo: los totales solo se recalculan cuando cambian los viajes (PDF sección 3)
  const summaries = useMemo(
    () => ({
      today: summarizeTrips(tripsSince(trips, startOfDay())),
      week: summarizeTrips(tripsSince(trips, startOfWeek())),
      month: summarizeTrips(tripsSince(trips, startOfMonth())),
    }),
    [trips]
  );

  return { summaries, loading, error };
}