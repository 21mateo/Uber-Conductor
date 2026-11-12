import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getTrip } from '../services/historyService';
import { formatMoney, formatKm, formatMinutes } from '../utils/format';
import { formatDateTime } from '../utils/dates';
import { CATEGORIES, PAYMENT_METHODS, getOptionLabel } from '../constants/options';
import { colors, spacing, radius } from '../theme/colors';

const toMapPoint = (point) => ({ latitude: point.lat, longitude: point.lng });

const PAYMENT_STATUS_LABELS = {
  approved: 'Aprobado',
  cash: 'Efectivo',
  pending: 'Pendiente',
  rejected: 'Rechazado',
};

export default function TripDetailScreen({ route }) {
  const { tripId } = route.params;
  const mapRef = useRef(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTrip(tripId)
      .then((data) => {
        if (!cancelled) setTrip(data);
      })
      .catch((err) => console.log('Error cargando el viaje:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />;
  }

  if (!trip) {
    return <Text style={styles.empty}>No se encontró el viaje.</Text>;
  }

  // Ruta guardada en el viaje; si no hay, una línea recta (sin Static Maps, PDF sección 7)
  const routeCoordinates = trip.route || [toMapPoint(trip.origin), toMapPoint(trip.destination)];

  const fitRoute = () => {
    mapRef.current?.fitToCoordinates(routeCoordinates, {
      edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
      animated: false,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onMapReady={fitRoute}
        initialRegion={{ ...toMapPoint(trip.origin), latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      >
        <Marker coordinate={toMapPoint(trip.origin)} title="Origen" pinColor="green" />
        <Marker coordinate={toMapPoint(trip.destination)} title="Destino" />
        <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor={colors.primary} />
      </MapView>

      <View style={styles.card}>
        <Text style={styles.date}>{formatDateTime(trip.completedAt)}</Text>
        <Text style={styles.address}>🟢 {trip.origin.address}</Text>
        <Text style={styles.address}>⬛ {trip.destination.address}</Text>
      </View>

      <View style={styles.card}>
        <Row label="Distancia" value={formatKm(trip.distanceKm)} />
        <Row label="Duración" value={formatMinutes(trip.durationMin)} />
        <Row label="Categoría" value={getOptionLabel(CATEGORIES, trip.category)} />
        <Row label="Método de pago" value={getOptionLabel(PAYMENT_METHODS, trip.paymentMethod)} />
        <Row label="Estado del pago" value={PAYMENT_STATUS_LABELS[trip.paymentStatus] || '—'} />
        <Row
          label="Calificación del pasajero"
          value={trip.rating ? `${'★'.repeat(trip.rating)} (${trip.rating}/5)` : 'Sin calificación'}
        />
      </View>

      <View style={styles.card}>
        <Row label="Tarifa" value={formatMoney(trip.fare)} />
        <Row
          label={`Comisión (${Math.round((trip.commissionRate || 0) * 100)}%)`}
          value={`- ${formatMoney(trip.commission)}`}
        />
        <Row label="Propina" value={formatMoney(trip.tip)} />
        <View style={styles.divider} />
        <Row label="Ganancia neta" value={formatMoney(trip.driverEarnings)} bold />
      </View>
    </ScrollView>
  );
}

function Row({ label, value, bold }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.boldValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  loading: {
    marginTop: spacing.xxl,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    color: colors.textMuted,
  },
  map: {
    height: 220,
    borderRadius: radius.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  date: {
    color: colors.textMuted,
    fontSize: 13,
  },
  address: {
    color: colors.text,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowLabel: {
    color: colors.textMuted,
    flexShrink: 1,
  },
  rowValue: {
    color: colors.text,
    fontWeight: '600',
  },
  bold: {
    color: colors.text,
    fontWeight: '800',
  },
  boldValue: {
    color: colors.success,
    fontWeight: '800',
    fontSize: 17,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});