import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export const registerUser = async (email, password) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const loginUser = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const deleteCurrentUser = async () => {
  try {
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
  } catch (error) {
    console.log('No se pudo borrar el usuario:', error);
  }
};