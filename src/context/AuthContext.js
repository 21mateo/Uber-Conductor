import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // usuario de Firebase Auth
  const [driver, setDriver] = useState(null); // datos del conductor en Firestore
  const [initializing, setInitializing] = useState(true); // solo al abrir la app

  // 1. Escucha si el usuario inicia o cierra sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setInitializing(false);
      }
    });

    // Función de limpieza: deja de escuchar cuando el componente se desmonta
    return unsubscribe;
  }, []);

  // 2. Si hay usuario, escucha en tiempo real su documento en Firestore
  useEffect(() => {
    if (!user) {
      setDriver(null);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'drivers', user.uid),
      (snapshot) => {
        setDriver(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        setInitializing(false);
      },
      (error) => {
        console.log('Error escuchando al conductor:', error);
        setDriver(null);
        setInitializing(false);
      }
    );

    // Limpieza: deja de escuchar si cambia el usuario o se cierra sesión
    return unsubscribe;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, driver, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}