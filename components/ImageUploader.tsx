// components/ImageUploader.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import uploadService, { UploadedFile } from '../services/uploadService';

interface ImageUploaderProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageUploader({
  onUploadComplete,
  maxImages = 5,
  folder = 'vehicles',
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePickImage = async (useCamera = false) => {
    try {
      if (images.length >= maxImages) {
        Alert.alert('Límite alcanzado', `Puedes subir máximo ${maxImages} imágenes`);
        return;
      }

      const image = await uploadService.pickImage(useCamera);
      if (image) {
        setImages([...images, image.uri]);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handlePickMultipleImages = async () => {
    try {
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        Alert.alert('Límite alcanzado', `Puedes subir máximo ${maxImages} imágenes`);
        return;
      }

      const selectedImages = await uploadService.pickMultipleImages();
      const imagesToAdd = selectedImages.slice(0, remainingSlots);
      const uris = imagesToAdd.map((img) => img.uri);
      setImages([...images, ...uris]);
    } catch (error) {
      console.error('Error al seleccionar imágenes:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    }
  };

  const handleUploadImages = async () => {
    if (images.length === 0) {
      Alert.alert('Sin imágenes', 'Selecciona al menos una imagen para subir');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const filesToUpload = images.map((uri, index) => ({
        uri,
        name: `image_${Date.now()}_${index}.jpg`,
        type: uploadService.getMimeType(uri),
      }));

      const uploaded = await uploadService.uploadMultipleFiles(
        filesToUpload,
        folder,
        (index, progress) => {
          const totalProgress = ((index + progress / 100) / images.length) * 100;
          setUploadProgress(Math.round(totalProgress));
        }
      );

      setUploadedFiles(uploaded);
      Alert.alert('Éxito', 'Imágenes subidas correctamente');
      onUploadComplete?.(uploaded);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      Alert.alert('Error', 'No se pudieron subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleClearAll = () => {
    setImages([]);
    setUploadedFiles([]);
    setUploadProgress(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Imágenes</Text>
      <Text style={styles.subtitle}>
        {images.length} / {maxImages} imágenes seleccionadas
      </Text>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePickImage(false)}
          disabled={uploading || images.length >= maxImages}
        >
          <Ionicons name="images" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Galería</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePickImage(true)}
          disabled={uploading || images.length >= maxImages}
        >
          <Ionicons name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePickMultipleImages}
          disabled={uploading || images.length >= maxImages}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Múltiples</Text>
        </TouchableOpacity>
      </View>

      {/* Previsualización de imágenes */}
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
                disabled={uploading}
              >
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Progreso de subida */}
      {uploading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.progressText}>Subiendo... {uploadProgress}%</Text>
        </View>
      )}

      {/* Botones de acción principal */}
      {images.length > 0 && !uploading && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImages}>
            <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Subir a S3</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Archivos subidos */}
      {uploadedFiles.length > 0 && (
        <View style={styles.uploadedContainer}>
          <Text style={styles.uploadedTitle}>✅ Archivos subidos:</Text>
          {uploadedFiles.map((file, index) => (
            <View key={index} style={styles.uploadedItem}>
              <Text style={styles.uploadedFileName} numberOfLines={1}>
                {file.fileName}
              </Text>
              <Text style={styles.uploadedKey} numberOfLines={1}>
                {file.key}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#65676B',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  imageScroll: {
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#65676B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E6EA',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#65676B',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadedContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  uploadedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 8,
  },
  uploadedItem: {
    marginBottom: 6,
  },
  uploadedFileName: {
    fontSize: 13,
    color: '#1C1E21',
    fontWeight: '500',
  },
  uploadedKey: {
    fontSize: 11,
    color: '#65676B',
    marginTop: 2,
  },
});
