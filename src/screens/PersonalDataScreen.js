import { useRef } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import useRegister from '../hooks/useRegister';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import DateField from '../components/DateField';
import ImageField from '../components/ImageField';
import PrimaryButton from '../components/PrimaryButton';
import { GENDERS } from '../constants/options';
import { colors, spacing } from '../theme/colors';

export default function PersonalDataScreen({ navigation }) {
  const {
    personalData,
    updatePersonal,
    personalErrors,
    isPersonalValid,
    showAllPersonalErrors,
  } = useRegister();

  const scrollRef = useRef(null);

  const handleNext = () => {
    showAllPersonalErrors();
    if (isPersonalValid) {
      navigation.navigate('Vehicle');
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
        <Text style={styles.subtitle}>Paso 1 de 3</Text>

        <ImageField
          label="Foto de perfil"
          imageUri={personalData.photo}
          onImageSelected={(uri) => updatePersonal('photo', uri)}
          error={personalErrors.photo}
        />

        <InputField
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          value={personalData.fullName}
          onChangeText={(text) => updatePersonal('fullName', text)}
          error={personalErrors.fullName}
          maxLength={50}
          autoCapitalize="words"
        />

        <InputField
          label="Documento de identidad"
          placeholder="Entre 6 y 10 dígitos"
          value={personalData.documentId}
          onChangeText={(text) => updatePersonal('documentId', text)}
          error={personalErrors.documentId}
          keyboardType="numeric"
          maxLength={10}
        />

        <InputField
          label="Número de celular"
          placeholder="Ej: 3001234567"
          value={personalData.phone}
          onChangeText={(text) => updatePersonal('phone', text)}
          error={personalErrors.phone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <DateField
          label="Fecha de nacimiento"
          value={personalData.birthDate}
          onChange={(date) => updatePersonal('birthDate', date)}
          error={personalErrors.birthDate}
          maximumDate={new Date()}
          initialDate={new Date(2000, 0, 1)}
        />

        <SelectField
          label="Género"
          selectedValue={personalData.gender}
          onValueChange={(value) => updatePersonal('gender', value)}
          options={GENDERS}
          error={personalErrors.gender}
        />

        <InputField
          label="Correo electrónico"
          placeholder="Ej: conductor@gmail.com"
          value={personalData.email}
          onChangeText={(text) => updatePersonal('email', text)}
          error={personalErrors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Contraseña"
          placeholder="Mínimo 6 caracteres"
          value={personalData.password}
          onChangeText={(text) => updatePersonal('password', text)}
          error={personalErrors.password}
          secureTextEntry
          autoCapitalize="none"
        />

        <InputField
          label="Confirmar contraseña"
          value={personalData.confirmPassword}
          onChangeText={(text) => updatePersonal('confirmPassword', text)}
          error={personalErrors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
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