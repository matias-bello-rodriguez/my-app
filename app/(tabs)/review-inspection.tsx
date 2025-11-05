import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ReviewInspection() {
  const router = useRouter();
  const [rut, setRut] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Datos de ejemplo para simular resultados de búsqueda
  const mockInspections = [
    {
      id: 'INS-2024-001234',
      vehiclePlate: 'ABC-1234',
      vehicleModel: 'Toyota Corolla 2020',
      inspectionDate: '25/10/2024',
      status: 'Completado',
      statusColor: '#4CAF50',
      location: 'AutoBox Providencia',
      price: '$90.000',
      vehicleImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop&auto=format'
    },
    {
      id: 'INS-2024-001235',
      vehiclePlate: 'DEF-5678',
      vehicleModel: 'Honda Civic 2019',
      inspectionDate: '20/10/2024',
      status: 'En Proceso',
      statusColor: '#FF9800',
      location: 'AutoBox Las Condes',
      price: '$90.000',
      vehicleImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&auto=format'
    },
    {
      id: 'INS-2024-001236',
      vehiclePlate: 'GHI-9012',
      vehicleModel: 'Nissan Sentra 2021',
      inspectionDate: '18/10/2024',
      status: 'Pendiente',
      statusColor: '#2196F3',
      location: 'AutoBox Centro',
      price: '$90.000',
      vehicleImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&auto=format'
    },
  ];

  const handleReviewInspection = () => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Simular búsqueda con delay
    setTimeout(() => {
      // Filtrar resultados basados en RUT o patente
      let filteredResults = mockInspections;
      
      if (rut.trim()) {
        // Aquí normalmente buscarías por RUT en la base de datos
        // Por ahora mostramos todos los resultados si hay RUT
        filteredResults = mockInspections;
      } else if (vehiclePlate.trim()) {
        filteredResults = mockInspections.filter(inspection => 
          inspection.vehiclePlate.toLowerCase().includes(vehiclePlate.toLowerCase())
        );
      }
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleScanQR = () => {
    console.log('Escaneando código QR');
    // Aquí puedes agregar la lógica para escanear QR
    Alert.alert('Info', 'Función de escaneo QR próximamente');
  };

  const handleInspectionPress = (inspection: any) => {
    console.log('Navegando a detalle de inspección:', inspection);
    router.push('/review-inspection-detail-by-car');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={48} color="#4CAF50" />
        <Text style={styles.title}>Revisar Inspección</Text>
        <Text style={styles.subtitle}>
          Verifica el estado de una inspección mecánica existente
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>RUT</Text>
          <TextInput
            style={styles.textInput}
            value={rut}
            onChangeText={setRut}
            placeholder="Ej: 12.345.678-9"
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
          <Text style={styles.searchButtonText}>
            {isSearching ? 'Buscando...' : 'Buscar Inspección'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resultados de búsqueda */}
      {hasSearched && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {searchResults.length > 0 
              ? `${searchResults.length} resultado(s) encontrado(s)` 
              : 'No se encontraron resultados'
            }
          </Text>
          
          <View style={styles.resultsGrid}>
            {searchResults.map((inspection) => (
              <TouchableOpacity 
                key={inspection.id} 
                style={styles.resultCard}
                activeOpacity={0.8}
                onPress={() => handleInspectionPress(inspection)}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.resultMainInfo}>
                    <Text style={styles.resultPlate}>{inspection.vehiclePlate}</Text>
                    <Text style={styles.resultModel} numberOfLines={2}>{inspection.vehicleModel}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: inspection.statusColor }]}>
                    <Text style={styles.statusBadgeText}>{inspection.status}</Text>
                  </View>
                </View>
                
                <View style={styles.resultDetails}>
                  <View style={styles.resultDetailRow}>
                    <Ionicons name="calendar" size={14} color="#65676B" />
                    <Text style={styles.resultDetailText}>Fecha: {inspection.inspectionDate}</Text>
                  </View>
                  <View style={styles.resultDetailRow}>
                    <Ionicons name="location" size={14} color="#65676B" />
                    <Text style={styles.resultDetailText} numberOfLines={1}>{inspection.location}</Text>
                  </View>

                  {/* Mostrar imagen del vehículo siempre */}
                  <View style={styles.vehicleImageContainer}>
                    <Text style={styles.vehicleImageLabel}>Foto del vehículo:</Text>
                    {inspection.status === 'Completado' && inspection.vehicleImage ? (
                      <Image 
                        source={{ uri: inspection.vehicleImage }}
                        style={styles.vehicleImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Ionicons name="car" size={40} color="#999" />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
    backgroundColor: '#4CAF50',
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
  // Estilos para resultados de búsqueda
  resultsContainer: {
    margin: 16,
    marginTop: 0,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    width: '48%', // Para mostrar 2 cards por fila
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultMainInfo: {
    flex: 1,
  },
  resultPlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 2,
  },
  resultModel: {
    fontSize: 12,
    color: '#65676B',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultDetails: {
    gap: 6,
  },
  resultDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultDetailText: {
    fontSize: 12,
    color: '#65676B',
    flex: 1,
  },
  // Estilos para imagen del vehículo
  vehicleImageContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E4E6EA',
  },
  vehicleImageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 6,
  },
  vehicleImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    backgroundColor: '#F0F2F5',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});