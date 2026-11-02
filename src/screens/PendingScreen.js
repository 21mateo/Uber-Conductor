import { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import PrimaryButton from '../components/PrimaryButton';
import { logoutUser } from '../services/authService';
import { CATEGORIES } from '../constants/options';
import { colors, spacing, radius } from '../theme/colors';

// Información que se muestra según el estado de la cuenta
const STATUS_INFO = {
  pending: {
    icon: 'time-outline',
    color: colors.warning,
    title: 'Pendiente de aprobación',
    message: 'Estamos revisando tus datos. Cuando tu cuenta sea aprobada podrás empezar a recibir viajes.',
  },
  approved: {
    icon: 'checkmark-circle-outline',
    color: colors.success,
    title: 'Cuenta aprobada',
    message: 'Tu cuenta fue aprobada. Muy pronto podrás ponerte disponible y recibir viajes.',
  },
  rejected: {
    icon: 'close-circle-outline',
    color: colors.danger,
    title: 'Registro rechazado',
    message: 'Tu registro no fue aprobado. Comunícate con soporte para más información.',
  },
};

const getCategoryLabel = (value) => {
  const category = CATEGORIES.find((item) => item.value === value);
  return category ? category.label : value;
};

export default function PendingScreen() {
  const { driver } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!driver) return null;

  const status = STATUS_INFO[driver.status] || STATUS_INFO.pending;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      // El AuthContext detecta que no hay usuario y vuelve al Login
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
      setLoggingOut(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.profile}>
        <Image source={{ uri: driver.personal.photoUrl }} style={styles.avatar} />
        <Text style={styles.name}>{driver.personal.fullName}</Text>
        <Text style={styles.email}>{driver.personal.email}</Text>
      </View>

      <View style={[styles.statusCard, { borderColor: status.color }]}>
        <Ionicons name={status.icon} size={40} color={status.color} />
        <Text style={[styles.statusTitle, { color: status.color }]}>{status.title}</Text>
        <Text style={styles.statusMessage}>{status.message}</Text>
      </View>

      <View style={styles.vehicleCard}>
        <Image source={{ uri: driver.vehicle.photoUrl }} style={styles.vehiclePhoto} />
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>
            {driver.vehicle.brand} {driver.vehicle.model} · {driver.vehicle.year}
          </Text>
          <Text style={styles.vehicleText}>Placa: {driver.vehicle.plate}</Text>
          <Text style={styles.vehicleText}>
            Categoría: {getCategoryLabel(driver.vehicle.category)}
          </Text>
        </View>
      </View>

      <PrimaryButton title="Cerrar sesión" onPress={handleLogout} loading={loggingOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profile: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  statusMessage: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  vehicleCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehiclePhoto: {
    width: '100%',
    height: 160,
    backgroundColor: colors.border,
  },
  vehicleInfo: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  vehicleText: {
    color: colors.textMuted,
  },
});