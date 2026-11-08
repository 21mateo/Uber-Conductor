import { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // los meses empiezan en 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function DateField({
  label,
  value,
  onChange,
  error,
  placeholder = 'Selecciona una fecha',
  minimumDate,
  maximumDate,
  initialDate,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const pickerValue = value || initialDate || new Date();

  // El usuario eligió una fecha
  const handleValueChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) onChange(selectedDate);
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  const handleDone = () => {
    if (!value) onChange(pickerValue);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={[styles.input, error ? styles.inputError : null]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={value ? styles.valueText : styles.placeholder}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </Pressable>

      {showPicker && (
        <View>
          <DateTimePicker
            value={pickerValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onValueChange={handleValueChange}
            onDismiss={handleDismiss}
          />
          {Platform.OS === 'ios' && (
            <Pressable style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneText}>Listo</Text>
            </Pressable>
          )}
        </View>
      )}

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
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  inputError: {
    borderColor: colors.danger,
  },
  valueText: {
    fontSize: 15,
    color: colors.text,
  },
  placeholder: {
    fontSize: 15,
    color: colors.textMuted,
  },
  doneButton: {
    alignSelf: 'flex-end',
    padding: spacing.sm,
  },
  doneText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  error: {
    ...typography.error,
    marginTop: spacing.xs,
  },
});