import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateFare } from '../utils/calculateFare';
import { formatMoney, formatKm, formatMinutes } from '../utils/format';
import { CATEGORIES, PAYMENT_METHODS, getOptionLabel } from '../constants/options';
import { colors, spacing, radius } from '../theme/colors';

export const REQUEST_TIMEOUT_SECONDS = 15;

export default function TripRequestCard({ request, onAccept, onReject, onTimeout, loading }) {
  const [secondsLeft, setSecondsLeft] = useState(REQUEST_TIMEOUT_SECONDS);

  const estimate = useMemo(
    () =>
      calculateFare({
        distanceKm: request.distanceKm,
        durationMin: request.durationMin,
        category: request.category,
      }),
    [request.distanceKm, request.durationMin, request.category]
  );

  // Temporizador de 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    // Función de limpieza: detiene el temporizador cuando la tarjeta se cierra
    return () => clearInterval(interval);
  }, []);

  // Si llega a cero (y no está aceptando en ese momento) se rechaza sola
  useEffect(() => {
    if (secondsLeft === 0 && !loading) {
      onTimeout();
    }
  }, [secondsLeft]);

  const progress = secondsLeft / REQUEST_TIMEOUT_SECONDS;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Nueva solicitud</Text>
        <View style={[styles.timer, secondsLeft <= 5 && styles.timerUrgent]}>
          <Text style={styles.timerText}>{secondsLeft}s</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress * 100}%` },
            secondsLeft <= 5 && styles.progressUrgent,
          ]}
        />
      </View>

      <View style={styles.moneyRow}>
        <View>
          <Text style={styles.moneyLabel}>Ganancia estimada</Text>
          <Text style={styles.earnings}>{formatMoney(estimate.driverEarnings)}</Text>
        </View>
        <View style={styles.fareBox}>
          <Text style={styles.moneyLabel}>Tarifa</Text>
          <Text style={styles.fare}>{formatMoney(estimate.fare)}</Text>
        </View>
      </View>

      <View style={styles.route}>
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, styles.originDot]} />
          <Text style={styles.address} numberOfLines={2}>
            {request.origin.address}
          </Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, styles.destinationDot]} />
          <Text style={styles.address} numberOfLines={2}>
            {request.destination.address}
          </Text>
        </View>
      </View>

      <View style={styles.chips}>
        <Text style={styles.chip}>{formatKm(request.distanceKm)}</Text>
        <Text style={styles.chip}>{formatMinutes(request.durationMin)}</Text>
        <Text style={styles.chip}>{getOptionLabel(CATEGORIES, request.category)}</Text>
        <Text style={styles.chip}>{getOptionLabel(PAYMENT_METHODS, request.paymentMethod)}</Text>
      </View>

      {request.passengerName ? (
        <View style={styles.passenger}>
          <Ionicons name="person-circle-outline" size={18} color={colors.textMuted} />
          <Text style={styles.passengerText}>{request.passengerName}</Text>
        </View>
      ) : null}

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, styles.rejectButton]}
          onPress={onReject}
          disabled={loading}
        >
          <Text style={styles.rejectText}>Rechazar</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.acceptButton, loading && styles.disabled]}
          onPress={onAccept}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.acceptText}>Aceptar</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  timer: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  timerUrgent: {
    backgroundColor: colors.danger,
  },
  timerText: {
    color: colors.white,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
  },
  progressUrgent: {
    backgroundColor: colors.danger,
  },
  moneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  moneyLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  earnings: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.success,
  },
  fareBox: {
    alignItems: 'flex-end',
  },
  fare: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  route: {
    gap: 2,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  routeDot: {
    width: 10,
    height: 10,
  },
  originDot: {
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  destinationDot: {
    backgroundColor: colors.text,
  },
  routeLine: {
    width: 2,
    height: 14,
    backgroundColor: colors.border,
    marginLeft: 4,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  passenger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  passengerText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rejectButton: {
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  rejectText: {
    color: colors.danger,
    fontWeight: '800',
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  acceptText: {
    color: colors.white,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.6,
  },
});