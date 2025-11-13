import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Video, Audio } from 'expo-av';
import LocationPicker from '../../components/LocationPicker';
import apiService from '../../services/apiService';
import uploadService from '../../services/uploadService';

export default function RawPublish() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [plateValid, setPlateValid] = useState<boolean | null>(null);
  const [locationCoordinates, setLocationCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  // Estados para imágenes
  const [selectedImages, setSelectedImages] = useState<{ uri: string; name: string }[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Estados para videos
  const [selectedVideos, setSelectedVideos] = useState<{ uri: string; name: string; duration?: number }[]>([]);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  
  // Estado para preview
  const [previewMedia, setPreviewMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  
  const MAX_MEDIA_ITEMS = 6;
  
  const [formData, setFormData] = useState({
    // Campos requeridos por el backend
    plate: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    kilometers: '',
    fuelType: 'Gasolina',
    transmission: 'Manual',
    // Campos opcionales
    location: '',
    observations: '',
    description: '',
    videoUrl: '',
  });

  // Configurar el modo de audio al montar el componente
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Si cambia la marca, cargar los modelos disponibles y limpiar el modelo seleccionado
    if (field === 'brand') {
      setFormData(prev => ({ ...prev, model: '', year: '' }));
      setAvailableYears([]);
      loadModelsForBrand(value);
    }

    // Si cambia el modelo, cargar los años disponibles y limpiar el año seleccionado
    if (field === 'model') {
      setFormData(prev => ({ ...prev, year: '' }));
      loadYearsForBrandAndModel(formData.brand, value);
    }
  };

  const loadModelsForBrand = async (brand: string) => {
    if (!brand) {
      setAvailableModels([]);
      return;
    }

    try {
      setLoadingModels(true);
      const models = await apiService.getModelsByBrand(brand);
      setAvailableModels(models);
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      Alert.alert('Error', 'No se pudieron cargar los modelos para esta marca');
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const loadYearsForBrandAndModel = async (brand: string, model: string) => {
    if (!brand || !model) {
      setAvailableYears([]);
      return;
    }

    try {
      setLoadingYears(true);
      const years = await apiService.getYearsByBrandAndModel(brand, model);
      setAvailableYears(years);
    } catch (error) {
      console.error('Error al cargar años:', error);
      Alert.alert('Error', 'No se pudieron cargar los años para este modelo');
      setAvailableYears([]);
    } finally {
      setLoadingYears(false);
    }
  };

  const handlePlateChange = async (text: string) => {
    // Solo permitir letras y números, máximo 6 caracteres
    const filtered = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const limited = filtered.slice(0, 6);
    
    handleInputChange('plate', limited);
    setPlateValid(null);

    // Validar cuando llegue a 6 caracteres
    if (limited.length === 6) {
      await validatePlate(limited);
    }
  };

  const validatePlate = async (plate: string) => {
    try {
      setPlateValid(null);
      
      // Llamar a la API para validar la patente
      const response = await apiService.validateVehiclePlate(plate);
      
      if (response.valid) {
        setPlateValid(true);
      } else {
        setPlateValid(false);
      }
    } catch (error) {
      console.error('Error al validar patente:', error);
      setPlateValid(false);
    }
  };

  const formatNumber = (text: string): string => {
    // Eliminar todo excepto números
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned === '') return '';
    
    // Agregar separadores de miles
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceChange = (text: string) => {
    const formatted = formatNumber(text);
    handleInputChange('price', formatted);
  };

  const handleKilometersChange = (text: string) => {
    const formatted = formatNumber(text);
    handleInputChange('kilometers', formatted);
  };

  const handleLocationChange = (address: string, coordinates: { latitude: number; longitude: number }) => {
    setFormData(prev => ({ ...prev, location: address }));
    setLocationCoordinates(coordinates);
  };

  // Funciones para manejar imágenes
  const handleSelectImages = async () => {
    try {
      if (selectedImages.length >= MAX_MEDIA_ITEMS) {
        Alert.alert('Límite alcanzado', `Solo puedes seleccionar hasta ${MAX_MEDIA_ITEMS} imágenes`);
        return;
      }

      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (mediaPermission.status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para seleccionar imágenes');
        return;
      }

      const remainingSlots = MAX_MEDIA_ITEMS - selectedImages.length;
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImages = result.assets.slice(0, remainingSlots).map((asset, index) => ({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
        }));
        
        setSelectedImages(prev => [...prev, ...newImages]);
        Alert.alert('Éxito', `${newImages.length} imagen(es) seleccionada(s)`);
      }
    } catch (error) {
      console.error('Error al seleccionar imágenes:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    }
  };

  const handleTakePhoto = async () => {
    try {
      if (selectedImages.length >= MAX_MEDIA_ITEMS) {
        Alert.alert('Límite alcanzado', `Solo puedes tener hasta ${MAX_MEDIA_ITEMS} imágenes`);
        return;
      }

      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage = {
          uri: result.assets[0].uri,
          name: `photo_${Date.now()}.jpg`,
        };
        
        setSelectedImages(prev => [...prev, newImage]);
        Alert.alert('Éxito', 'Foto tomada correctamente');
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleRemoveImage = (index: number) => {
    Alert.alert(
      'Eliminar imagen',
      '¿Estás seguro de eliminar esta imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setSelectedImages(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  // Funciones para manejar videos
  const handleSelectVideos = async () => {
    try {
      if (selectedVideos.length >= MAX_MEDIA_ITEMS) {
        Alert.alert('Límite alcanzado', `Solo puedes seleccionar hasta ${MAX_MEDIA_ITEMS} videos`);
        return;
      }

      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (mediaPermission.status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para seleccionar videos');
        return;
      }

      const remainingSlots = MAX_MEDIA_ITEMS - selectedVideos.length;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: true,
        quality: 0.7,
        videoMaxDuration: 60,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newVideos = result.assets.slice(0, remainingSlots).map((asset, index) => {
          const duration = asset.duration;
          if (duration && duration > 60000) {
            Alert.alert('Video muy largo', `El video ${index + 1} supera los 60 segundos y será omitido`);
            return null;
          }
          return {
            uri: asset.uri,
            name: asset.fileName || `video_${Date.now()}_${index}.mp4`,
            duration,
          };
        }).filter(v => v !== null) as { uri: string; name: string; duration?: number }[];
        
        setSelectedVideos(prev => [...prev, ...newVideos]);
        Alert.alert('Éxito', `${newVideos.length} video(s) seleccionado(s)`);
      }
    } catch (error) {
      console.error('Error al seleccionar videos:', error);
      Alert.alert('Error', 'No se pudieron seleccionar los videos');
    }
  };

  const handleRecordVideo = async () => {
    try {
      if (selectedVideos.length >= MAX_MEDIA_ITEMS) {
        Alert.alert('Límite alcanzado', `Solo puedes tener hasta ${MAX_MEDIA_ITEMS} videos`);
        return;
      }

      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara para grabar videos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        videoMaxDuration: 60,
        quality: 0.7,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newVideo = {
          uri: result.assets[0].uri,
          name: 'video_grabado.mp4',
          duration: result.assets[0].duration ?? undefined,
        };
        
        setSelectedVideos(prev => [...prev, newVideo]);
        Alert.alert('Éxito', 'Video grabado correctamente');
      }
    } catch (error) {
      console.error('Error al grabar video:', error);
      Alert.alert('Error', 'No se pudo grabar el video');
    }
  };

  const handleRemoveVideo = (index: number) => {
    Alert.alert(
      'Eliminar video',
      '¿Estás seguro de eliminar este video?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setSelectedVideos(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const handlePreviewMedia = (uri: string, type: 'image' | 'video') => {
    setPreviewMedia({ uri, type });
  };

  const handlePublish = async () => {
    // Validación básica
    if (!formData.plate || !formData.brand || !formData.model || 
        !formData.year || !formData.price || !formData.kilometers) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (marca, modelo, año, patente, precio y kilometraje)');
      return;
    }

    // Validar año
    const yearNum = parseInt(formData.year);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
      Alert.alert('Error', `El año debe estar entre 1900 y ${currentYear + 1}`);
      return;
    }

    // Validar precio y kilometraje
    const priceNum = parseFloat(formData.price.replace(/[^0-9]/g, ''));
    const kilometersNum = parseFloat(formData.kilometers.replace(/[^0-9]/g, ''));

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido mayor a 0');
      return;
    }

    if (isNaN(kilometersNum) || kilometersNum < 0) {
      Alert.alert('Error', 'El kilometraje debe ser un número válido');
      return;
    }

    try {
      setLoading(true);

      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      // Subir imágenes si hay alguna seleccionada
      if (selectedImages.length > 0) {
        try {
          setUploadingImages(true);
          Alert.alert('Subiendo imágenes', `Subiendo ${selectedImages.length} imagen(es)...`);
          
          for (const image of selectedImages) {
            const uploaded = await uploadService.uploadFile(
              image.uri,
              image.name,
              'image/jpeg',
              'vehicles/images'
            );
            imageUrls.push(uploaded.publicUrl);
          }
          
          Alert.alert('Éxito', `${imageUrls.length} imagen(es) subida(s) correctamente`);
        } catch (error) {
          console.error('Error al subir imágenes:', error);
          const continuar = await new Promise((resolve) => {
            Alert.alert(
              'Error al subir imágenes',
              '¿Deseas publicar el vehículo sin todas las imágenes?',
              [
                { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Continuar', onPress: () => resolve(true) }
              ]
            );
          });
          if (!continuar) {
            setLoading(false);
            return;
          }
        } finally {
          setUploadingImages(false);
        }
      }

      // Subir videos si hay alguno seleccionado
      if (selectedVideos.length > 0) {
        try {
          setUploadingVideos(true);
          Alert.alert('Subiendo videos', `Subiendo ${selectedVideos.length} video(s)...`);
          
          for (const video of selectedVideos) {
            const uploaded = await uploadService.uploadFile(
              video.uri,
              video.name,
              'video/mp4',
              'vehicles/videos'
            );
            videoUrls.push(uploaded.publicUrl);
          }
          
          Alert.alert('Éxito', `${videoUrls.length} video(s) subido(s) correctamente`);
        } catch (error) {
          console.error('Error al subir videos:', error);
          const continuar = await new Promise((resolve) => {
            Alert.alert(
              'Error al subir videos',
              '¿Deseas publicar el vehículo sin todos los videos?',
              [
                { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Continuar', onPress: () => resolve(true) }
              ]
            );
          });
          if (!continuar) {
            setLoading(false);
            return;
          }
        } finally {
          setUploadingVideos(false);
        }
      }

      const vehicleData = {
        plate: formData.plate.toUpperCase(),
        brand: formData.brand,
        model: formData.model,
        year: yearNum,
        price: priceNum,
        kilometers: kilometersNum,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        location: formData.location || undefined,
        observations: formData.observations || undefined,
        description: formData.description || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        videos: videoUrls.length > 0 ? videoUrls : undefined,
        hasInspection: false,
      };

      await apiService.createVehicle(vehicleData);

      Alert.alert(
        'Éxito', 
        'Tu vehículo ha sido publicado exitosamente',
        [
          {
            text: 'Ver mis publicaciones',
            onPress: () => router.replace('/(tabs)'),
          }
        ]
      );

      // Limpiar formulario
      setFormData({
        plate: '',
        brand: '',
        model: '',
        year: '',
        price: '',
        kilometers: '',
        fuelType: 'Gasolina',
        transmission: 'Manual',
        location: '',
        observations: '',
        description: '',
        videoUrl: '',
      });
      setSelectedImages([]);
      setSelectedVideos([]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo publicar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="car-sport" size={48} color="#4CAF50" />
        <Text style={styles.title}>Publicar vehículo</Text>
        <Text style={styles.subtitle}>Completa la información de tu auto</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Marca */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Marca *</Text>
          <View style={styles.pickerContainer}>
            {['Toyota', 'Chevrolet', 'Nissan', 'Hyundai', 'Mazda', 'Honda', 'Kia', 'Suzuki'].map((brandOption) => (
              <TouchableOpacity
                key={brandOption}
                style={[
                  styles.pickerOption,
                  formData.brand === brandOption && styles.pickerOptionSelected
                ]}
                onPress={() => handleInputChange('brand', brandOption)}
                disabled={loading}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.brand === brandOption && styles.pickerOptionTextSelected
                ]}>
                  {brandOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Modelo */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Modelo *</Text>
          {loadingModels ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Cargando modelos...</Text>
            </View>
          ) : availableModels.length > 0 ? (
            <View style={styles.pickerContainer}>
              {availableModels.map((modelOption) => (
                <TouchableOpacity
                  key={modelOption}
                  style={[
                    styles.pickerOption,
                    formData.model === modelOption && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('model', modelOption)}
                  disabled={loading}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.model === modelOption && styles.pickerOptionTextSelected
                  ]}>
                    {modelOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TextInput
              style={styles.textInput}
              value={formData.model}
              onChangeText={(value) => handleInputChange('model', value)}
              placeholder={formData.brand ? "Selecciona una marca primero" : "Ej: Corolla, Civic, 3"}
              placeholderTextColor="#999"
              editable={!loading && !!formData.brand}
            />
          )}
        </View>

        {/* Año */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Año *</Text>
          {loadingYears ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Cargando años...</Text>
            </View>
          ) : availableYears.length > 0 ? (
            <View>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowYearDropdown(!showYearDropdown)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !formData.year && styles.placeholderText]}>
                  {formData.year || 'Selecciona un año'}
                </Text>
                <Ionicons 
                  name={showYearDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#4CAF50" 
                />
              </TouchableOpacity>
              
              {showYearDropdown && (
                <ScrollView style={styles.dropdownMenu} nestedScrollEnabled={true}>
                  {availableYears.map((yearOption) => (
                    <TouchableOpacity
                      key={yearOption}
                      style={styles.dropdownItem}
                      onPress={() => {
                        handleInputChange('year', yearOption.toString());
                        setShowYearDropdown(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.dropdownItemText}>{yearOption}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ) : (
            <TextInput
              style={styles.textInput}
              value={formData.year}
              onChangeText={(value) => handleInputChange('year', value)}
              placeholder={formData.model ? "Selecciona un modelo primero" : "Ej: 2020"}
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={4}
              editable={!loading && !!formData.model}
            />
          )}
        </View>

        {/* Patente */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Patente *</Text>
          <TextInput
            style={[
              styles.textInput,
              plateValid === false && styles.textInputError
            ]}
            value={formData.plate}
            onChangeText={handlePlateChange}
            placeholder="ABC123"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            maxLength={6}
            editable={!loading}
          />
          {plateValid === false && formData.plate.length === 6 && (
            <Text style={styles.errorText}>
              Formato de patente inválido
            </Text>
          )}
          {plateValid === true && (
            <Text style={styles.validText}>
              ✓ Patente válida
            </Text>
          )}
        </View>

        {/* Precio */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Precio de venta *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.price}
            onChangeText={handlePriceChange}
            placeholder="Ej: 15.000.000"
            placeholderTextColor="#999"
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        {/* Kilometraje */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Kilometraje *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.kilometers}
            onChangeText={handleKilometersChange}
            placeholder="Ej: 50.000"
            placeholderTextColor="#999"
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        {/* Tipo de combustible */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Tipo de combustible *</Text>
          <View style={styles.pickerContainer}>
            {['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido', 'GNV'].map((fuel) => (
              <TouchableOpacity
                key={fuel}
                style={[
                  styles.pickerOption,
                  formData.fuelType === fuel && styles.pickerOptionSelected
                ]}
                onPress={() => handleInputChange('fuelType', fuel)}
                disabled={loading}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.fuelType === fuel && styles.pickerOptionTextSelected
                ]}>
                  {fuel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transmisión */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Transmisión *</Text>
          <View style={styles.pickerContainer}>
            {['Manual', 'Automática'].map((trans) => (
              <TouchableOpacity
                key={trans}
                style={[
                  styles.pickerOption,
                  formData.transmission === trans && styles.pickerOptionSelected
                ]}
                onPress={() => handleInputChange('transmission', trans)}
                disabled={loading}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.transmission === trans && styles.pickerOptionTextSelected
                ]}>
                  {trans}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Ubicación</Text>
          <LocationPicker
            value={formData.location}
            onLocationChange={handleLocationChange}
            disabled={loading}
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Descripción</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Describe las características principales del vehículo..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {formData.description.length}/500 caracteres
          </Text>
        </View>

        {/* Observaciones */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Observaciones</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.observations}
            onChangeText={(value) => handleInputChange('observations', value)}
            placeholder="Agrega información adicional sobre el estado, mantenciones, etc..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
            maxLength={100}
          />
          <Text style={styles.characterCount}>
            {formData.observations.length}/100 caracteres
          </Text>
        </View>
      </View>

      {/* Sección de Imágenes */}
      <View style={styles.mediaSection}>
        <Text style={styles.sectionTitle}>
          Fotos del vehículo ({selectedImages.length}/{MAX_MEDIA_ITEMS})
        </Text>
        <Text style={styles.mediaSubtitle}>
          Agrega hasta 6 fotos del vehículo
        </Text>
        
        <View style={styles.mediaButtonsContainer}>
          <TouchableOpacity 
            style={[styles.mediaButton, (loading || uploadingImages || selectedImages.length >= MAX_MEDIA_ITEMS) && styles.mediaButtonDisabled]}
            onPress={handleTakePhoto}
            activeOpacity={0.8}
            disabled={loading || uploadingImages || selectedImages.length >= MAX_MEDIA_ITEMS}
          >
            {uploadingImages ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="camera" size={32} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Tomar Foto</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mediaButton, (loading || uploadingImages || selectedImages.length >= MAX_MEDIA_ITEMS) && styles.mediaButtonDisabled]}
            onPress={handleSelectImages}
            activeOpacity={0.8}
            disabled={loading || uploadingImages || selectedImages.length >= MAX_MEDIA_ITEMS}
          >
            {uploadingImages ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="images" size={32} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Seleccionar Fotos</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Grid de imágenes seleccionadas */}
        {selectedImages.length > 0 && (
          <View style={styles.mediaGrid}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.mediaItem}>
                <TouchableOpacity onPress={() => handlePreviewMedia(image.uri, 'image')}>
                  <Image source={{ uri: image.uri }} style={styles.mediaThumbnail} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.removeMediaButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Sección de Videos */}
      <View style={styles.mediaSection}>
        <Text style={styles.sectionTitle}>
          Videos del vehículo ({selectedVideos.length}/{MAX_MEDIA_ITEMS})
        </Text>
        <Text style={styles.mediaSubtitle}>
          Agrega hasta 6 videos de máximo 60 segundos cada uno
        </Text>
        
        <View style={styles.mediaButtonsContainer}>
          <TouchableOpacity 
            style={[styles.mediaButton, (loading || uploadingVideos || selectedVideos.length >= MAX_MEDIA_ITEMS) && styles.mediaButtonDisabled]}
            onPress={handleRecordVideo}
            activeOpacity={0.8}
            disabled={loading || uploadingVideos || selectedVideos.length >= MAX_MEDIA_ITEMS}
          >
            {uploadingVideos ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="videocam" size={32} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Grabar Video</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mediaButton, (loading || uploadingVideos || selectedVideos.length >= MAX_MEDIA_ITEMS) && styles.mediaButtonDisabled]}
            onPress={handleSelectVideos}
            activeOpacity={0.8}
            disabled={loading || uploadingVideos || selectedVideos.length >= MAX_MEDIA_ITEMS}
          >
            {uploadingVideos ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="film" size={32} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Seleccionar Videos</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Grid de videos seleccionados */}
        {selectedVideos.length > 0 && (
          <View style={styles.mediaGrid}>
            {selectedVideos.map((video, index) => (
              <View key={index} style={styles.mediaItem}>
                <TouchableOpacity onPress={() => handlePreviewMedia(video.uri, 'video')}>
                  <Video
                    source={{ uri: video.uri }}
                    style={styles.mediaThumbnail}
                    resizeMode={'cover' as any}
                    shouldPlay={false}
                    isMuted
                  />
                  <View style={styles.videoOverlay}>
                    <Ionicons name="play-circle" size={40} color="#FFFFFF" />
                    {video.duration && (
                      <Text style={styles.videoDuration}>
                        {Math.round((video.duration || 0) / 1000)}s
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.removeMediaButton}
                  onPress={() => handleRemoveVideo(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Modal de Preview */}
      <Modal
        visible={previewMedia !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewMedia(null)}
      >
        <View style={styles.previewModal}>
          <TouchableOpacity 
            style={styles.closePreviewButton}
            onPress={() => setPreviewMedia(null)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          {previewMedia?.type === 'image' ? (
            <Image 
              source={{ uri: previewMedia.uri }} 
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <Video
              source={{ uri: previewMedia?.uri || '' }}
              style={styles.previewVideo}
              useNativeControls
              resizeMode={'contain' as any}
              shouldPlay
              isMuted={false}
              volume={1.0}
            />
          )}
        </View>
      </Modal>

      <View style={styles.publishContainer}>
        <TouchableOpacity 
          style={[styles.publishButton, loading && styles.publishButtonDisabled]}
          onPress={handlePublish}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.publishButtonText}>PUBLICANDO...</Text>
            </>
          ) : (
            <Text style={styles.publishButtonText}>PUBLICAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginTop: 16,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#1C1E21',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  videoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 16,
    textAlign: 'center',
  },
  videoButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  videoButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: 8,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  videoButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
  },
  publishContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  publishButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: '#45A049',
  },
  publishButtonDisabled: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#65676B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E4E6EA',
    backgroundColor: '#FAFAFA',
  },
  pickerOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#65676B',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  videoButtonDisabled: {
    backgroundColor: '#A5D6A7',
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E6EA',
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#65676B',
  },
  yearScrollContainer: {
    maxHeight: 120,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#1C1E21',
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  pickerItem: {
    fontSize: 16,
    height: 50,
    color: '#1C1E21',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1C1E21',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownMenu: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1C1E21',
  },
  textInputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  validText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 4,
    textAlign: 'right',
  },
  videoSubtitle: {
    fontSize: 14,
    color: '#65676B',
    textAlign: 'center',
    marginBottom: 16,
  },
  videoSelectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  videoInfoContainer: {
    flex: 1,
    marginLeft: 8,
  },
  videoSelectedText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  videoNameText: {
    color: '#65676B',
    fontSize: 12,
    marginTop: 2,
  },
  videoActionButton: {
    padding: 4,
  },
  videoPlayerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  videoPlayerContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  videoPlayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  video: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  closeVideoButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
  },
  closeVideoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para múltiples medios
  mediaSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mediaSubtitle: {
    fontSize: 14,
    color: '#65676B',
    textAlign: 'center',
    marginBottom: 16,
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: 8,
  },
  mediaButtonDisabled: {
    backgroundColor: '#A5D6A7',
    opacity: 0.6,
  },
  mediaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  mediaItem: {
    width: '30%',
    aspectRatio: 1,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  previewModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePreviewButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  previewVideo: {
    width: '100%',
    height: '80%',
  },
});
