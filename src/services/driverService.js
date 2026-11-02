import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { registerUser, deleteCurrentUser } from './authService';
import { uploadImage } from './imageService';
import { normalizePlate } from '../utils/validators';

const DRIVERS = 'drivers';

const createError = (code) => {
  const error = new Error(code);
  error.code = code;
  return error;
};

// Revisa si ya existe un conductor con ese valor (ej: mismo documento)
const existsDriverWith = async (field, value) => {
  const q = query(collection(db, DRIVERS), where(field, '==', value), limit(1));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Registro completo del conductor
export const registerDriver = async (personalData, vehicleData) => {
  const email = personalData.email.trim().toLowerCase();
  const plate = normalizePlate(vehicleData.plate);

  // 1. Subir las dos fotos a Cloudinary al mismo tiempo
  const [profilePhotoUrl, vehiclePhotoUrl] = await Promise.all([
    uploadImage(personalData.photo, 'uber-conductor/perfiles'),
    uploadImage(vehicleData.photo, 'uber-conductor/vehiculos'),
  ]);

  // 2. Crear el usuario en Firebase Auth (si el correo existe, falla aquí)
  const user = await registerUser(email, personalData.password);

  try {
    // 3. Validar que el documento y la placa no estén repetidos
    if (await existsDriverWith('personal.documentId', personalData.documentId)) {
      throw createError('driver/document-taken');
    }
    if (await existsDriverWith('vehicle.plate', plate)) {
      throw createError('driver/plate-taken');
    }

    await setDoc(doc(db, DRIVERS, user.uid), {
      personal: {
        fullName: personalData.fullName.trim(),
        documentId: personalData.documentId,
        phone: personalData.phone,
        birthDate: Timestamp.fromDate(personalData.birthDate),
        gender: personalData.gender,
        email,
        photoUrl: profilePhotoUrl,
      },
      vehicle: {
        category: vehicleData.category,
        plate,
        brand: vehicleData.brand.trim(),
        model: vehicleData.model.trim(),
        year: Number(vehicleData.year),
        color: vehicleData.color,
        capacity: Number(vehicleData.capacity),
        photoUrl: vehiclePhotoUrl,
      },
      status: 'pending', // pending | approved | rejected
      isAvailable: false,
      balance: 0,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Rollback: si algo falla se borra el usuario para no dejar una cuenta a medias
    await deleteCurrentUser();
    throw error;
  }

  return user.uid;
};

export const getDriver = async (uid) => {
  const snapshot = await getDoc(doc(db, DRIVERS, uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};