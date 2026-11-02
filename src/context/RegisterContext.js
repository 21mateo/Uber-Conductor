import { createContext, useState, useMemo, useCallback } from 'react';
import { validatePersonalData, validateVehicleData, hasErrors } from '../utils/validators';

export const RegisterContext = createContext(null);

const initialPersonalData = {
  photo: null,
  fullName: '',
  documentId: '',
  phone: '',
  birthDate: null,
  gender: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialVehicleData = {
  category: '',
  plate: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  capacity: '',
  photo: null,
};

const filterErrors = (errors, touched) => {
  const visibleErrors = {};
  Object.keys(errors).forEach((field) => {
    visibleErrors[field] = touched[field] ? errors[field] : '';
  });
  return visibleErrors;
};

const touchAll = (errors) => {
  const touched = {};
  Object.keys(errors).forEach((field) => {
    touched[field] = true;
  });
  return touched;
};

export function RegisterProvider({ children }) {
  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [vehicleData, setVehicleData] = useState(initialVehicleData);
  const [personalTouched, setPersonalTouched] = useState({});
  const [vehicleTouched, setVehicleTouched] = useState({});

  const updatePersonal = useCallback((field, value) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
    setPersonalTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const updateVehicle = useCallback((field, value) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }));
    setVehicleTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const personalErrors = useMemo(() => validatePersonalData(personalData), [personalData]);
  const vehicleErrors = useMemo(() => validateVehicleData(vehicleData), [vehicleData]);

  const isPersonalValid = !hasErrors(personalErrors);
  const isVehicleValid = !hasErrors(vehicleErrors);

  const showAllPersonalErrors = useCallback(() => {
    setPersonalTouched(touchAll(personalErrors));
  }, [personalErrors]);

  const showAllVehicleErrors = useCallback(() => {
    setVehicleTouched(touchAll(vehicleErrors));
  }, [vehicleErrors]);

  const resetForm = useCallback(() => {
    setPersonalData(initialPersonalData);
    setVehicleData(initialVehicleData);
    setPersonalTouched({});
    setVehicleTouched({});
  }, []);

  const value = {
    personalData,
    vehicleData,
    updatePersonal,
    updateVehicle,
    personalErrors: filterErrors(personalErrors, personalTouched),
    vehicleErrors: filterErrors(vehicleErrors, vehicleTouched),
    isPersonalValid,
    isVehicleValid,
    showAllPersonalErrors,
    showAllVehicleErrors,
    resetForm,
  };

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}