import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { colors } from '../theme/colors';

const MIN_MOVE_METERS = 3; // si se mueve menos, no se gira (evita que tiemble por el GPS)

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

// Ángulo de un punto a otro: 0 = norte, 90 = este, 180 = sur, 270 = oeste
const getBearing = (from, to) => {
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const dLng = toRad(to.longitude - from.longitude);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

// Distancia aproximada en metros (sirve para distancias cortas)
const getDistanceMeters = (from, to) => {
  const dLat = (to.latitude - from.latitude) * 110540;
  const dLng = (to.longitude - from.longitude) * 111320 * Math.cos(toRad(from.latitude));
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

// Carro visto desde arriba que gira hacia donde se mueve el conductor
// coordinate: { latitude, longitude }
export default function CarMarker({ coordinate }) {
  const previousRef = useRef(null); // posición anterior (no redibuja la pantalla)
  const [bearing, setBearing] = useState(0);

  // Cada vez que cambia la ubicación se calcula hacia dónde va
  useEffect(() => {
    if (!coordinate) return;
    const previous = previousRef.current;

    if (previous && getDistanceMeters(previous, coordinate) >= MIN_MOVE_METERS) {
      setBearing(getBearing(previous, coordinate));
      previousRef.current = coordinate;
    } else if (!previous) {
      previousRef.current = coordinate;
    }
  }, [coordinate]);

  if (!coordinate) return null;

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} title="Tú">
      {/* El carro apunta hacia arriba (norte) y se rota según la dirección */}
      <View style={[styles.car, { transform: [{ rotate: `${bearing}deg` }] }]}>
        <View style={[styles.mirror, styles.mirrorLeft]} />
        <View style={[styles.mirror, styles.mirrorRight]} />
        <View style={styles.body}>
          <View style={[styles.light, styles.lightLeft]} />
          <View style={[styles.light, styles.lightRight]} />
          <View style={styles.windshield} />
          <View style={styles.roof} />
          <View style={styles.rearWindow} />
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  // Contenedor cuadrado para que al girar no se corte
  car: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: 22,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  light: {
    position: 'absolute',
    top: 1,
    width: 5,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FDE68A', // luces delanteras
  },
  lightLeft: {
    left: 2,
  },
  lightRight: {
    right: 2,
  },
  windshield: {
    marginTop: 8,
    width: 16,
    height: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#9CA3AF', // vidrio
  },
  roof: {
    marginTop: 2,
    width: 16,
    height: 13,
    borderRadius: 3,
    backgroundColor: '#374151',
  },
  rearWindow: {
    marginTop: 2,
    width: 14,
    height: 5,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  mirror: {
    position: 'absolute',
    top: 17,
    width: 4,
    height: 3,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  mirrorLeft: {
    left: 11,
  },
  mirrorRight: {
    right: 11,
  },
});