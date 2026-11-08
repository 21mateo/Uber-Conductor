import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { PRICING } from '../config/pricing';
import { registerUser, deleteCurrentUser } from './authService';
import { uploadImage } from './imageService';
import { normalizePlate, requiresTechReview } from '../utils/validators';

const DRIVERS = 'drivers';

const createError = (code) => {
  const error = new Error(code);
  error.code = code;
  return error;
};

const existsDriverWith = async (field, value) => {
  const q = query(collection(db, DRIVERS), where(field, '==', value), limit(1));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const registerDriver = async (personalData, vehicleData, documentsData) => {
  const email = personalData.email.trim().toLowerCase();
  const plate = normalizePlate(vehicleData.plate);
  const needsTechReview = requiresTechReview(vehicleData.year);

  // 1. Subir todas las fotos a Cloudinary al mismo tiempo
  const [profilePhotoUrl, vehiclePhotoUrl, licensePhotoUrl, soatPhotoUrl, techReviewPhotoUrl] =
    await Promise.all([
      uploadImage(personalData.photo, 'uber-conductor/perfiles'),
      uploadImage(vehicleData.photo, 'uber-conductor/vehiculos'),
      uploadImage(documentsData.licensePhoto, 'uber-conductor/documentos'),
      uploadImage(documentsData.soatPhoto, 'uber-conductor/documentos'),
      // La revisión técnico-mecánica solo se sube si aplica
      needsTechReview
        ? uploadImage(documentsData.techReviewPhoto, 'uber-conductor/documentos')
        : Promise.resolve(null),
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

    // 4. Guardar el conductor. El id del documento es el mismo uid de Auth
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
      documents: {
        license: {
          number: documentsData.licenseNumber,
          photoUrl: licensePhotoUrl,
          expiryDate: Timestamp.fromDate(documentsData.licenseExpiry),
        },
        soat: {
          photoUrl: soatPhotoUrl,
          expiryDate: Timestamp.fromDate(documentsData.soatExpiry),
        },
        techReview: needsTechReview
          ? {
              photoUrl: techReviewPhotoUrl,
              expiryDate: Timestamp.fromDate(documentsData.techReviewExpiry),
            }
          : null,
      },
      payment: {
        mercadoPagoEmail: documentsData.mercadoPagoEmail.trim().toLowerCase(),
      },
      commissionRate: PRICING.commissionRate, // comisión que aceptó el conductor
      termsAcceptedAt: serverTimestamp(),
      status: 'pending',
      isAvailable: false,
      balance: 0,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    await deleteCurrentUser();
    throw error;
  }

  return user.uid;
};

export const getDriver = async (uid) => {
  const snapshot = await getDoc(doc(db, DRIVERS, uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const updateDriverAvailability = async (uid, isAvailable) => {
  await updateDoc(doc(db, DRIVERS, uid), {
    isAvailable,
    availabilityUpdatedAt: serverTimestamp(),
  });
};

export const updateDriverLocation = async (uid, coords) => {
  await updateDoc(doc(db, DRIVERS, uid), {
    location: { lat: coords.latitude, lng: coords.longitude },
    locationUpdatedAt: serverTimestamp(),
  });
};