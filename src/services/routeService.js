const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving/';

// Devuelve { distanceKm, durationMin, coordinates: [{ latitude, longitude }] }
export const getRoute = async (from, to) => {
  const url =
    `${OSRM_URL}${from.lng},${from.lat};${to.lng},${to.lat}` +
    '?overview=simplified&geometries=geojson';

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('No se pudo calcular la ruta');
  }

  const route = data.routes[0];
  return {
    distanceKm: Math.round((route.distance / 1000) * 10) / 10, // metros → km con 1 decimal
    durationMin: Math.max(1, Math.round(route.duration / 60)), // segundos → minutos
    // OSRM devuelve [lng, lat]; el mapa necesita { latitude, longitude }
    coordinates: route.geometry.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
  };
};