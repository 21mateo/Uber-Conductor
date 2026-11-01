import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

export default function PrimaryButton({ title, onPress, disabled = false, loading = false }) {
  // Si está cargando también se deshabilita, para evitar doble toque
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});