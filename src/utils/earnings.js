import { toDate } from './dates';

export const summarizeTrips = (trips) => {
  const totals = trips.reduce(
    (acc, trip) => ({
      count: acc.count + 1,
      gross: acc.gross + (trip.fare || 0), // total facturado
      commissions: acc.commissions + (trip.commission || 0),
      tips: acc.tips + (trip.tip || 0),
      net: acc.net + (trip.driverEarnings || 0), // ganancia neta
    }),
    { count: 0, gross: 0, commissions: 0, tips: 0, net: 0 }
  );

  return {
    ...totals,
    average: totals.count > 0 ? Math.round(totals.net / totals.count) : 0, // promedio por viaje
  };
};

// Solo los viajes terminados desde una fecha
export const tripsSince = (trips, from) =>
  trips.filter((trip) => {
    const completedAt = toDate(trip.completedAt);
    return completedAt && completedAt >= from;
  });