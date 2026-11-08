import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { loginUser, logoutUser } from '../services/authService';
import { getDriver } from '../services/driverService';
import { validateEmail, isEmpty, hasErrors } from '../utils/validators';
import { getErrorMessage } from '../utils/firebaseErrors';
import { colors, spacing, radius, typography } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleLogin = async () => {
    const newErrors = {
      email: validateEmail(email),
      password: isEmpty(password) ? 'La contraseña es obligatoria' : '',
    };
    setErrors(newErrors);
    setSubmitError('');
    if (hasErrors(newErrors)) return;

    setLoading(true);
    try {
      const user = await loginUser(email.trim().toLowerCase(), password);

      const driver = await getDriver(user.uid);
      if (!driver) {
        await logoutUser();
        setSubmitError('No encontramos un registro de conductor para esta cuenta.');
        setLoading(false);
      }
    } catch (error) {
      console.log('Error en el login:', error);
      setSubmitError(getErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="car-sport" size={40} color={colors.white} />
          </View>
          <Text style={styles.title}>UberClone Conductor</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <InputField
          label="Correo electrónico"
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Contraseña"
          placeholder="Escribe tu Contraseña"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
        />

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <PrimaryButton title="Iniciar sesión" onPress={handleLogin} loading={loading} />

        <Pressable style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerBold}>Regístrate como conductor</Text>
          </Text>
        </Pressable>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  submitError: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  registerText: {
    color: colors.textMuted,
  },
  registerBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});