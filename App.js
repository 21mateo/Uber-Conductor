import { Alert } from 'react-native';
import { RegisterProvider } from './src/context/RegisterContext';
import PersonalDataScreen from './src/screens/PersonalDataScreen';

const fakeNavigation = {
  navigate: (screen) => Alert.alert('Prueba', `Todo válido, pasaría a: ${screen}`),
};

export default function App() {
  return (
    <RegisterProvider>
      <PersonalDataScreen navigation={fakeNavigation} />
    </RegisterProvider>
  );
}