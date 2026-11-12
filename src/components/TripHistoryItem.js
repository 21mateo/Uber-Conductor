import { View, Text, Pressable, StyleSheet } from 'react-native';
import { formatMoney } from '../utils/format';
import { formatDateTime } from '../utils/dates';
import { CATEGORIES, getOptionLabel } from '../constants/options';
import { colors, spacing, radius } from '../theme/colors';

const PAYMENT_LABELS = {
  approved: { label: 'Aprobado', color: colors.success },
  cash: { label: 'Efectivo', color: colors.primary },
  pending: { label: 'Pendiente', color: colors.warning },
  rejected: { label: 'Rechazado', color: colors.danger },
};

// Un viaje dentro del historial 
export default function TripHistoryItem({ trip, onPress }) {
  const payment = PAYMENT_LABELS[trip.paymentStatus] || PAYMENT_LABELS.pending;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.date}>{formatDateTime(trip.completedAt)}</Text>
        <Text style={[styles.badge, { color: payment.color, borderColor: payment.color }]}>
          {payment.label}
        </Text>
      </View>

      <Text style={styles.route} numberOfLines={1}>
        {trip.origin?.address}
      </Text>
      <Text style={styles.arrow}>↓</Text>
      <Text style={styles.route} numberOfLines={1}>
        {trip.destination?.address}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.category}>{getOptionLabel(CATEGORIES, trip.category)}</Text>
        <Text style={styles.fare}>Tarifa {formatMoney(trip.fare)}</Text>
        <Text style={styles.earnings}>{formatMoney(trip.driverEarnings)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 13,
    color: colors.textMuted,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  route: {
    fontSize: 14,
    color: colors.text,
  },
  arrow: {
    color: colors.textMuted,
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  category: {
    fontSize: 12,
    color: colors.textMuted,
  },
  fare: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  earnings: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
});