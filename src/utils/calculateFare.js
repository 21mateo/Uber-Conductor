import { PRICING } from '../config/pricing';

// Redondea al múltiplo de 100 COP más cercano (PDF sección 5)
const roundTo100 = (value) => Math.round(value / 100) * 100;

// Función pura: con los mismos datos siempre devuelve el mismo resultado.
// Se usa para la tarifa estimada (solicitud) y para la tarifa final (al terminar el viaje).
export const calculateFare = ({ distanceKm, durationMin, category, tip = 0 }) => {
  const multiplier = PRICING.multipliers[category] ?? 1;

  // Base + distancia + tiempo, por el multiplicador de la categoría
  const subtotal =
    PRICING.baseFare + distanceKm * PRICING.perKm + durationMin * PRICING.perMinute;

  // Nunca menos que la tarifa mínima, y redondeado a 100
  const fare = roundTo100(Math.max(subtotal * multiplier, PRICING.minimumFare));

  // La comisión se calcula sobre la tarifa; la propina va completa al conductor
  const commissionRate = PRICING.commissionRate;
  const commission = Math.round(fare * commissionRate);
  const driverEarnings = fare - commission + tip;

  return { fare, commission, commissionRate, tip, driverEarnings };
};