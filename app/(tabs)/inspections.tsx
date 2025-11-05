import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionTime, setInspectionTime] = useState('');
  const [selectedAutoBox, setSelectedAutoBox] = useState('');
  const [showAutoBoxDropdown, setShowAutoBoxDropdown] = useState(false);
  const [userRut, setUserRut] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const autoBoxLocations = [
    { id: 'centro', name: 'AutoBox Centro' },
    { id: 'providencia', name: 'AutoBox Providencia' },
    { id: 'las_condes', name: 'AutoBox Las Condes' },
    { id: 'maipu', name: 'AutoBox Maipú' },
    { id: 'san_miguel', name: 'AutoBox San Miguel' },
  ];

  const handleRequestInspection = () => {
    if (!vehiclePlate.trim() || !inspectionDate.trim() || !inspectionTime.trim() || 
        !selectedAutoBox || !userRut.trim() || !userPhone.trim() || !userEmail.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    if (!acceptTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }
    
    // Guardar los datos de la inspección para pasarlos a la pantalla de pago
    const inspectionData = {
      vehiclePlate,
      inspectionDate,
      inspectionTime,
      selectedAutoBox: autoBoxLocations.find(loc => loc.id === selectedAutoBox)?.name,
      userRut,
      userPhone,
      userEmail,
      acceptTerms
    };
    
    console.log('Datos de inspección:', inspectionData);
    
    // Navegar a la pantalla de pago
    router.push('/inspection_payment');
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
        <Text style={styles.sectionTitle}>Datos de la Inspección</Text>
        
        {/* Patente sola en su fila */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Patente</Text>
          <TextInput
            style={styles.textInput}
            value={vehiclePlate}
            onChangeText={setVehiclePlate}
            placeholder="ABC-1234"
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
        </View>

        {/* Segunda fila: Fecha y Hora */}
        <View style={styles.row}>
          <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Fecha</Text>
            <TextInput
              style={styles.textInput}
              value={inspectionDate}
              onChangeText={setInspectionDate}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputSection, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.inputLabel}>Hora</Text>
            <TextInput
              style={styles.textInput}
              value={inspectionTime}
              onChangeText={setInspectionTime}
              placeholder="14:30"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Dropdown AutoBox */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>AutoBox</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowAutoBoxDropdown(!showAutoBoxDropdown)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownText, !selectedAutoBox && styles.placeholderText]}>
              {selectedAutoBox ? autoBoxLocations.find(loc => loc.id === selectedAutoBox)?.name : 'Selecciona una ubicación'}
            </Text>
            <Ionicons 
              name={showAutoBoxDropdown ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          
          {showAutoBoxDropdown && (
            <View style={styles.dropdownMenu}>
              {autoBoxLocations.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedAutoBox(location.id);
                    setShowAutoBoxDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownItemText}>{location.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* RUT */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>RUT</Text>
          <TextInput
            style={styles.textInput}
            value={userRut}
            onChangeText={setUserRut}
            placeholder="12.345.678-9"
            placeholderTextColor="#999"
          />
        </View>

        {/* Celular */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Celular</Text>
          <TextInput
            style={styles.textInput}
            value={userPhone}
            onChangeText={setUserPhone}
            placeholder="+56 9 1234 5678"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Checkbox Términos y Condiciones */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
            onPress={() => setAcceptTerms(!acceptTerms)}
            activeOpacity={0.7}
          >
            {acceptTerms && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Acepto los{' '}
            <Text style={styles.linkText}>términos y condiciones</Text>
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.requestButton, !acceptTerms && styles.disabledButton]} 
          onPress={handleRequestInspection}
          activeOpacity={0.8}
          disabled={!acceptTerms}
        >
          <Ionicons name="calendar" size={24} color="#FFFFFF" />
          <Text style={styles.requestButtonText}>Solicitar</Text>
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
  // Nuevos estilos para dropdown
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
  // Estilos para checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E4E6EA',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#66BB6A',
    borderColor: '#66BB6A',
  },
  checkboxText: {
    fontSize: 14,
    color: '#1C1E21',
    flex: 1,
  },
  linkText: {
    color: '#66BB6A',
    fontWeight: '600',
  },
  // Estilo para botón deshabilitado
  disabledButton: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
});