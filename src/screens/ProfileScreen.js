import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { updateDriverContact } from '../services/profileService';
import { updateDriverAvailability } from '../services/driverService';
import { logoutUser } from '../services/authService';
import { validatePhone, validateEmail, hasErrors } from '../utils/validators';
import { formatDate, toDate, startOfDay } from '../utils/dates';
import { getErrorMessage } from '../utils/firebaseErrors';
import { CATEGORIES, VEHICLE_COLORS, getOptionLabel } from '../constants/options';
import { colors, spacing, radius } from '../theme/colors';

// Estado de la cuenta
const STATUS_INFO = {
  pending: { icon: 'time-outline', color: colors.warning, label: 'Pendiente de aprobación' },
  approved: { icon: 'checkmark-circle-outline', color: colors.success, label: 'Cuenta aprobada' },
  rejected: { icon: 'close-circle-outline', color: colors.danger, label: 'Registro rechazado' },
};

// true si la fecha de vencimiento ya pasó
const isExpired = (value) => {
  const date = toDate(value);
  return date ? date < startOfDay() : false;
};

export default function ProfileScreen() {
  const { driver } = useAuth();

  const [phone, setPhone] = useState('');
  const [mpEmail, setMpEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Llena el formulario con los datos actuales
  useEffect(() => {
    if (driver) {
      setPhone(driver.personal.phone || '');
      setMpEmail(driver.payment?.mercadoPagoEmail || '');
    }
  }, [driver?.id]);

  if (!driver) return null;

  const status = STATUS_INFO[driver.status] || STATUS_INFO.pending;
  const { license, soat, techReview } = driver.documents || {};

  const handleSave = async () => {
    const newErrors = { phone: validatePhone(phone), mpEmail: validateEmail(mpEmail) };
    setErrors(newErrors);
    setMessage('');
    if (hasErrors(newErrors)) return;

    setSaving(true);
    try {
      await updateDriverContact(driver.id, { phone, mercadoPagoEmail: mpEmail });
      setMessage('Datos actualizados ✅');
    } catch (err) {
      console.log('Error actualizando el perfil:', err);
      setMessage(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Antes de salir se pone No disponible
      if (driver.isAvailable) await updateDriverAvailability(driver.id, false);
      await logoutUser();
    } catch (err) {
      console.log('Error al cerrar sesión:', err);
      setLoggingOut(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Encabezado */}
        <View style={styles.header}>
          <Image source={{ uri: driver.personal.photoUrl }} style={styles.avatar} />
          <Text style={styles.name}>{driver.personal.fullName}</Text>
          <Text style={styles.muted}>{driver.personal.email}</Text>
          <View style={[styles.statusPill, { borderColor: status.color }]}>
            <Ionicons name={status.icon} size={16} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        {/* Datos editables */}
        <Text style={styles.sectionTitle}>Datos de contacto</Text>
        <View style={styles.card}>
          <InputField
            label="Número de celular"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <InputField
            label="Correo de Mercado Pago"
            value={mpEmail}
            onChangeText={setMpEmail}
            error={errors.mpEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <PrimaryButton title="Guardar cambios" onPress={handleSave} loading={saving} />
        </View>

        {/* Vehículo */}
        <Text style={styles.sectionTitle}>Vehículo</Text>
        <View style={styles.card}>
          <Image source={{ uri: driver.vehicle.photoUrl }} style={styles.vehiclePhoto} />
          <Row label="Placa" value={driver.vehicle.plate} />
          <Row label="Marca y modelo" value={`${driver.vehicle.brand} ${driver.vehicle.model}`} />
          <Row label="Año" value={String(driver.vehicle.year)} />
          <Row label="Color" value={getOptionLabel(VEHICLE_COLORS, driver.vehicle.color)} />
          <Row label="Categoría" value={getOptionLabel(CATEGORIES, driver.vehicle.category)} />
          <Row label="Capacidad" value={`${driver.vehicle.capacity} pasajeros`} />
        </View>

        {/* Documentos */}
        <Text style={styles.sectionTitle}>Documentos</Text>
        <View style={styles.card}>
          <DocRow label="Licencia" expiry={license?.expiryDate} />
          <DocRow label="SOAT" expiry={soat?.expiryDate} />
          {techReview ? (
            <DocRow label="Revisión técnico-mecánica" expiry={techReview.expiryDate} />
          ) : (
            <Row label="Revisión técnico-mecánica" value="No aplica aún" />
          )}
        </View>

        <PrimaryButton title="Cerrar sesión" onPress={handleLogout} loading={loggingOut} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

// Documento con su vencimiento; en rojo si ya venció
function DocRow({ label, expiry }) {
  const expired = isExpired(expiry);
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={[styles.rowValue, expired && styles.expired]}>
        {expiry ? `${expired ? 'Vencido' : 'Vence'} ${formatDate(expiry)}` : '—'}
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
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.border,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  muted: {
    color: colors.textMuted,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  statusText: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehiclePhoto: {
    width: '100%',
    height: 150,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowValue: {
    color: colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  expired: {
    color: colors.danger,
  },
  message: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  },
});