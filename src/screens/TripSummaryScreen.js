import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useActiveTrip from '../hooks/useActiveTrip';
import PrimaryButton from '../components/PrimaryButton';
import { confirmCashPayment, switchToCash, closeTrip } from '../services/tripService';
import { formatMoney, formatKm, formatMinutes } from '../utils/format';
import { getErrorMessage } from '../utils/firebaseErrors';
import { PAYMENT_METHODS, getOptionLabel } from '../constants/options';
import { colors, spacing, radius } from '../theme/colors';

const PAYMENT_STATUS = {
  approved: { label: 'Aprobado', color: colors.success, icon: 'checkmark-circle' },
  pending: { label: 'Pendiente', color: colors.warning, icon: 'time' },
  rejected: { label: 'Rechazado', color: colors.danger, icon: 'close-circle' },
  cash: { label: 'Efectivo', color: colors.success, icon: 'cash' },
};

export default function TripSummaryScreen() {
  const { activeTrip: trip } = useActiveTrip();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!trip) return null;

  const isPaid = trip.status === 'paid';
  const isCash = trip.paymentMethod === 'cash';
  const paymentStatus = PAYMENT_STATUS[trip.paymentStatus] || PAYMENT_STATUS.pending;

  const run = async (action) => {
    setError('');
    setBusy(true);
    try {
      await action();
    } catch (err) {
      console.log('Error en el cobro:', err);
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="flag" size={40} color={colors.primary} />
        <Text style={styles.title}>Viaje finalizado</Text>
        <Text style={styles.subtitle}>
          {formatKm(trip.distanceKm)} · {formatMinutes(trip.durationMin)} ·{' '}
          {getOptionLabel(PAYMENT_METHODS, trip.paymentMethod)}
        </Text>
      </View>

      <View style={styles.card}>
        <Row label="Tarifa del viaje" value={formatMoney(trip.fare)} />
        <Row
          label={`Comisión plataforma (${Math.round(trip.commissionRate * 100)}%)`}
          value={`- ${formatMoney(trip.commission)}`}
          muted
        />
        <Row label="Propina" value={formatMoney(trip.tip)} muted />
        <View style={styles.divider} />
        <Row label="Tu ganancia neta" value={formatMoney(trip.driverEarnings)} highlight />
      </View>

      <View style={[styles.statusBox, { borderColor: paymentStatus.color }]}>
        <Ionicons name={paymentStatus.icon} size={22} color={paymentStatus.color} />
        <Text style={[styles.statusText, { color: paymentStatus.color }]}>
          Pago: {paymentStatus.label}
        </Text>
      </View>

      {isCash && !isPaid ? (
        <Text style={styles.note}>
          Cobra {formatMoney(trip.fare)} en efectivo al pasajero. La comisión de{' '}
          {formatMoney(trip.commission)} se descontará de tu saldo.
        </Text>
      ) : null}

      {!isCash && !isPaid ? (
        <Text style={styles.note}>Esperando a que el pasajero pague con Mercado Pago...</Text>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isPaid ? (
        <PrimaryButton title="Listo" onPress={() => run(() => closeTrip(trip.id))} loading={busy} />
      ) : isCash ? (
        <PrimaryButton
          title="Confirmar pago en efectivo"
          onPress={() => run(() => confirmCashPayment(trip))}
          loading={busy}
        />
      ) : (
        <Pressable onPress={() => run(() => switchToCash(trip.id))} disabled={busy}>
          <Text style={styles.link}>El pasajero pagará en efectivo</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

// Fila de la tabla de valores
function Row({ label, value, muted, highlight }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, highlight && styles.rowLabelBold]}>{label}</Text>
      <Text
        style={[styles.rowValue, muted && styles.rowValueMuted, highlight && styles.rowValueBig]}
      >
        {value}
      </Text>
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
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: colors.text,
    fontSize: 15,
  },
  rowLabelBold: {
    fontWeight: '800',
  },
  rowValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  rowValueMuted: {
    color: colors.textMuted,
  },
  rowValueBig: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '800',
  },
  note: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '700',
    textDecorationLine: 'underline',
    paddingVertical: spacing.sm,
  },
});