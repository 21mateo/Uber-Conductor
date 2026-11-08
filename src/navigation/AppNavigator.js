import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
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

export default function AppNavigator() {
  const { user, driver, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isLoggedIn = user && driver;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
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