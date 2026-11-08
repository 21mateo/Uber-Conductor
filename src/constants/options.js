// Opciones para las listas desplegables y textos de la app.
// label = lo que ve el usuario, value = lo que se guarda en la base de datos

export const GENDERS = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
  { label: 'Otro', value: 'other' },
  { label: 'Prefiero no decirlo', value: 'not_specified' },
];

export const CATEGORIES = [
  { label: 'Económico', value: 'economy' },
  { label: 'XL', value: 'xl' },
  { label: 'Premium', value: 'premium' },
];

export const VEHICLE_COLORS = [
  { label: 'Blanco', value: 'white' },
  { label: 'Negro', value: 'black' },
  { label: 'Gris', value: 'gray' },
  { label: 'Plateado', value: 'silver' },
  { label: 'Rojo', value: 'red' },
  { label: 'Azul', value: 'blue' },
  { label: 'Verde', value: 'green' },
  { label: 'Otro', value: 'other' },
];

export const PAYMENT_METHODS = [
  { label: 'Mercado Pago', value: 'mercadopago' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'Efectivo', value: 'cash' },
];

export const getOptionLabel = (options, value) => {
  const option = options.find((item) => item.value === value);
  return option ? option.label : value;
};