import { File } from 'expo-file-system';
import { UPLOAD_URL, UPLOAD_PRESET, CLOUD_NAME } from '../config/cloudinaryConfig';

const MAX_ATTEMPTS = 3; 

const createError = (code) => {
  const error = new Error(code);
  error.code = code;
  return error;
};

// Espera unos milisegundos antes de seguir
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Sube una imagen a Cloudinary y devuelve la URL pública
export const uploadImage = async (uri, folder) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.log('Falta configurar Cloudinary en el .env', { CLOUD_NAME, UPLOAD_PRESET });
    throw createError('upload/failed');
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const formData = new FormData();
    formData.append('file', new File(uri));
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    let response;
    try {
      response = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
    } catch (error) {
      console.log(`Error de red subiendo imagen (intento ${attempt}):`, error.message);
      if (attempt < MAX_ATTEMPTS) {
        await wait(1000 * attempt); 
        continue;
      }
      throw createError('upload/network');
    }

    const data = await response.json();
    if (!response.ok) {
      console.log('Error de Cloudinary:', response.status, data.error?.message);
      throw createError('upload/failed');
    }

    return data.secure_url;
  }
};