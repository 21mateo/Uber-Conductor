import { useRef } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import useRegister from '../hooks/useRegister';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import ImageField from '../components/ImageField';
import PrimaryButton from '../components/PrimaryButton';
import { CATEGORIES, VEHICLE_COLORS } from '../constants/options';
import { colors, spacing } from '../theme/colors';

export default function VehicleScreen({ navigation }) {
  const { vehicleData, updateVehicle, vehicleErrors, isVehicleValid, showAllVehicleErrors } =
    useRegister();

  const scrollRef = useRef(null);

  const handleNext = () => {
    showAllVehicleErrors();
    if (isVehicleValid) {
      navigation.navigate('Documents');
    } else {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
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

        <PrimaryButton title="Siguiente" onPress={handleNext} />
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
});