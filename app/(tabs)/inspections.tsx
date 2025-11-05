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

export default function Inspections() {
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const inspectionServices = [
    { id: 'basic', name: 'Inspección Básica', price: '$50.000', duration: '30 min' },
    { id: 'complete', name: 'Inspección Completa', price: '$90.000', duration: '60 min' },
    { id: 'premium', name: 'Inspección Premium', price: '$130.000', duration: '90 min' },
  ];

  const handleRequestInspection = () => {
    if (!vehiclePlate.trim() || !vehicleBrand.trim() || !vehicleModel.trim() || !vehicleYear.trim() || !selectedService) {
      Alert.alert('Error', 'Por favor completa todos los campos y selecciona un servicio');
      return;
    }
    
    console.log('Solicitando inspección:', {
      vehiclePlate,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      selectedService
    });
    
    Alert.alert('Éxito', 'Solicitud de inspección enviada. Te contactaremos pronto.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="car-sport" size={48} color="#66BB6A" />
        <Text style={styles.title}>Solicitar Inspección</Text>
        <Text style={styles.subtitle}>
          Programa una inspección mecánica profesional para tu vehículo
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Datos del Vehículo</Text>
        
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Patente</Text>
          <TextInput
            style={styles.textInput}
            value={vehiclePlate}
            onChangeText={setVehiclePlate}
            placeholder="Ej: ABC-1234"
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Marca</Text>
            <TextInput
              style={styles.textInput}
              value={vehicleBrand}
              onChangeText={setVehicleBrand}
              placeholder="Toyota"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputSection, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.inputLabel}>Año</Text>
            <TextInput
              style={styles.textInput}
              value={vehicleYear}
              onChangeText={setVehicleYear}
              placeholder="2020"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Modelo</Text>
          <TextInput
            style={styles.textInput}
            value={vehicleModel}
            onChangeText={setVehicleModel}
            placeholder="Corolla"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>Selecciona{'\n'}Revisión</Text>
        
        {inspectionServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              selectedService === service.id && styles.selectedServiceCard
            ]}
            onPress={() => setSelectedService(service.id)}
            activeOpacity={0.8}
          >
            <View style={styles.serviceInfo}>
              <Text style={[
                styles.serviceName,
                selectedService === service.id && styles.selectedServiceText
              ]}>
                {service.name}
              </Text>
              <View style={styles.serviceDetails}>
                <Text style={[
                  styles.servicePrice,
                  selectedService === service.id && styles.selectedServiceText
                ]}>
                  {service.price}
                </Text>
                <Text style={[
                  styles.serviceDuration,
                  selectedService === service.id && styles.selectedServiceText
                ]}>
                  {service.duration}
                </Text>
              </View>
            </View>
            {selectedService === service.id && (
              <Ionicons name="checkmark-circle" size={24} color="#66BB6A" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.requestButton} 
          onPress={handleRequestInspection}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar" size={24} color="#FFFFFF" />
          <Text style={styles.requestButtonText}>Solicitar Inspección</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>¿Qué incluye nuestra inspección?</Text>
        <View style={styles.benefits}>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#66BB6A" />
            <Text style={styles.benefitText}>Revisión completa del motor</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#66BB6A" />
            <Text style={styles.benefitText}>Sistema de frenos y suspensión</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#66BB6A" />
            <Text style={styles.benefitText}>Documentación oficial</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color="#66BB6A" />
            <Text style={styles.benefitText}>Servicio a domicilio disponible</Text>
          </View>
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#65676B',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
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
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
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
  row: {
    flexDirection: 'row',
  },
  servicesContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  selectedServiceCard: {
    borderColor: '#66BB6A',
    backgroundColor: '#F1F8E9',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 4,
  },
  selectedServiceText: {
    color: '#66BB6A',
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#65676B',
  },
  buttonContainer: {
    padding: 16,
  },
  requestButton: {
    backgroundColor: '#66BB6A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 16,
  },
  benefits: {
    gap: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#65676B',
    flex: 1,
  },
});