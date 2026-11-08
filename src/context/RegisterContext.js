import { createContext, useState, useMemo, useCallback } from 'react';
import {
  validatePersonalData,
  validateVehicleData,
  validateDocumentsData,
  requiresTechReview,
  hasErrors,
} from '../utils/validators';

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

const initialDocumentsData = {
  licenseNumber: '',
  licensePhoto: null,
  licenseExpiry: null,
  soatPhoto: null,
  soatExpiry: null,
  techReviewPhoto: null,
  techReviewExpiry: null,
  mercadoPagoEmail: '',
  acceptedTerms: false,
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
  const [documentsData, setDocumentsData] = useState(initialDocumentsData);

  const [personalTouched, setPersonalTouched] = useState({});
  const [vehicleTouched, setVehicleTouched] = useState({});
  const [documentsTouched, setDocumentsTouched] = useState({});

  // Actualizan un solo campo sin borrar los demás
  const updatePersonal = useCallback((field, value) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
    setPersonalTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const updateVehicle = useCallback((field, value) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }));
    setVehicleTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const updateDocuments = useCallback((field, value) => {
    setDocumentsData((prev) => ({ ...prev, [field]: value }));
    setDocumentsTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Los errores solo se recalculan cuando cambian los datos
  const personalErrors = useMemo(() => validatePersonalData(personalData), [personalData]);
  const vehicleErrors = useMemo(() => validateVehicleData(vehicleData), [vehicleData]);
  // Los documentos dependen del año del vehículo (revisión técnico-mecánica)
  const documentsErrors = useMemo(
    () => validateDocumentsData(documentsData, vehicleData.year),
    [documentsData, vehicleData.year]
  );

  const isPersonalValid = !hasErrors(personalErrors);
  const isVehicleValid = !hasErrors(vehicleErrors);
  const isDocumentsValid = !hasErrors(documentsErrors);
  const needsTechReview = requiresTechReview(vehicleData.year);

  const showAllPersonalErrors = useCallback(() => {
    setPersonalTouched(touchAll(personalErrors));
  }, [personalErrors]);

  const showAllVehicleErrors = useCallback(() => {
    setVehicleTouched(touchAll(vehicleErrors));
  }, [vehicleErrors]);

  const showAllDocumentsErrors = useCallback(() => {
    setDocumentsTouched(touchAll(documentsErrors));
  }, [documentsErrors]);

  const resetForm = useCallback(() => {
    setPersonalData(initialPersonalData);
    setVehicleData(initialVehicleData);
    setDocumentsData(initialDocumentsData);
    setPersonalTouched({});
    setVehicleTouched({});
    setDocumentsTouched({});
  }, []);

  const value = {
    personalData,
    vehicleData,
    documentsData,
    updatePersonal,
    updateVehicle,
    updateDocuments,
    personalErrors: filterErrors(personalErrors, personalTouched),
    vehicleErrors: filterErrors(vehicleErrors, vehicleTouched),
    documentsErrors: filterErrors(documentsErrors, documentsTouched),
    isPersonalValid,
    isVehicleValid,
    isDocumentsValid,
    needsTechReview,
    showAllPersonalErrors,
    showAllVehicleErrors,
    showAllDocumentsErrors,
    resetForm,
  };

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}