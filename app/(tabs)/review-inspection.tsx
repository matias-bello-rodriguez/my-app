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

export default function ReviewInspection() {
  const [inspectionCode, setInspectionCode] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  const handleReviewInspection = () => {
    if (!inspectionCode.trim() || !vehiclePlate.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    console.log(`Revisando inspección - Código: ${inspectionCode}, Patente: ${vehiclePlate}`);
    // Aquí puedes agregar la lógica para revisar la inspección
    Alert.alert('Éxito', 'Buscando inspección...');
  };

  const handleScanQR = () => {
    console.log('Escaneando código QR');
    // Aquí puedes agregar la lógica para escanear QR
    Alert.alert('Info', 'Función de escaneo QR próximamente');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={48} color="#42A5F5" />
        <Text style={styles.title}>Revisar Inspección</Text>
        <Text style={styles.subtitle}>
          Verifica el estado de una inspección mecánica existente
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Código de Inspección</Text>
          <TextInput
            style={styles.textInput}
            value={inspectionCode}
            onChangeText={setInspectionCode}
            placeholder="Ej: INS-2024-001234"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Patente del Vehículo</Text>
          <TextInput
            style={styles.textInput}
            value={vehiclePlate}
            onChangeText={setVehiclePlate}
            placeholder="Ej: ABC-1234"
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
        </View>

        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={handleScanQR}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code" size={24} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Escanear Código QR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleReviewInspection}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
          <Text style={styles.searchButtonText}>Buscar Inspección</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>¿Dónde encuentro el código?</Text>
        <View style={styles.infoItems}>
          <View style={styles.infoItem}>
            <Ionicons name="document-outline" size={20} color="#65676B" />
            <Text style={styles.infoText}>En el certificado de inspección</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#65676B" />
            <Text style={styles.infoText}>En el correo de confirmación</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="qr-code-outline" size={20} color="#65676B" />
            <Text style={styles.infoText}>Código QR en el documento</Text>
          </View>
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Estados de Inspección</Text>
        <View style={styles.statusItems}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusText}>Aprobada - Vehículo en perfecto estado</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.statusText}>Pendiente - Correcciones menores</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.statusText}>Rechazada - Requiere reparaciones</Text>
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  scanButton: {
    backgroundColor: '#8E8E93',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#42A5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
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
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 16,
  },
  infoItems: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#65676B',
    flex: 1,
  },
  statusCard: {
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
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 16,
  },
  statusItems: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#65676B',
    flex: 1,
  },
});