export const isEmpty = (value) => {
  return value === null || value === undefined || String(value).trim() === '';
};

export const normalizePlate = (plate) => {
  // Mayúsculas y sin espacios antes de validar (PDF sección 2)
  return String(plate).toUpperCase().replace(/\s/g, '');
};

export const getAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Si todavía no ha llegado su cumpleaños este año, se resta 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// ---------- Pestaña 1: Datos personales ----------

export const validatePhoto = (uri) => {
  if (isEmpty(uri)) return 'La foto es obligatoria';
  return '';
};

export const validateFullName = (value) => {
  if (isEmpty(value)) return 'El nombre es obligatorio';
  const name = value.trim();
  if (name.length < 3) return 'El nombre es muy corto';
  if (name.length > 50) return 'Máximo 50 caracteres';
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(name)) return 'Solo se permiten letras y espacios';
  return '';
};

export const validateDocumentId = (value) => {
  if (isEmpty(value)) return 'El documento es obligatorio';
  if (!/^\d+$/.test(value)) return 'Solo se permiten números';
  if (value.length < 6 || value.length > 10) return 'Debe tener entre 6 y 10 dígitos';
  return '';
};

export const validatePhone = (value) => {
  if (isEmpty(value)) return 'El celular es obligatorio';
  if (!/^\d+$/.test(value)) return 'Solo se permiten números';
  if (value.length !== 10) return 'Debe tener 10 dígitos';
  if (!value.startsWith('3')) return 'Un celular en Colombia empieza por 3';
  return '';
};

export const validateBirthDate = (date) => {
  if (!date) return 'La fecha de nacimiento es obligatoria';
  if (date > new Date()) return 'La fecha no puede ser futura';
  if (getAge(date) < 18) return 'Debes ser mayor de 18 años';
  return '';
};

export const validateEmail = (value) => {
  if (isEmpty(value)) return 'El correo es obligatorio';
  const email = value.trim();
  if (!email.includes('@')) return 'El correo debe tener @';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return 'El correo debe tener un dominio válido (ej: gmail.com)';
  }
  return '';
};

export const validatePassword = (value) => {
  if (isEmpty(value)) return 'La contraseña es obligatoria';
  if (value.length < 6) return 'Mínimo 6 caracteres';
  return '';
};

export const validateConfirmPassword = (password, confirm) => {
  if (isEmpty(confirm)) return 'Confirma la contraseña';
  if (password !== confirm) return 'Las contraseñas no coinciden';
  return '';
};

// Para listas desplegables (género, idioma, categoría, color)
export const validateSelect = (value, fieldName) => {
  if (isEmpty(value)) return `Selecciona ${fieldName}`;
  return '';
};

// ---------- Pestaña 2: Vehículo ----------

export const validatePlate = (value) => {
  if (isEmpty(value)) return 'La placa es obligatoria';
  const plate = normalizePlate(value);
  if (!/^[A-Z]{3}\d{3}$/.test(plate)) return 'Formato inválido, debe ser como ABC123';
  return '';
};

export const validateBrandOrModel = (value, fieldName) => {
  if (isEmpty(value)) return `Escribe ${fieldName}`;
  if (value.trim().length > 30) return 'Máximo 30 caracteres';
  return '';
};

export const validateYear = (value) => {
  if (isEmpty(value)) return 'El año es obligatorio';
  if (!/^\d{4}$/.test(value)) return 'Debe tener 4 dígitos';
  const year = Number(value);
  const currentYear = new Date().getFullYear();
  if (year > currentYear) return `No puede ser mayor a ${currentYear}`;
  if (year < 1950) return 'Año no válido';
  return '';
};

export const validateCapacity = (value, category) => {
  if (isEmpty(value)) return 'La capacidad es obligatoria';
  if (!/^\d+$/.test(value)) return 'Solo se permiten números';
  const capacity = Number(value);
  if (capacity < 1) return 'Debe ser mínimo 1';
  if (capacity > 8) return 'Máximo 8 pasajeros';
  if (category === 'xl' && capacity < 6) return 'La categoría XL exige mínimo 6 pasajeros';
  return '';
};


export const validatePersonalData = (data) => {
  return {
    photo: validatePhoto(data.photo),
    fullName: validateFullName(data.fullName),
    documentId: validateDocumentId(data.documentId),
    phone: validatePhone(data.phone),
    birthDate: validateBirthDate(data.birthDate),
    gender: validateSelect(data.gender, 'un género'),
    email: validateEmail(data.email),
    password: validatePassword(data.password),
    confirmPassword: validateConfirmPassword(data.password, data.confirmPassword),
  };
};

export const validateVehicleData = (data) => {
  return {
    category: validateSelect(data.category, 'una categoría'),
    plate: validatePlate(data.plate),
    brand: validateBrandOrModel(data.brand, 'la marca'),
    model: validateBrandOrModel(data.model, 'el modelo'),
    year: validateYear(data.year),
    color: validateSelect(data.color, 'un color'),
    capacity: validateCapacity(data.capacity, data.category),
    photo: validatePhoto(data.photo),
  };
};

export const hasErrors = (errors) => {
  return Object.values(errors).some((message) => message !== '');
};