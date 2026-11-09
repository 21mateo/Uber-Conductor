import { createContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { listenToActiveTrip } from '../services/tripService';

export const ActiveTripContext = createContext(null);

export function ActiveTripProvider({ children }) {
  const { user } = useAuth();
  const [activeTrip, setActiveTrip] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);

  useEffect(() => {
    if (!user) {
      setActiveTrip(null);
      setLoadingTrip(false);
      return;
    }

    setLoadingTrip(true);
    const unsubscribe = listenToActiveTrip(
      user.uid,
      (trip) => {
        setActiveTrip(trip);
        setLoadingTrip(false);
      },
      (error) => {
        console.log('Error escuchando el viaje activo:', error);
        setLoadingTrip(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return (
    <ActiveTripContext.Provider value={{ activeTrip, loadingTrip }}>
      {children}
    </ActiveTripContext.Provider>
  );
}