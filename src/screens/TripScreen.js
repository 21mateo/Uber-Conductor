import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import useActiveTrip from '../hooks/useActiveTrip';
import useDriverLocation from '../hooks/useDriverLocation';
import PrimaryButton from '../components/PrimaryButton';
import CarMarker from '../components/CarMarker';
import { getRoute } from '../services/routeService';
import { startPickup, startTrip, completeTrip, cancelTrip } from '../services/tripService';
import { calculateFare } from '../utils/calculateFare';
import { formatKm, formatMinutes } from '../utils/format';
import { getErrorMessage } from '../utils/firebaseErrors';
import { colors, spacing, radius } from '../theme/colors';

// { lat, lng } → { latitude, longitude } para el mapa
const toMapPoint = (point) => ({ latitude: point.lat, longitude: point.lng });

export default function TripScreen() {
  const { user } = useAuth();
  const { activeTrip: trip } = useActiveTrip();
  const mapRef = useRef(null);

  // Durante el viaje se sigue compartiendo la ubicación
  const { location } = useDriverLocation(user.uid, true);

  const [pickupRoute, setPickupRoute] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Fase 1: ir a recoger al pasajero. Fase 2: llevarlo al destino
  const isGoingToPickup = trip.status === 'accepted' || trip.status === 'driver_arriving';
  const target = isGoingToPickup ? trip.origin : trip.destination;

  // Ruta que se dibuja según la fase (useMemo: no se recalcula en cada movimiento del GPS)
  const routeCoordinates = useMemo(() => {
    if (isGoingToPickup) return pickupRoute?.coordinates;
    // Si no se pudo guardar la ruta, se dibuja una línea recta
    return trip.route || [toMapPoint(trip.origin), toMapPoint(trip.destination)];
  }, [isGoingToPickup, pickupRoute, trip.route, trip.origin, trip.destination]);

  // accepted → driver_arriving apenas se abre la pantalla
  useEffect(() => {
    if (trip.status === 'accepted') {
      startPickup(trip.id).catch((err) => console.log('Error iniciando recogida:', err));
    }
  }, [trip.id, trip.status]);

  // Ruta del conductor al punto de recogida: se calcula UNA vez al tener la ubicación
  const hasLocation = location !== null;
  useEffect(() => {
    if (!isGoingToPickup || !hasLocation || pickupRoute) return;
    let cancelled = false;

    getRoute({ lat: location.latitude, lng: location.longitude }, trip.origin)
      .then((route) => {
        if (!cancelled) setPickupRoute(route);
      })
      .catch((err) => console.log('No se pudo calcular la ruta a la recogida:', err));

    // Limpieza: si la pantalla se cierra antes de que responda OSRM
    return () => {
      cancelled = true;
    };
  }, [isGoingToPickup, hasLocation]);

  // Ajusta el mapa para que se vea toda la ruta
  useEffect(() => {
    if (routeCoordinates?.length && mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 60, right: 40, bottom: 320, left: 40 },
        animated: true,
      });
    }
  }, [routeCoordinates]);

  // Pasajero a bordo: se calcula la ruta al destino y se guarda en el viaje
  const handlePassengerOnBoard = useCallback(async () => {
    setError('');
    setBusy(true);
    try {
      let coordinates = null;
      try {
        const route = await getRoute(trip.origin, trip.destination);
        coordinates = route.coordinates;
      } catch (routeError) {
        // Si OSRM falla, el viaje sigue y se dibuja una línea recta
        console.log('No se pudo calcular la ruta al destino:', routeError);
      }
      await startTrip(trip.id, coordinates);
    } catch (err) {
      console.log('Error iniciando el viaje:', err);
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }, [trip]);

  // Finalizar: tarifa final con la MISMA función de la estimación (PDF sección 4)
  const handleFinish = useCallback(async () => {
    setError('');
    setBusy(true);
    try {
      const fareResult = calculateFare({
        distanceKm: trip.distanceKm,
        durationMin: trip.durationMin,
        category: trip.category,
        tip: 0,
      });
      await completeTrip(trip.id, fareResult);
      // El ActiveTripContext ve el cambio a "completed" y abre el resumen solo
    } catch (err) {
      console.log('Error finalizando el viaje:', err);
      setError(getErrorMessage(err));
      setBusy(false);
    }
  }, [trip]);

  const handleCancel = useCallback(() => {
    Alert.alert('Cancelar viaje', '¿Seguro que quieres cancelar este viaje?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelTrip(trip.id);
          } catch (err) {
            console.log('Error cancelando el viaje:', err);
            setError(getErrorMessage(err));
          }
        },
      },
    ]);
  }, [trip]);

  // Abre la navegación paso a paso en Google Maps (o el navegador)
  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...toMapPoint(target),
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        <Marker coordinate={toMapPoint(trip.origin)} title="Recogida" pinColor="green" />
        <Marker coordinate={toMapPoint(trip.destination)} title="Destino" />
        {/* El conductor se muestra como un carro y se mueve con el GPS */}
        <CarMarker coordinate={location} />
        {routeCoordinates?.length ? (
          <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor={colors.primary} />
        ) : null}
      </MapView>

      <View style={styles.card}>
        <View style={styles.phaseRow}>
          <Ionicons
            name={isGoingToPickup ? 'person-outline' : 'flag-outline'}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.phaseText}>
            {isGoingToPickup ? 'Ve a recoger al pasajero' : 'Lleva al pasajero a su destino'}
          </Text>
        </View>

        <Text style={styles.address} numberOfLines={2}>
          {target.address}
        </Text>

        <Text style={styles.meta}>
          {isGoingToPickup
            ? pickupRoute
              ? `${formatKm(pickupRoute.distanceKm)} · ${formatMinutes(pickupRoute.durationMin)} hasta la recogida`
              : 'Calculando ruta...'
            : `${formatKm(trip.distanceKm)} · ${formatMinutes(trip.durationMin)} de viaje`}
        </Text>

        {trip.passengerName ? (
          <Text style={styles.passenger}>Pasajero: {trip.passengerName}</Text>
        ) : null}

        <Pressable style={styles.mapsLink} onPress={openInMaps}>
          <Ionicons name="navigate-outline" size={16} color={colors.primary} />
          <Text style={styles.mapsLinkText}>Abrir navegación en Google Maps</Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {isGoingToPickup ? (
          <>
            <PrimaryButton title="Pasajero a bordo" onPress={handlePassengerOnBoard} loading={busy} />
            <Pressable onPress={handleCancel} disabled={busy}>
              <Text style={styles.cancelText}>Cancelar viaje</Text>
            </Pressable>
          </>
        ) : (
          <PrimaryButton title="Finalizar viaje" onPress={handleFinish} loading={busy} />
        )}

        {!location ? (
          <View style={styles.locating}>
            <ActivityIndicator size="small" color={colors.textMuted} />
            <Text style={styles.locatingText}>Obteniendo tu ubicación...</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  phaseText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  address: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    color: colors.textMuted,
  },
  passenger: {
    color: colors.text,
  },
  mapsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  mapsLinkText: {
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  error: {
    color: colors.danger,
    fontWeight: '600',
  },
  cancelText: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '700',
    paddingVertical: spacing.sm,
  },
  locating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  locatingText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});