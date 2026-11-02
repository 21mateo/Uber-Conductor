import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/colors';

export default function DocumentsScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="document-text-outline" size={56} color={colors.textMuted} />
      <Text style={styles.title}>Próximamente</Text>
      <Text style={styles.message}>
        Aquí podrás subir tu licencia, SOAT y revisión técnico-mecánica.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});