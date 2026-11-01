import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, radius, typography } from '../theme/colors';

export default function SelectField({
  label,
  selectedValue,
  onValueChange,
  options,
  error,
  placeholder = 'Selecciona una opción',
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.pickerBox, error ? styles.pickerError : null]}>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>

          <Picker.Item label={placeholder} value="" color={colors.textMuted} />

          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  pickerBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.error,
    marginTop: spacing.xs,
  },
});