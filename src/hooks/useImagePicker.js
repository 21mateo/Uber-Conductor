import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function useImagePicker() {
  const [loading, setLoading] = useState(false);

  const takePhoto = async (aspect = [1, 1]) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Debes permitir el uso de la cámara para tomar la foto.');
      return null;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect,
        quality: 0.5, 
      });
      if (result.canceled) return null;
      return result.assets[0].uri;
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la cámara.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = async (aspect = [1, 1]) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Debes permitir el acceso a la galería para elegir la foto.');
      return null;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect,
        quality: 0.5,
      });
      if (result.canceled) return null;
      return result.assets[0].uri;
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galería.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { takePhoto, pickFromGallery, loading };
}