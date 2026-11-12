import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';
import useActiveTrip from '../hooks/useActiveTrip';
import LoginScreen from '../screens/LoginScreen';
import TripScreen from '../screens/TripScreen';
import TripSummaryScreen from '../screens/TripSummaryScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import RegisterTabs from './RegisterTabs';
import MainDrawer from './MainDrawer';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

// Tema de la navegación con nuestros colores (igual que en clase)
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
  },
};

// Pantalla del flujo del viaje según el estado (PDF: el status controla qué pantalla se muestra)
const renderTripScreen = (trip) => {
  if (trip.status === 'completed' || trip.status === 'paid') {
    return (
      <Stack.Screen
        name="TripSummary"
        component={TripSummaryScreen}
        options={{ title: 'Cobro y resumen', headerBackVisible: false, gestureEnabled: false }}
      />
    );
  }
  return (
    <Stack.Screen
      name="Trip"
      component={TripScreen}
      options={{ title: 'Viaje en curso', headerBackVisible: false, gestureEnabled: false }}
    />
  );
};

export default function AppNavigator() {
  const { user, driver, initializing } = useAuth();
  const { activeTrip, loadingTrip } = useActiveTrip();

  // Si hay usuario Y ya existe su registro en Firestore, entra a la app
  const isLoggedIn = user && driver;

  // Mientras Firebase revisa la sesión y si hay un viaje activo.
  // Ojo: se usa isLoggedIn y no solo user, para no desmontar el registro
  // en el momento en que se crea el usuario en Auth.
  if (initializing || (isLoggedIn && loadingTrip)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>
        {isLoggedIn ? (
          activeTrip ? (
            // Stack del viaje: mientras hay un viaje activo no se puede salir de él
            renderTripScreen(activeTrip)
          ) : (
            <>
              {/* Drawer: Inicio, Ganancias, Historial y Perfil */}
              <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
              {/* Detalle de un viaje del historial */}
              <Stack.Screen
                name="TripDetail"
                component={TripDetailScreen}
                options={{ title: 'Detalle del viaje' }}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Register"
              component={RegisterTabs}
              options={{ headerShown: false }} // los tabs ya tienen su propio encabezado
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});