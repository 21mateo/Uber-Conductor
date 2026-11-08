import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import MapView from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import useDriverLocation from '../hooks/useDriverLocation';
import { updateDriverAvailability } from '../services/driverService';
import { colors, spacing, radius } from '../theme/colors';

const MAP_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

// Llave de AsyncStorage para recordar la última disponibilidad de cada conductor
const availabilityKey = (uid) => `lastAvailability_${uid}`;

export default function HomeScreen() {
  const { user, driver } = useAuth();
  const isFocused = useIsFocused(); 
  const mapRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isApproved = driver?.status === 'approved';
  const isAvailable = isApproved && driver?.isAvailable === true;

  const { location, permissionDenied } = useDriverLocation(user?.uid, isAvailable && isFocused);

  const changeAvailability = useCallback(
    async (value) => {
      setError('');
      setSaving(true);
      try {
        await updateDriverAvailability(user.uid, value);
        await AsyncStorage.setItem(availabilityKey(user.uid), String(value));
      } catch (err) {
        console.log('Error cambiando disponibilidad:', err);
        setError('No se pudo cambiar tu estado. Revisa tu conexión.');
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user || !driver) return;

    if (!isApproved && driver.isAvailable) {
      changeAvailability(false);
      return;
    }

    if (isApproved) {
      AsyncStorage.getItem(availabilityKey(user.uid)).then((saved) => {
        if (saved === 'true' && !driver.isAvailable) {
          changeAvailability(true);
        }
      });
    }
  }, [user, isApproved]);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({ ...location, ...MAP_DELTA }, 500);
    }
  }, [location]);

  if (permissionDenied) {
    return (
      <View style={styles.center}>
        <Ionicons name="location-outline" size={56} color={colors.textMuted} />
        <Text style={styles.centerTitle}>Necesitamos tu ubicación</Text>
        <Text style={styles.centerText}>
          Para recibir viajes debes permitir el acceso a la ubicación.
        </Text>
        <Pressable style={styles.settingsButton} onPress={() => Linking.openSettings()}>
          <Text style={styles.settingsText}>Abrir ajustes</Text>
        </Pressable>
      </View>
    );
  }

  // Mientras se obtiene la primera ubicación
  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Buscando tu ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ ...location, ...MAP_DELTA }}
        showsUserLocation
      />

      <View style={styles.panel}>
        {!isApproved && (
          <View style={styles.warning}>
            <Ionicons name="time-outline" size={20} color={colors.warning} />
            <Text style={styles.warningText}>
              {driver?.status === 'rejected'
                ? 'Tu registro fue rechazado. Comunícate con soporte.'
                : 'Tu cuenta está pendiente de aprobación. Podrás ponerte disponible cuando sea aprobada.'}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={[styles.dot, isAvailable ? styles.dotOn : styles.dotOff]} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>{isAvailable ? 'Disponible' : 'No disponible'}</Text>
            <Text style={styles.statusText}>
              {isAvailable
                ? 'Estás recibiendo solicitudes de viaje'
                : 'Activa el interruptor para recibir viajes'}
            </Text>
          </View>

          {saving ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Switch
              value={isAvailable}
              onValueChange={changeAvailability}
              disabled={!isApproved}
              trackColor={{ true: colors.success }}
            />
          )}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
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
  panel: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  warning: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotOn: {
    backgroundColor: colors.success,
  },
  dotOff: {
    backgroundColor: colors.textMuted,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  statusText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  centerText: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  settingsButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  settingsText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});