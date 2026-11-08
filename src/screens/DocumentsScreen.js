import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useRegister from '../hooks/useRegister';
import InputField from '../components/InputField';
import DateField from '../components/DateField';
import ImageField from '../components/ImageField';
import CheckboxField from '../components/CheckboxField';
import PrimaryButton from '../components/PrimaryButton';
import { registerDriver } from '../services/driverService';
import { getErrorMessage } from '../utils/firebaseErrors';
import { PRICING } from '../config/pricing';
import { colors, spacing, radius } from '../theme/colors';

const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

// 0.2 → 20
const COMMISSION_PERCENT = Math.round(PRICING.commissionRate * 100);

export default function DocumentsScreen({ navigation }) {
  const {
    personalData,
    vehicleData,
    documentsData,
    updateDocuments,
    documentsErrors,
    isPersonalValid,
    isVehicleValid,
    isDocumentsValid,
    needsTechReview,
    showAllPersonalErrors,
    showAllVehicleErrors,
    showAllDocumentsErrors,
  } = useRegister();

  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // El botón solo se habilita cuando las tres pestañas están completas (PDF sección 2)
  const canSubmit = isPersonalValid && isVehicleValid && isDocumentsValid;
  const tomorrow = getTomorrow();
  const hasValidYear = /^\d{4}$/.test(vehicleData.year);

  const handleShowPending = () => {
    showAllPersonalErrors();
    showAllVehicleErrors();
    showAllDocumentsErrors();

    if (!isPersonalValid) {
      navigation.navigate('Personal');
    } else if (!isVehicleValid) {
      navigation.navigate('Vehicle');
    } else {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setLoading(true);
    try {
      await registerDriver(personalData, vehicleData, documentsData);
    } catch (error) {
      console.log('Error en el registro:', error);
      setSubmitError(getErrorMessage(error));
      setLoading(false);
    }
  };

  const getPendingMessage = () => {
    if (!isPersonalValid) return 'Faltan datos en la pestaña Datos personales.';
    if (!isVehicleValid) return 'Faltan datos en la pestaña Vehículo.';
    return 'Completa todos los documentos para enviar.';
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>Paso 3 de 3</Text>

        <Text style={styles.sectionTitle}>Licencia de conducción</Text>

        <InputField
          label="Número de licencia"
          placeholder="Entre 6 y 10 dígitos"
          value={documentsData.licenseNumber}
          onChangeText={(text) => updateDocuments('licenseNumber', text)}
          error={documentsErrors.licenseNumber}
          keyboardType="numeric"
          maxLength={10}
        />

        <ImageField
          label="Foto de la licencia"
          imageUri={documentsData.licensePhoto}
          onImageSelected={(uri) => updateDocuments('licensePhoto', uri)}
          error={documentsErrors.licensePhoto}
          aspect={[4, 3]}
        />

        <DateField
          label="Fecha de vencimiento"
          value={documentsData.licenseExpiry}
          onChange={(date) => updateDocuments('licenseExpiry', date)}
          error={documentsErrors.licenseExpiry}
          minimumDate={tomorrow}
          initialDate={tomorrow}
        />

        <Text style={styles.sectionTitle}>SOAT</Text>

        <ImageField
          label="Foto del SOAT"
          imageUri={documentsData.soatPhoto}
          onImageSelected={(uri) => updateDocuments('soatPhoto', uri)}
          error={documentsErrors.soatPhoto}
          aspect={[4, 3]}
        />

        <DateField
          label="Fecha de vencimiento"
          value={documentsData.soatExpiry}
          onChange={(date) => updateDocuments('soatExpiry', date)}
          error={documentsErrors.soatExpiry}
          minimumDate={tomorrow}
          initialDate={tomorrow}
        />

        <Text style={styles.sectionTitle}>Revisión técnico-mecánica</Text>

        {needsTechReview ? (
          <>
            <ImageField
              label="Foto del certificado"
              imageUri={documentsData.techReviewPhoto}
              onImageSelected={(uri) => updateDocuments('techReviewPhoto', uri)}
              error={documentsErrors.techReviewPhoto}
              aspect={[4, 3]}
            />

            <DateField
              label="Fecha de vencimiento"
              value={documentsData.techReviewExpiry}
              onChange={(date) => updateDocuments('techReviewExpiry', date)}
              error={documentsErrors.techReviewExpiry}
              minimumDate={tomorrow}
              initialDate={tomorrow}
            />
          </>
        ) : (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textMuted} />
            <Text style={styles.infoText}>
              {hasValidYear
                ? `Tu vehículo es modelo ${vehicleData.year}. Los carros particulares hacen la primera revisión a los 5 años, así que todavía no la necesitas.`
                : 'Escribe el año del vehículo en la pestaña Vehículo para saber si necesitas esta revisión.'}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Pagos</Text>
        <Text style={styles.hint}>
          Aquí recibirías tus pagos. No guardamos números de cuenta ni de tarjeta.
        </Text>

        <InputField
          label="Correo de tu cuenta de Mercado Pago"
          placeholder="Ej: conductor@gmail.com"
          value={documentsData.mercadoPagoEmail}
          onChangeText={(text) => updateDocuments('mercadoPagoEmail', text)}
          error={documentsErrors.mercadoPagoEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* ---------- Términos ---------- */}
        <CheckboxField
          label={`Acepto los términos y condiciones. La plataforma cobra una comisión del ${COMMISSION_PERCENT}% sobre la tarifa de cada viaje; las propinas son 100% para el conductor.`}
          checked={documentsData.acceptedTerms}
          onChange={(value) => updateDocuments('acceptedTerms', value)}
          error={documentsErrors.acceptedTerms}
        />

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <PrimaryButton
          title="Enviar registro"
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={loading}
        />

        {!canSubmit && (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>{getPendingMessage()}</Text>
            <Pressable onPress={handleShowPending}>
              <Text style={styles.pendingLink}>Ver campos pendientes</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  subtitle: {
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  submitError: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  pendingBox: {
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  pendingText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  pendingLink: {
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});