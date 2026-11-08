// Formatea pesos colombianos: 15360 → "$ 15.360"
export const formatMoney = (value) => {
  const rounded = Math.round(Number(value) || 0);
  const sign = rounded < 0 ? '-' : '';
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}$ ${digits}`;
};

// 8.456 → "8,5 km"
export const formatKm = (value) => `${Number(value).toFixed(1).replace('.', ',')} km`;

// 22.4 → "22 min"
export const formatMinutes = (value) => `${Math.round(Number(value))} min`;