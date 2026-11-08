// Simulador del pasajero: crea una solicitud de viaje en Firestore para un conductor disponible.
// No es parte de la app; se corre desde la terminal para probar las solicitudes:
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const PASSENGER_NAMES = ['Laura Gómez', 'Andrés Restrepo', 'Valentina Ríos', 'Santiago Ruiz'];

const randomBetween = (min, max) => min + Math.random() * (max - min);
const randomItem = (list) => list[Math.floor(Math.random() * list.length)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomPointNear = (lat, lng, minKm, maxKm) => {
  const distanceKm = randomBetween(minKm, maxKm);
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (distanceKm / 111) * Math.cos(angle); // 1 grado de latitud ≈ 111 km
  const dLng = (distanceKm / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat: lat + dLat, lng: lng + dLng };
};

// Distancia y duración por carretera con OSRM (gratis, sin llave)
const getRoute = async (from, to) => {
  const url =
    'https://router.project-osrm.org/route/v1/driving/' +
    `${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.code !== 'Ok') throw new Error('OSRM no encontró una ruta');
  const route = data.routes[0];
  return {
    distanceKm: Math.round((route.distance / 1000) * 10) / 10, // metros → km con 1 decimal
    durationMin: Math.max(1, Math.round(route.duration / 60)), // segundos → minutos
  };
};

const getAddress = async ({ lat, lng }) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`;
    const response = await fetch(url, { headers: { 'User-Agent': 'uber-conductor-proyecto-clase' } });
    const data = await response.json();
    const a = data.address || {};
    const street = [a.road, a.house_number].filter(Boolean).join(' ');
    const area = a.neighbourhood || a.suburb || a.city || '';
    return [street, area].filter(Boolean).join(', ') || data.display_name || 'Dirección sin nombre';
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
};

const main = async () => {
  if (!firebaseConfig.projectId) {
    console.log('❌ No se leyó el .env. Corre el comando con: node --env-file=.env scripts/simulateRequest.mjs');
    process.exit(1);
  }

  const db = getFirestore(initializeApp(firebaseConfig));
  const emailFilter = process.argv[2]?.toLowerCase();

  // 1. Buscar un conductor aprobado y disponible, con ubicación
  const snapshot = await getDocs(
    query(collection(db, 'drivers'), where('isAvailable', '==', true), where('status', '==', 'approved'))
  );
  const drivers = snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((d) => d.location)
    .filter((d) => !emailFilter || d.personal.email === emailFilter);

  if (drivers.length === 0) {
    console.log('❌ No hay conductores aprobados y disponibles con ubicación.');
    console.log('   Abre la app, ponte Disponible en Inicio y vuelve a intentar.');
    process.exit(1);
  }
  const driver = drivers[0];

  // 2. Origen cerca del conductor y destino a unos km
  const originPoint = randomPointNear(driver.location.lat, driver.location.lng, 0.3, 1.2);
  const destinationPoint = randomPointNear(originPoint.lat, originPoint.lng, 2, 7);

  console.log('Calculando ruta con OSRM...');
  const { distanceKm, durationMin } = await getRoute(originPoint, destinationPoint);

  console.log('📍 Buscando direcciones...');
  const originAddress = await getAddress(originPoint);
  await wait(1100); // Nominatim permite máximo 1 petición por segundo
  const destinationAddress = await getAddress(destinationPoint);

  // 3. Crear la solicitud con la misma categoría del vehículo del conductor
  const trip = {
    driverId: driver.id,
    passengerId: 'pasajero-simulado',
    passengerName: randomItem(PASSENGER_NAMES),
    origin: { ...originPoint, address: originAddress },
    destination: { ...destinationPoint, address: destinationAddress },
    distanceKm,
    durationMin,
    category: driver.vehicle.category,
    paymentMethod: randomItem(['mercadopago', 'cash']),
    status: 'requested',
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'trips'), trip);

  console.log('\n✅ Solicitud creada:', docRef.id);
  console.log(`   Conductor: ${driver.personal.fullName}`);
  console.log(`   Pasajero:  ${trip.passengerName}`);
  console.log(`   Origen:    ${originAddress}`);
  console.log(`   Destino:   ${destinationAddress}`);
  console.log(`   ${distanceKm} km · ${durationMin} min · ${trip.category} · ${trip.paymentMethod}`);
  process.exit(0);
};

main().catch((error) => {
  console.log('❌ Error:', error.message);
  process.exit(1);
});