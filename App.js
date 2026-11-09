import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { ActiveTripProvider } from './src/context/ActiveTripContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ActiveTripProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </ActiveTripProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}