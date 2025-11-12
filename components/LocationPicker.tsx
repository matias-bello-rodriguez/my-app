import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationPickerProps {
  value: string;
  onLocationChange: (address: string, coordinates: { latitude: number; longitude: number }) => void;
  disabled?: boolean;
}

export default function LocationPicker({ value, onLocationChange, disabled = false }: LocationPickerProps) {
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a tu ubicación para mostrar el mapa'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (!selectedLocation) {
        setSelectedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      // Usar ubicación por defecto (Santiago, Chile)
      const defaultLocation = {
        latitude: -33.4489,
        longitude: -70.6693,
      };
      setCurrentLocation(defaultLocation);
      if (!selectedLocation) {
        setSelectedLocation(defaultLocation);
      }
    }
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const place = address[0];
        const addressParts = [];
        
        if (place.street) addressParts.push(place.street);
        if (place.streetNumber) addressParts.push(place.streetNumber);
        if (place.city) addressParts.push(place.city);
        if (place.region) addressParts.push(place.region);
        
        return addressParts.join(', ') || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
      
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    try {
      const address = await getAddressFromCoordinates(
        selectedLocation.latitude,
        selectedLocation.longitude
      );
      onLocationChange(address, selectedLocation);
      setShowMap(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a tu ubicación para usar tu ubicación actual'
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setSelectedLocation(coords);
      setCurrentLocation(coords);
      
      const address = await getAddressFromCoordinates(coords.latitude, coords.longitude);
      onLocationChange(address, coords);
      setShowMap(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => setShowMap(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons name="location" size={20} color={disabled ? "#999" : "#4CAF50"} />
        <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
          {value || 'Seleccionar ubicación en mapa'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={disabled ? "#999" : "#4CAF50"} />
      </TouchableOpacity>

      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowMap(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Selecciona tu ubicación</Text>
            <View style={{ width: 28 }} />
          </View>

          {selectedLocation ? (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={selectedLocation}
                title="Ubicación seleccionada"
                draggable
                onDragEnd={handleMapPress}
              />
            </MapView>
          ) : (
            <View style={styles.loadingMapContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingMapText}>Cargando mapa...</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.currentLocationButton]}
              onPress={handleUseCurrentLocation}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="navigate" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Usar ubicación actual</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={handleConfirmLocation}
              disabled={loading || !selectedLocation}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Confirmar ubicación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    color: '#1C1E21',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
    borderBottomColor: '#E4E6EA',
    backgroundColor: '#4CAF50',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  map: {
    flex: 1,
  },
  loadingMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  loadingMapText: {
    marginTop: 12,
    fontSize: 16,
    color: '#65676B',
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
    backgroundColor: '#4CAF50',
    borderTopWidth: 1,
    borderTopColor: '#45A049',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  currentLocationButton: {
    backgroundColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
