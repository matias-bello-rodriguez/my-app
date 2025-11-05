import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ReviewInspectionDetailByCar() {
  const [mechanicRating, setMechanicRating] = useState(0);

  // Datos de ejemplo del mecánico y la inspección
  const inspectionData = {
    vehiclePlate: 'ABCD-34',
    vehicleModel: 'Toyota Corolla 2020',
    inspectionDate: '25/10/2025',
    inspectionTime: '14:30',
    location: 'AutoBox 17 Calle Prat 814 Valparaíso',
    mechanic: {
      name: 'Carlos Rodríguez',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format&facepad=3',
      verified: true,
      rating: 4.8,
      reviews: 127
    }
  };

  const actionButtons = [
    { id: 'legal-report', title: 'Informe Legal PDF', icon: 'document-text' },
    { id: 'motor-scanner', title: 'Scanner Motor PDF', icon: 'hardware-chip' },
    { id: 'video-inspection', title: 'Video Inspección', icon: 'videocam' },
    { id: 'detail-photos', title: 'Fotos con Detalles', icon: 'camera' },
    { id: 'test-circuit', title: 'Circuito de Prueba', icon: 'speedometer' },
    { id: 'share-camera', title: 'Compartir Cámara Autobox', icon: 'share' },
  ];

  const handleActionPress = (actionId: string) => {
    console.log(`Acción presionada: ${actionId}`);
  };

  const handleStarPress = (rating: number) => {
    setMechanicRating(rating);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(index + 1)}
        style={styles.starButton}
      >
        <Ionicons
          name={index < mechanicRating ? 'star' : 'star-outline'}
          size={24}
          color={index < mechanicRating ? '#FFD700' : '#E4E6EA'}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Tarjeta del Mecánico */}
        <View style={styles.mechanicCard}>
          <View style={styles.mechanicInfo}>
            <Image 
              source={{ uri: inspectionData.mechanic.photo }}
              style={styles.mechanicPhoto}
            />
            <View style={styles.mechanicDetails}>
              <Text style={styles.mechanicName}>{inspectionData.mechanic.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {inspectionData.mechanic.rating} ({inspectionData.mechanic.reviews} reseñas)
                </Text>
              </View>
            </View>
            {inspectionData.mechanic.verified && (
              <Ionicons name="checkmark-circle" size={24} color="#1DA1F2" />
            )}
          </View>

          <View style={styles.mechanicActions}>
            <TouchableOpacity style={styles.qrButton}>
              <Ionicons name="qr-code" size={20} color="#4CAF50" />
              <Text style={styles.qrButtonText}>Verificar Identidad</Text>
            </TouchableOpacity>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Evaluar servicio:</Text>
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>
            </View>
          </View>
        </View>

        {/* Información del Vehículo e Inspección */}
        <View style={styles.inspectionCard}>
          <Text style={styles.vehicleTitle}>Vehículo: {inspectionData.vehiclePlate}</Text>
          <Text style={styles.vehicleModel}>{inspectionData.vehicleModel}</Text>
          
          <View style={styles.inspectionDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#65676B" />
              <Text style={styles.detailText}>
                {inspectionData.inspectionDate} a las {inspectionData.inspectionTime}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#65676B" />
              <Text style={styles.detailText}>{inspectionData.location}</Text>
            </View>
          </View>
        </View>

        {/* Cuadrícula de Acciones */}
        <View style={styles.actionsGrid}>
          {actionButtons.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={() => handleActionPress(action.id)}
              activeOpacity={0.8}
            >
              <Ionicons name={action.icon as any} size={28} color="#4CAF50" />
              <Text style={styles.actionButtonText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón de Inspección a Distancia */}
        <View style={styles.distanceInspectionContainer}>
          <TouchableOpacity style={styles.distanceInspectionButton}>
            <Ionicons name="videocam" size={24} color="#FFFFFF" />
            <Text style={styles.distanceInspectionText}>Inspección a Distancia</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scrollContainer: {
    flex: 1,
  },
  // Estilos de la tarjeta del mecánico
  mechanicCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mechanicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mechanicPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  mechanicDetails: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#65676B',
    marginLeft: 4,
  },
  mechanicActions: {
    gap: 16,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F8E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 8,
  },
  qrButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  ratingSection: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  // Estilos de información del vehículo
  inspectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 16,
    color: '#65676B',
    marginBottom: 16,
  },
  inspectionDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#65676B',
    flex: 1,
  },
  // Estilos de la cuadrícula de acciones
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1E21',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Estilos del botón de inspección a distancia
  distanceInspectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  distanceInspectionButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 12,
  },
  distanceInspectionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
