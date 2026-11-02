import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useImagePicker from '../hooks/useImagePicker';
import { colors, spacing, radius, typography } from '../theme/colors';

export default function ImageField({ label, imageUri, onImageSelected, error, hint, aspect = [1, 1] }) {
  const { takePhoto, pickFromGallery, loading } = useImagePicker();

  const handleCamera = async () => {
    const uri = await takePhoto(aspect);
    if (uri) onImageSelected(uri);
  };

  const handleGallery = async () => {
    const uri = await pickFromGallery(aspect);
    if (uri) onImageSelected(uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      <View style={[styles.preview, error ? styles.previewError : null]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={40} color={colors.textMuted} />
        )}
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.smallButton} onPress={handleCamera} disabled={loading}>
          <Ionicons name="camera-outline" size={18} color={colors.primary} />
          <Text style={styles.smallButtonText}>Cámara</Text>
        </Pressable>

        <Pressable style={styles.smallButton} onPress={handleGallery} disabled={loading}>
          <Ionicons name="images-outline" size={18} color={colors.primary} />
          <Text style={styles.smallButtonText}>Galería</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  preview: {
    height: 160,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewError: {
    borderColor: colors.danger,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  smallButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
  },
  smallButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  error: {
    ...typography.error,
    marginTop: spacing.xs,
  },
});