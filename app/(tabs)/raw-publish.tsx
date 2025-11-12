import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import apiService from '../../services/apiService';

export default function RawPublish() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Si cambia la marca, cargar los modelos disponibles y limpiar el modelo seleccionado
    if (field === 'brand') {
      setFormData(prev => ({ ...prev, model: '' }));
      loadModelsForBrand(value);
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

  const handleRecordVideo = () => {
    console.log('Grabando video...');
    Alert.alert('Grabar Video', 'Función de grabación de video próximamente');
  };

  const handleUploadVideo = () => {
    console.log('Adjuntando video...');
    Alert.alert('Adjuntar Video', 'Función de adjuntar video próximamente');
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
        videoUrl: formData.videoUrl || undefined,
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
          <TextInput
            style={styles.textInput}
            value={formData.year}
            onChangeText={(value) => handleInputChange('year', value)}
            placeholder="Ej: 2020"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={4}
            editable={!loading}
          />
        </View>

        {/* Patente */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Patente *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.plate}
            onChangeText={(value) => handleInputChange('plate', value)}
            placeholder="Ej: ABCD12 o AB-CD-12"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            editable={!loading}
          />
        </View>

        {/* Precio */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Precio de venta *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
            placeholder="Ej: 15000000"
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
            onChangeText={(value) => handleInputChange('kilometers', value)}
            placeholder="Ej: 50000"
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
          <TextInput
            style={styles.textInput}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="Ej: Santiago, Región Metropolitana"
            placeholderTextColor="#999"
            editable={!loading}
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
          />
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
          />
        </View>
      </View>

      <View style={styles.videoSection}>
        <Text style={styles.sectionTitle}>Video del vehículo (opcional)</Text>
        
        <View style={styles.videoButtonsContainer}>
          <TouchableOpacity 
            style={[styles.videoButton, loading && styles.videoButtonDisabled]}
            onPress={handleRecordVideo}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Ionicons name="play-circle" size={32} color="#FFFFFF" />
            <Text style={styles.videoButtonText}>Grabar Video</Text>
            <Text style={styles.videoButtonSubtext}>Hasta 60 segundos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.videoButton, loading && styles.videoButtonDisabled]}
            onPress={handleUploadVideo}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Ionicons name="cloud-upload" size={32} color="#FFFFFF" />
            <Text style={styles.videoButtonText}>Adjuntar Video</Text>
            <Text style={styles.videoButtonSubtext}>Hasta 60 segundos</Text>
          </TouchableOpacity>
        </View>
      </View>

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
});
