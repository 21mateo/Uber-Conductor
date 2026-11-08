import { View, Text, Image, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import HomeScreen from '../screens/HomeScreen';
import PendingScreen from '../screens/PendingScreen';
import { logoutUser } from '../services/authService';
import { updateDriverAvailability } from '../services/driverService';
import { colors, spacing } from '../theme/colors';

const Drawer = createDrawerNavigator();

function DrawerContent(props) {
  const { driver } = useAuth();

  const handleLogout = async () => {
    try {
      if (driver?.isAvailable) {
        await updateDriverAvailability(driver.id, false);
      }
    } catch (error) {
      console.log('No se pudo cambiar la disponibilidad:', error);
    }
    await logoutUser();
  };

  return (
    <DrawerContentScrollView {...props}>
      {driver && (
        <View style={styles.header}>
          <Image source={{ uri: driver.personal.photoUrl }} style={styles.avatar} />
          <Text style={styles.name}>{driver.personal.fullName}</Text>
          <Text style={styles.email}>{driver.personal.email}</Text>
        </View>
      )}

      <DrawerItemList {...props} />

      <DrawerItem
        label="Cerrar sesión"
        labelStyle={{ color: colors.danger }}
        icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={colors.danger} />}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textMuted,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          drawerIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Account"
        component={PendingScreen}
        options={{
          title: 'Mi cuenta',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    fontSize: 13,
    color: colors.textMuted,
  },
});