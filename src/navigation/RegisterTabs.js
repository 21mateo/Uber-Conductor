import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RegisterProvider } from '../context/RegisterContext';
import useRegister from '../hooks/useRegister';
import PersonalDataScreen from '../screens/PersonalDataScreen';
import VehicleScreen from '../screens/VehicleScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import { colors, spacing } from '../theme/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ name, isValid, color, size }) {
  if (isValid) {
    return <Ionicons name="checkmark-circle" size={size} color={colors.success} />;
  }
  return <Ionicons name={name} size={size} color={color} />;
}

function RegisterTabsContent() {
  const { isPersonalValid, isVehicleValid } = useRegister();

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.getParent()?.goBack()}
            style={{ paddingHorizontal: spacing.lg }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        ),
      })}
    >
      <Tab.Screen
        name="Personal"
        component={PersonalDataScreen}
        options={{
          title: 'Datos personales',
          tabBarLabel: 'Personal',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person-outline" isValid={isPersonalValid} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Vehicle"
        component={VehicleScreen}
        options={{
          title: 'Vehículo',
          tabBarLabel: 'Vehículo',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="car-outline" isValid={isVehicleValid} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          title: 'Documentos',
          tabBarLabel: 'Documentos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RegisterTabs() {
  return (
    <RegisterProvider>
      <RegisterTabsContent />
    </RegisterProvider>
  );
}