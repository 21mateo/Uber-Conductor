import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Actualiza los datos editables del perfil
export const updateDriverContact = async (uid, { phone, mercadoPagoEmail }) => {
  await updateDoc(doc(db, 'drivers', uid), {
    'personal.phone': phone,
    'payment.mercadoPagoEmail': mercadoPagoEmail.trim().toLowerCase(),
  });
};