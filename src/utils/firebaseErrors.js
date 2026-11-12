// Traduce los códigos de error a mensajes en español para el usuario
const messages = {
  'auth/email-already-in-use': 'Este correo ya está registrado. Inicia sesión o usa otro correo.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres).',
  'auth/network-request-failed': 'Sin conexión a internet. Revisa tu red e intenta de nuevo.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
  'permission-denied': 'No tienes permiso para realizar esta acción.',
  unavailable: 'El servidor no está disponible. Revisa tu conexión.',
  'driver/document-taken': 'Ya existe un conductor registrado con este documento de identidad.',
  'driver/plate-taken': 'Ya existe un vehículo registrado con esta placa.',
  'upload/network': 'No se pudieron subir las fotos. Revisa tu conexión a internet.',
  'upload/failed': 'No se pudo subir una de las fotos. Intenta de nuevo.',
  'trip/not-available': 'Esta solicitud ya no está disponible.',
  'payment/no-backend': 'Falta configurar EXPO_PUBLIC_BACKEND_URL en el .env.',
  'payment/backend-unreachable':
    'No se pudo conectar con el servidor de pagos. Revisa que el backend esté encendido y que el celular y el PC estén en la misma red.',
  'payment/failed': 'No se pudo procesar el pago. Intenta de nuevo.',
};

export const getErrorMessage = (error) => {
  // Si el backend mandó un mensaje propio, se muestra ese
  if (error?.code === 'payment/failed' && error.serverMessage) return error.serverMessage;
  return messages[error?.code] || 'Ocurrió un error inesperado. Intenta de nuevo.';
};