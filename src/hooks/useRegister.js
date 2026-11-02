import { useContext } from 'react';
import { RegisterContext } from '../context/RegisterContext';

export default function useRegister() {
  const context = useContext(RegisterContext);

  if (!context) {
    throw new Error('useRegister debe usarse dentro de RegisterProvider');
  }
  return context;
}