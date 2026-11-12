import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import useEarnings from '../hooks/useEarnings';
import Chip from '../components/Chip';
import { formatMoney } from '../utils/format';
import { colors, spacing, radius } from '../theme/colors';

const PERIODS = [
  { label: 'Hoy', value: 'today' },
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
];

export default function EarningsScreen() {
  const { user, driver } = useAuth();
  const { summaries, loading, error } = useEarnings(user?.uid);
  const [period, setPeriod] = useState('today');

  const summary = summaries[period];
  const balance = driver?.balance || 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Saldo: ganancias por la pasarela menos comisiones de efectivo (PDF sección 5) */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Tu saldo</Text>
        <Text style={[styles.balance, balance < 0 && styles.balanceNegative]}>
          {formatMoney(balance)}
        </Text>
        <Text style={styles.balanceHint}>
          Ganancias de viajes pagados con Mercado Pago menos las comisiones de los viajes en
          efectivo.
        </Text>
      </View>

      <View style={styles.chips}>
        {PERIODS.map((item) => (
          <Chip
            key={item.value}
            label={item.label}
            selected={period === item.value}
            onPress={() => setPeriod(item.value)}
          />
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <View style={styles.netCard}>
            <Text style={styles.netLabel}>Ganancia neta</Text>
            <Text style={styles.net}>{formatMoney(summary.net)}</Text>
            <Text style={styles.netTrips}>
              {summary.count} {summary.count === 1 ? 'viaje' : 'viajes'}
            </Text>
          </View>

          <View style={styles.grid}>
            <Stat icon="cash-outline" label="Total facturado" value={formatMoney(summary.gross)} />
            <Stat
              icon="remove-circle-outline"
              label="Comisiones"
              value={formatMoney(summary.commissions)}
            />
            <Stat icon="gift-outline" label="Propinas" value={formatMoney(summary.tips)} />
            <Stat
              icon="stats-chart-outline"
              label="Promedio por viaje"
              value={formatMoney(summary.average)}
            />
          </View>

          {summary.count === 0 ? (
            <Text style={styles.empty}>No tienes viajes pagados en este periodo.</Text>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

// Tarjeta pequeña de un dato
function Stat({ icon, label, value }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  balanceLabel: {
    color: colors.border,
    fontSize: 13,
  },
  balance: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
    marginVertical: spacing.xs,
  },
  balanceNegative: {
    color: '#FCA5A5',
  },
  balanceHint: {
    color: colors.border,
    fontSize: 12,
    lineHeight: 17,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  loading: {
    marginTop: spacing.xl,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
  netCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  netLabel: {
    color: colors.textMuted,
  },
  net: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.success,
  },
  netTrips: {
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  stat: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
  },
});