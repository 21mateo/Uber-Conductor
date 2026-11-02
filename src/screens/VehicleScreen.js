import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import useRegister from '../hooks/useRegister';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import ImageField from '../components/ImageField';
import PrimaryButton from '../components/PrimaryButton';
import { CATEGORIES, VEHICLE_COLORS } from '../constants/options';
import { registerDriver } from '../services/driverService';
import { getErrorMessage } from '../utils/firebaseErrors';
import { colors, spacing } from '../theme/colors';

export default function VehicleScreen({ navigation }) {
  const {
    personalData,
    vehicleData,
    updateVehicle,
    vehicleErrors,
    isPersonalValid,
    isVehicleValid,
    showAllPersonalErrors,
    showAllVehicleErrors,
  } = useRegister();

  const canSubmit = isPersonalValid && isVehicleValid;

  const scrollRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleShowPending = () => {
    showAllPersonalErrors();
    showAllVehicleErrors();

    if (!isPersonalValid) {
      navigation.navigate('Personal');
    } else {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setLoading(true);
    try {
      await registerDriver(personalData, vehicleData);
      Alert.alert('Registro enviado', 'Tu cuenta quedó pendiente de aprobación.');
    } catch (error) {
      console.log('Error en el registro:', error);
      setSubmitError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.subtitle}>Paso 2 de 3</Text>

        <SelectField
          label="Categoría"
          selectedValue={vehicleData.category}
          onValueChange={(value) => updateVehicle('category', value)}
          options={CATEGORIES}
          error={vehicleErrors.category}
        />

        <InputField
          label="Placa"
          placeholder="Ej: ABC123"
          value={vehicleData.plate}
          onChangeText={(text) => updateVehicle('plate', text.toUpperCase())}
          error={vehicleErrors.plate}
          autoCapitalize="characters"
          maxLength={7}
        />

        <InputField
          label="Marca"
          placeholder="Ej: Chevrolet"
          value={vehicleData.brand}
          onChangeText={(text) => updateVehicle('brand', text)}
          error={vehicleErrors.brand}
          maxLength={30}
        />

        <InputField
          label="Modelo"
          placeholder="Ej: Onix"
          value={vehicleData.model}
          onChangeText={(text) => updateVehicle('model', text)}
          error={vehicleErrors.model}
          maxLength={30}
        />

        <InputField
          label="Año"
          placeholder="Ej: 2020"
          value={vehicleData.year}
          onChangeText={(text) => updateVehicle('year', text)}
          error={vehicleErrors.year}
          keyboardType="numeric"
          maxLength={4}
        />

        <SelectField
          label="Color"
          selectedValue={vehicleData.color}
          onValueChange={(value) => updateVehicle('color', value)}
          options={VEHICLE_COLORS}
          error={vehicleErrors.color}
        />

        <InputField
          label="Capacidad de pasajeros"
          placeholder={vehicleData.category === 'xl' ? 'Mínimo 6 para XL' : 'Ej: 4'}
          value={vehicleData.capacity}
          onChangeText={(text) => updateVehicle('capacity', text)}
          error={vehicleErrors.capacity}
          keyboardType="numeric"
          maxLength={1}
        />

        <ImageField
          label="Foto del vehículo"
          hint="Debe verse la placa del vehículo"
          imageUri={vehicleData.photo}
          onImageSelected={(uri) => updateVehicle('photo', uri)}
          error={vehicleErrors.photo}
          aspect={[4, 3]}
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
            <Text style={styles.pendingText}>
              {!isPersonalValid
                ? 'Faltan datos en la pestaña Datos personales.'
                : 'Completa todos los campos del vehículo para enviar.'}
            </Text>
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
    marginBottom: spacing.xl,
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