import { useContext } from 'react';
import { ActiveTripContext } from '../context/ActiveTripContext';

// Hook personalizado para leer el viaje activo desde cualquier pantalla
export default function useActiveTrip() {
  const context = useContext(ActiveTripContext);

  if (!context) {
    throw new Error('useActiveTrip debe usarse dentro de ActiveTripProvider');
  }
  return context;
}