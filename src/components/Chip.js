import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

// Botón tipo "chip" para filtros 
export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  textSelected: {
    color: colors.white,
  },
});