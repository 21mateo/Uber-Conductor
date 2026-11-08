import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';

export default function CheckboxField({ label, checked, onChange, error }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.row} onPress={() => onChange(!checked)}>
        <Ionicons
          name={checked ? 'checkbox' : 'square-outline'}
          size={24}
          color={error ? colors.danger : colors.primary}
        />
        <Text style={styles.label}>{label}</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  error: {
    ...typography.error,
    marginTop: spacing.xs,
  },
});