import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function CarDetailBySearchbar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Extraer los parámetros pasados desde search.tsx
  const vehicleId = params.vehicleId as string;
  const brand = params.brand as string || 'Marca desconocida';
  const model = params.model as string || 'Modelo desconocido';
  const year = parseInt(params.year as string) || new Date().getFullYear();
  const price = parseInt(params.price as string) || 0;
  const mileage = parseInt(params.mileage as string) || 0;
  const fuel = params.fuel as string || 'No especificado';
  const transmission = params.transmission as string || 'No especificada';
  const location = params.location as string || 'Ubicación no especificada';

  // Datos del vehículo (algunos datos son estáticos, otros vienen de params)
  const vehicle = {
    id: vehicleId || '1',
    brand: brand,
    model: model,
    year: year,
    price: price,
    mileage: mileage,
    fuel: fuel,
    transmission: transmission,
    location: location,
    description: `${brand} ${model} ${year} en excelente estado. Mantenimiento al día. Incluye aire acondicionado, cierre centralizado, alzavidrios eléctricos, y radio con Bluetooth.`,
    features: [
      'Aire acondicionado',
      'Cierre centralizado',
      'Alzavidrios eléctricos',
      'Radio con Bluetooth',
      'Control de crucero',
      'Sensor de reversa',
      'Cámara de retroceso',
      'Frenos ABS',
      'Airbags frontales y laterales'
    ],
    specifications: {
      motor: '1.8L 4 cilindros',
      potencia: '140 HP',
      cilindrada: '1798 cc',
      traccion: 'Delantera',
      color: 'Blanco',
      puertas: 4,
      pasajeros: 5,
      VIN: 'JTDBURBE0L3000001'
    },
    seller: {
      name: 'Juan Pérez',
      phone: '+56 9 1234 5678',
      email: 'juan.perez@email.com',
      rating: 4.5,
      reviews: 12
    },
    images: [
      null, // Placeholder para imágenes
      null,
      null,
      null
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatKilometers = (km: number) => {
    return `${km.toLocaleString('es-CL')} km`;
  };

  const handleContact = () => {
    Alert.alert(
      'Contactar vendedor',
      `¿Cómo deseas contactar a ${vehicle.seller.name}?`,
      [
        {
          text: 'WhatsApp',
          onPress: () => Alert.alert('WhatsApp', `Abriendo WhatsApp: ${vehicle.seller.phone}`)
        },
        {
          text: 'Llamar',
          onPress: () => Alert.alert('Llamada', `Llamando a: ${vehicle.seller.phone}`)
        },
        {
          text: 'Email',
          onPress: () => Alert.alert('Email', `Enviando email a: ${vehicle.seller.email}`)
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const handleScheduleInspection = () => {
    Alert.alert(
      'Agendar inspección',
      '¿Deseas agendar una inspección técnica para este vehículo?',
      [
        {
          text: 'Sí, agendar',
          onPress: () => router.push('/inspections')
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      isFavorite ? 'El vehículo se eliminó de tu lista de favoritos' : 'El vehículo se agregó a tu lista de favoritos'
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1E21" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detalle del vehículo</Text>
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#FF0000" : "#1C1E21"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Carrusel de imágenes */}
        <View style={styles.imageCarousel}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="car-sport" size={80} color="#999" />
            <Text style={styles.imagePlaceholderText}>Sin imágenes disponibles</Text>
          </View>
          
          {vehicle.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {vehicle.images.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.imageIndicator,
                    currentImageIndex === index && styles.imageIndicatorActive
                  ]} 
                />
              ))}
            </View>
          )}
        </View>

        {/* Información principal */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.vehicleTitle}>
                {vehicle.brand} {vehicle.model}
              </Text>
              <Text style={styles.vehicleYear}>{vehicle.year}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio</Text>
              <Text style={styles.price}>{formatCurrency(vehicle.price)}</Text>
            </View>
          </View>

          {/* Stats rápidas */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Ionicons name="speedometer-outline" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{formatKilometers(vehicle.mileage)}</Text>
              <Text style={styles.statLabel}>Kilometraje</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flash-outline" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{vehicle.fuel}</Text>
              <Text style={styles.statLabel}>Combustible</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="settings-outline" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{vehicle.transmission}</Text>
              <Text style={styles.statLabel}>Transmisión</Text>
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#65676B" />
            <Text style={styles.locationText}>{vehicle.location}</Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{vehicle.description}</Text>
        </View>

        {/* Especificaciones técnicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especificaciones técnicas</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Motor:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.motor}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Potencia:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.potencia}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Cilindrada:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.cilindrada}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Tracción:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.traccion}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Color:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.color}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Puertas:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.puertas}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Pasajeros:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.pasajeros}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>VIN:</Text>
              <Text style={styles.specValue}>{vehicle.specifications.VIN}</Text>
            </View>
          </View>
        </View>

        {/* Características */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.featuresList}>
            {vehicle.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Información del vendedor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendedor</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerHeader}>
              <View style={styles.sellerAvatar}>
                <Ionicons name="person" size={32} color="#4CAF50" />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{vehicle.seller.name}</Text>
                <View style={styles.sellerRating}>
                  <Ionicons name="star" size={16} color="#FFB300" />
                  <Text style={styles.ratingText}>
                    {vehicle.seller.rating} ({vehicle.seller.reviews} reseñas)
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Contactar vendedor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Padding bottom para los botones fijos */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botones de acción fijos */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleScheduleInspection}
        >
          <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
          <Text style={styles.secondaryButtonText}>Agendar inspección</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleContact}
        >
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Contactar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageCarousel: {
    height: 300,
    backgroundColor: '#E8E8E8',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageIndicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  mainInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 16,
    color: '#65676B',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#65676B',
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E4E6EA',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1E21',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#65676B',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#1C1E21',
    lineHeight: 22,
  },
  specsGrid: {
    gap: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  specLabel: {
    fontSize: 14,
    color: '#65676B',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#1C1E21',
    fontWeight: '600',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#1C1E21',
  },
  sellerCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 4,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#65676B',
  },
  contactButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E4E6EA',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0F2F5',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
