import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';
import useActiveTrip from '../hooks/useActiveTrip';
import LoginScreen from '../screens/LoginScreen';
import TripScreen from '../screens/TripScreen';
import TripSummaryScreen from '../screens/TripSummaryScreen';
import RegisterTabs from './RegisterTabs';
import MainDrawer from './MainDrawer';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

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
            renderTripScreen(activeTrip)
          ) : (
            <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Register"
              component={RegisterTabs}
              options={{ headerShown: false }} 
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