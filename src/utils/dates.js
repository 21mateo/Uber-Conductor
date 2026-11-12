// Funciones de fecha para ganancias e historial

const pad = (n) => String(n).padStart(2, '0');

// Convierte un Timestamp de Firestore (o un Date) en Date
export const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  return value instanceof Date ? value : null;
};

// Hoy a las 00:00
export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Hoy a las 23:59:59
export const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Lunes de esta semana a las 00:00 (getDay: 0 = domingo, 1 = lunes...)
export const startOfWeek = (date = new Date()) => {
  const d = startOfDay(date);
  const day = d.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - daysSinceMonday);
  return d;
};

// Día 1 del mes a las 00:00
export const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);

// Rango { from, to } de un filtro: 'today' | 'week' | 'month' | 'range'
export const getPeriodRange = (period, rangeFrom, rangeTo) => {
  if (period === 'today') return { from: startOfDay(), to: endOfDay() };
  if (period === 'week') return { from: startOfWeek(), to: endOfDay() };
  if (period === 'month') return { from: startOfMonth(), to: endOfDay() };
  return {
    from: rangeFrom ? startOfDay(rangeFrom) : null,
    to: rangeTo ? endOfDay(rangeTo) : null,
  };
};

// 05/11/2026
export const formatDate = (value) => {
  const d = toDate(value);
  if (!d) return '—';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// 05/11/2026 14:30
export const formatDateTime = (value) => {
  const d = toDate(value);
  if (!d) return '—';
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};