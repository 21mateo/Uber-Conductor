import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import InputField from './src/components/InputField';
import SelectField from './src/components/SelectField';
import PrimaryButton from './src/components/PrimaryButton';
import { GENDERS } from './src/constants/options';
import { validateFullName, validatePhone, validateSelect } from './src/utils/validators';

export default function App() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});

  const handleTest = () => {
    setErrors({
      fullName: validateFullName(fullName),
      phone: validatePhone(phone),
      gender: validateSelect(gender, 'un género'),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InputField
        label="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        maxLength={50}
      />
      <InputField
        label="Celular"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        keyboardType="numeric"
        maxLength={10}
      />
      <SelectField
        label="Género"
        selectedValue={gender}
        onValueChange={setGender}
        options={GENDERS}
        error={errors.gender}
      />
      <PrimaryButton title="Probar validación" onPress={handleTest} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
});