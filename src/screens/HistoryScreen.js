import { useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import Chip from '../components/Chip';
import DateField from '../components/DateField';
import TripHistoryItem from '../components/TripHistoryItem';
import { getTripHistory } from '../services/historyService';
import { getPeriodRange } from '../utils/dates';
import { colors, spacing } from '../theme/colors';

const PERIODS = [
  { label: 'Hoy', value: 'today' },
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
  { label: 'Rango', value: 'range' },
];

const PAYMENT_FILTERS = [
  { label: 'Todos', value: '' },
  { label: 'Mercado Pago', value: 'mercadopago' },
  { label: 'Efectivo', value: 'cash' },
];

export default function HistoryScreen({ navigation }) {
  const { user } = useAuth();

  // Filtros
  const [period, setPeriod] = useState('month');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [rangeFrom, setRangeFrom] = useState(null);
  const [rangeTo, setRangeTo] = useState(null);

  // Datos y paginación
  const [trips, setTrips] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const { from, to } = getPeriodRange(period, rangeFrom, rangeTo);
  const rangeIncomplete = period === 'range' && (!from || !to);
  const rangeInvalid = period === 'range' && from && to && from > to;

  // Carga la primera página con los filtros actuales
  const loadFirstPage = useCallback(async () => {
    if (!user || rangeIncomplete || rangeInvalid) {
      setTrips([]);
      setHasMore(false);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await getTripHistory({ driverId: user.uid, from, to, paymentMethod });
      setTrips(result.trips);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.log('Error cargando el historial:', err);
      setError('No se pudo cargar el historial. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [user, period, paymentMethod, rangeFrom, rangeTo]);

  // Carga la siguiente página al llegar al final de la lista (20 por carga)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await getTripHistory({ driverId: user.uid, from, to, paymentMethod, lastDoc });
      setTrips((prev) => [...prev, ...result.trips]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.log('Error cargando más viajes:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loading, loadingMore, lastDoc, user, period, paymentMethod, rangeFrom, rangeTo]);

  // Se recarga al entrar a la pantalla y cada vez que cambia un filtro
  useFocusEffect(
    useCallback(() => {
      loadFirstPage();
    }, [loadFirstPage])
  );

  const getEmptyMessage = () => {
    if (rangeIncomplete) return 'Elige la fecha inicial y la final.';
    if (rangeInvalid) return 'La fecha inicial no puede ser mayor que la final.';
    return 'No tienes viajes en este filtro.';
  };

  return (
    <View style={styles.screen}>
      <View style={styles.filters}>
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

        {period === 'range' ? (
          <View style={styles.rangeRow}>
            <View style={styles.rangeField}>
              <DateField
                label="Desde"
                value={rangeFrom}
                onChange={setRangeFrom}
                maximumDate={new Date()}
              />
            </View>
            <View style={styles.rangeField}>
              <DateField label="Hasta" value={rangeTo} onChange={setRangeTo} maximumDate={new Date()} />
            </View>
          </View>
        ) : null}

        <View style={styles.chips}>
          {PAYMENT_FILTERS.map((item) => (
            <Chip
              key={item.value || 'all'}
              label={item.label}
              selected={paymentMethod === item.value}
              onPress={() => setPaymentMethod(item.value)}
            />
          ))}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripHistoryItem
            trip={item}
            onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadFirstPage} // deslizar hacia abajo para recargar
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>{getEmptyMessage()}</Text> : null
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color={colors.primary} style={styles.footer} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filters: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rangeField: {
    flex: 1,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    flexGrow: 1,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xxl,
  },
  footer: {
    marginVertical: spacing.lg,
  },
});