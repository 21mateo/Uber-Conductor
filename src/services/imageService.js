import { File } from 'expo-file-system';
import { UPLOAD_URL, UPLOAD_PRESET, CLOUD_NAME } from '../config/cloudinaryConfig';

const createError = (code) => {
  const error = new Error(code);
  error.code = code;
  return error;
};

export const uploadImage = async (uri, folder) => {
  // Si falta la configuración se avisa de una vez
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.log('Falta configurar Cloudinary en el .env', { CLOUD_NAME, UPLOAD_PRESET });
    throw createError('upload/failed');
  }

  const file = new File(uri);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  let response;
  try {
    response = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
  } catch (error) {
    console.log('Error de red subiendo imagen:', error.message);
    throw createError('upload/network');
  }

  const data = await response.json();
  if (!response.ok) {
    console.log('Error de Cloudinary:', response.status, data.error?.message);
    throw createError('upload/failed');
  }

  return data.secure_url;
};