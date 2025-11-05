import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function RawPublish() {
  const [formData, setFormData] = useState({
    price: '',
    licensePlate: '',
    mileage: '',
    location: '',
    observations: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecordVideo = () => {
    console.log('Grabando video...');
    Alert.alert('Grabar Video', 'Función de grabación de video próximamente');
  };

  const handleUploadVideo = () => {
    console.log('Adjuntando video...');
    Alert.alert('Adjuntar Video', 'Función de adjuntar video próximamente');
  };

  const handlePublish = () => {
    // Validación básica
    if (!formData.price || !formData.licensePlate || !formData.mileage || !formData.location) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    console.log('Publicando auto:', formData);
    Alert.alert('Éxito', 'Tu publicación ha sido creada exitosamente');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="car-sport" size={48} color="#4CAF50" />
        <Text style={styles.title}>Ingresar información del auto</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Precio de venta *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
            placeholder="Ej: $15.000.000"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Patente *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.licensePlate}
            onChangeText={(value) => handleInputChange('licensePlate', value)}
            placeholder="Ej: ABC-1234"
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Kilometraje *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.mileage}
            onChangeText={(value) => handleInputChange('mileage', value)}
            placeholder="Ej: 50.000 km"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Región o ciudad *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="Ej: Santiago, Región Metropolitana"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Observaciones</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.observations}
            onChangeText={(value) => handleInputChange('observations', value)}
            placeholder="Agrega información adicional sobre tu vehículo..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.videoSection}>
        <Text style={styles.sectionTitle}>Video del vehículo</Text>
        
        <View style={styles.videoButtonsContainer}>
          <TouchableOpacity 
            style={styles.videoButton}
            onPress={handleRecordVideo}
            activeOpacity={0.8}
          >
            <Ionicons name="play-circle" size={32} color="#FFFFFF" />
            <Text style={styles.videoButtonText}>Grabar Video</Text>
            <Text style={styles.videoButtonSubtext}>Hasta 60 segundos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.videoButton}
            onPress={handleUploadVideo}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload" size={32} color="#FFFFFF" />
            <Text style={styles.videoButtonText}>Adjuntar Video</Text>
            <Text style={styles.videoButtonSubtext}>Hasta 60 segundos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.publishContainer}>
        <TouchableOpacity 
          style={styles.publishButton}
          onPress={handlePublish}
          activeOpacity={0.8}
        >
          <Text style={styles.publishButtonText}>PUBLICAR</Text>
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
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
