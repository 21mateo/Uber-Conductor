import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook personalizado para saber quién tiene la sesión iniciada
export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}