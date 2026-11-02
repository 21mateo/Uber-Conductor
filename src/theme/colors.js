// Colores de la app (estilo Uber: negro y blanco)
export const colors = {
  primary: '#111827',
  primaryDark: '#000000',
  primaryLight: '#E5E7EB',
  background: '#F6F7FB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textMuted: '#6B7280',
  danger: '#E11D48',
  success: '#0E9F6E',
  warning: '#F59E0B',
  white: '#FFFFFF',
};

// Escala de espaciado basada en múltiplos de 4
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  error: { fontSize: 12, color: colors.danger },
};