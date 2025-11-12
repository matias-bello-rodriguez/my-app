import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePicker from '../../components/DateTimePicker';
import apiService from '../../services/apiService';

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
  const [plateValid, setPlateValid] = useState<boolean | null>(null);
  const [rutValid, setRutValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const autoBoxLocations = [
    { id: 'centro', name: 'AutoBox Centro' },
    { id: 'providencia', name: 'AutoBox Providencia' },
    { id: 'las_condes', name: 'AutoBox Las Condes' },
    { id: 'maipu', name: 'AutoBox Maipú' },
    { id: 'san_miguel', name: 'AutoBox San Miguel' },
  ];

  // Función para formatear el RUT con puntos y guión
  const formatRut = (text: string): string => {
    // Eliminar puntos y guiones previos para procesar el texto limpio
    let cleaned = text.replace(/\./g, '').replace(/-/g, '');
    
    // Separar números de la letra K
    const numbers = cleaned.replace(/[^0-9]/g, '');
    const hasK = /[kK]/.test(cleaned);
    
    if (numbers.length === 0) return '';
    
    // Si solo hay números sin K, no formatear hasta que haya más de un dígito
    if (!hasK && numbers.length === 1) return numbers;
    
    // Determinar el cuerpo y el dígito verificador
    let body = '';
    let dv = '';
    
    if (hasK) {
      // Si tiene K, el cuerpo son todos los números y el dv es K
      body = numbers;
      dv = 'K';
    } else {
      // Si no tiene K, separar el último número como dv
      body = numbers.slice(0, -1);
      dv = numbers.slice(-1);
    }
    
    if (body.length === 0) return dv;
    
    // Formatear el cuerpo con puntos (cada 3 dígitos de derecha a izquierda)
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Retornar con guión antes del dígito verificador
    return `${formattedBody}-${dv}`;
  };

  // Función para limpiar el RUT (sin puntos ni guión)
  const cleanRut = (rut: string): string => {
    return rut.replace(/\./g, '').replace(/-/g, '');
  };

  // Validar RUT chileno con algoritmo módulo 11
  const validateRut = (rut: string): boolean => {
    const cleanedRut = cleanRut(rut);
    
    // Debe tener entre 8 y 9 caracteres
    if (cleanedRut.length < 8 || cleanedRut.length > 9) {
      return false;
    }
    
    // Separar cuerpo y dígito verificador
    const body = cleanedRut.slice(0, -1);
    const dv = cleanedRut.slice(-1).toUpperCase();
    
    // El cuerpo debe tener al menos 7 dígitos
    if (body.length < 7) {
      return false;
    }
    
    // Verificar que el cuerpo solo contenga números
    if (!/^\d+$/.test(body)) {
      return false;
    }
    
    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedDv = 11 - (sum % 11);
    let calculatedDv = '';
    
    if (expectedDv === 11) calculatedDv = '0';
    else if (expectedDv === 10) calculatedDv = 'K';
    else calculatedDv = expectedDv.toString();
    
    return dv === calculatedDv;
  };

  // Manejador para el RUT
  const handleRutChange = (text: string) => {
    // Solo permitir números y K/k
    const filtered = text.replace(/[^0-9kK]/g, '');
    
    // Contar cuántas K hay
    const kCount = (filtered.match(/[kK]/g) || []).length;
    
    // Si hay más de una K, no permitir
    if (kCount > 1) return;
    
    // Si hay una K, verificar que esté al final
    if (kCount === 1) {
      const kIndex = filtered.search(/[kK]/);
      // Si la K no está al final, no permitir
      if (kIndex !== filtered.length - 1) return;
    }
    
    const formatted = formatRut(filtered);
    setUserRut(formatted);
    
    // Validar RUT cuando tenga al menos 8 caracteres sin formato
    const cleaned = cleanRut(formatted);
    if (cleaned.length >= 8) {
      setRutValid(validateRut(formatted));
    } else {
      setRutValid(null);
    }
  };

  // Formatear número de celular chileno
  const formatPhone = (text: string): string => {
    // Eliminar todo excepto números
    const cleaned = text.replace(/\D/g, '');
    
    // Si está vacío, retornar vacío
    if (cleaned.length === 0) return '';
    
    // Formato: +56 9 1234 5678
    let formatted = '+56';
    
    if (cleaned.length > 2) {
      // Agregar el 9
      formatted += ' ' + cleaned.substring(2, 3);
      
      if (cleaned.length > 3) {
        // Agregar los primeros 4 dígitos
        formatted += ' ' + cleaned.substring(3, 7);
        
        if (cleaned.length > 7) {
          // Agregar los últimos 4 dígitos
          formatted += ' ' + cleaned.substring(7, 11);
        }
      }
    }
    
    return formatted;
  };

  // Manejador para el celular
  const handlePhoneChange = (text: string) => {
    // Si el usuario borra todo, permitir
    if (text === '') {
      setUserPhone('');
      return;
    }
    
    // Si el texto no comienza con +56, agregarlo
    if (!text.startsWith('+56')) {
      text = '56' + text.replace(/\D/g, '');
    }
    
    // Formatear el número
    const formatted = formatPhone(text);
    setUserPhone(formatted);
  };

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejador para el email
  const handleEmailChange = (text: string) => {
    setUserEmail(text.toLowerCase().trim());
    
    if (text.trim().length > 0) {
      setEmailValid(validateEmail(text.trim()));
    } else {
      setEmailValid(null);
    }
  };

  const handlePlateChange = async (text: string) => {
    // Solo permitir letras y números, máximo 6 caracteres
    const filtered = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const limited = filtered.slice(0, 6);
    
    setVehiclePlate(limited);
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

  const handleRequestInspection = () => {
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
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            onChangeText={handlePlateChange}
            placeholder="ABC123"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            maxLength={6}
          />
          {plateValid === false && vehiclePlate.length === 6 && (
            <Text style={styles.errorText}>
              Formato de patente inválido
            </Text>
          )}
        </View>

        {/* Segunda fila: Fecha y Hora */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <DateTimePicker
              label="Fecha"
              value={inspectionDate}
              onChange={setInspectionDate}
              mode="date"
              placeholder="DD/MM/AAAA"
            />
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <DateTimePicker
              label="Hora"
              value={inspectionTime}
              onChange={setInspectionTime}
              mode="time"
              placeholder="HH:MM"
            />
          </View>
        </View>

        {/* Dropdown AutoBox */}
        <View style={[styles.inputSection, { marginTop: 20 }]}>
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
            style={[
              styles.textInput,
              rutValid === false && styles.textInputError
            ]}
            value={userRut}
            onChangeText={handleRutChange}
            placeholder="12.345.678-9"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={12}
          />
          {rutValid === false && (
            <Text style={styles.errorText}>
              RUT inválido
            </Text>
          )}
        </View>

        {/* Celular */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Celular</Text>
          <TextInput
            style={styles.textInput}
            value={userPhone}
            onChangeText={handlePhoneChange}
            placeholder="+56 9 1234 5678"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={16}
          />
        </View>

        {/* Email */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[
              styles.textInput,
              emailValid === false && styles.textInputError
            ]}
            value={userEmail}
            onChangeText={handleEmailChange}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailValid === false && (
            <Text style={styles.errorText}>
              Email inválido
            </Text>
          )}
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
          style={styles.requestButton} 
          onPress={handleRequestInspection}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar" size={24} color="#FFFFFF" />
          <Text style={styles.requestButtonText}>Solicitar</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
  textInputError: {
    borderColor: '#F44336',
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
  validatingText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  vehicleInfoContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  vehicleInfoText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
});