import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import DateField from './src/components/DateField';
import ImageField from './src/components/ImageField';
import PrimaryButton from './src/components/PrimaryButton';
import { validateBirthDate, validatePhoto } from './src/utils/validators';

export default function App() {
  const [birthDate, setBirthDate] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  const handleTest = () => {
    setErrors({
      birthDate: validateBirthDate(birthDate),
      photo: validatePhoto(photo),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageField
        label="Foto de perfil"
        imageUri={photo}
        onImageSelected={setPhoto}
        error={errors.photo}
      />
      <DateField
        label="Fecha de nacimiento"
        value={birthDate}
        onChange={setBirthDate}
        error={errors.birthDate}
      />
      <PrimaryButton title="Probar validación" onPress={handleTest} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
});