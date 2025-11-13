import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image
} from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import apiService from '../../services/apiService';
import { useHeader } from '../../contexts/HeaderContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CarDetailBySearchbar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { hideHeader, showHeader } = useHeader();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  
  // Estados para el modal de video
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  
  // Estados para el modal TikTok
  const [showTikTokModal, setShowTikTokModal] = useState(false);
  const [currentTikTokIndex, setCurrentTikTokIndex] = useState(0);
  const tiktokFlatListRef = useRef<FlatList>(null);

  // Extraer el ID del vehículo
  const vehicleId = params.vehicleId as string;

  // Ocultar header cuando la pantalla esté enfocada y mostrarlo cuando se desenfoque
  useFocusEffect(
    useCallback(() => {
      hideHeader();
      return () => {
        showHeader();
      };
    }, [hideHeader, showHeader])
  );

  // Función para volver atrás
  const handleGoBack = () => {
    showHeader();
    router.back();
  };

  // Funciones para navegación del header
  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleChatPress = () => {
    router.push('/(tabs)/chat');
  };

  // Cargar datos del vehículo
  useEffect(() => {
    // Configurar el modo de audio para permitir reproducción con sonido
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    const loadVehicle = async () => {
      if (!vehicleId) {
        Alert.alert('Error', 'No se proporcionó un ID de vehículo');
        router.back();
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.getVehicleById(vehicleId);
        setVehicle(data);
      } catch (error) {
        console.error('Error al cargar vehículo:', error);
        Alert.alert('Error', 'No se pudo cargar la información del vehículo');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId]);

  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      'available': 'Disponible',
      'sold': 'Vendido',
      'inspection_pending': 'Inspección pendiente',
    };
    return translations[status] || status;
  };

  const translateFuelType = (fuel: string) => {
    const translations: { [key: string]: string } = {
      'Gasolina': 'Gasolina',
      'Diesel': 'Diésel',
      'Gas': 'Gas',
      'Híbrido': 'Híbrido',
      'Eléctrico': 'Eléctrico',
    };
    return translations[fuel] || fuel;
  };

  const translateTransmission = (transmission: string) => {
    const translations: { [key: string]: string } = {
      'Manual': 'Manual',
      'Automática': 'Automática',
      'Semiautomática': 'Semiautomática',
    };
    return translations[transmission] || transmission;
  };

  const formatCurrency = (amount: number) => {
    if (!amount || isNaN(amount)) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(Math.floor(amount));
  };

  const formatKilometers = (km: number) => {
    if (!km || isNaN(km)) return '0 km';
    return `${Math.floor(km).toLocaleString('es-CL')} km`;
  };

  // Función para obtener el primer medio disponible (video o imagen)
  const getFirstMedia = (car: any): { type: 'video' | 'image' | null; uri: string } => {
    // Prioridad 1: videoUrl (video único)
    if (car.videoUrl && typeof car.videoUrl === 'string') {
      return { type: 'video', uri: car.videoUrl };
    }
    
    // Prioridad 2: primer video del array videos
    if (car.videos && Array.isArray(car.videos) && car.videos.length > 0) {
      return { type: 'video', uri: car.videos[0] };
    }
    
    // Prioridad 3: primera imagen del array images
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      return { type: 'image', uri: car.images[0] };
    }
    
    // Sin multimedia
    return { type: null, uri: '' };
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
    if (!vehicle) return;
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      isFavorite ? 'El vehículo se eliminó de tu lista de favoritos' : 'El vehículo se agregó a tu lista de favoritos'
    );
  };

  // Funciones para el modal TikTok
  const handleVideoPress = () => {
    if (vehicle && vehicle.videoUrl) {
      setShowTikTokModal(true);
    }
  };

  const handleLike = () => {
    toggleFavorite();
  };

  const handleShare = () => {
    Alert.alert('Compartir', 'Compartir este vehículo');
  };

  const handleCommentTikTok = () => {
    setShowTikTokModal(false);
    handleContact();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentTikTokIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80
  }).current;

  const renderTikTokItem = ({ item, index }: { item: any; index: number }) => {
    const isActive = index === currentTikTokIndex;
    
    return (
      <View style={styles.tiktokContainer}>
        <View style={styles.tiktokVideoContainer}>
          {item.videoUrl ? (
            <Video
              source={{ uri: item.videoUrl }}
              style={styles.tiktokVideo}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={isActive}
              isMuted={false}
              volume={1.0}
              useNativeControls={false}
            />
          ) : (
            <View style={styles.tiktokPlaceholder}>
              <Text style={styles.tiktokPlaceholderEmoji}>🚗</Text>
            </View>
          )}
        </View>

        {/* Información del vehículo (overlay inferior izquierdo) */}
        <View style={styles.tiktokInfoContainer}>
          <View style={styles.tiktokUserInfo}>
            <View style={styles.tiktokAvatar}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.tiktokUsername}>
              {item.seller?.name || 'Vendedor'}
            </Text>
          </View>
          
          <Text style={styles.tiktokCarTitle}>
            {item.brand} {item.model} {item.year}
          </Text>
          
          <Text style={styles.tiktokCarPrice}>
            {formatCurrency(item.price)}
          </Text>
          
          <View style={styles.tiktokCarDetails}>
            <View style={styles.tiktokDetailItem}>
              <Ionicons name="speedometer" size={14} color="#FFFFFF" />
              <Text style={styles.tiktokDetailText}>
                {formatKilometers(item.mileage || item.kilometers || 0)}
              </Text>
            </View>
            
            <View style={styles.tiktokDetailItem}>
              <Ionicons name="flash" size={14} color="#FFFFFF" />
              <Text style={styles.tiktokDetailText}>
                {translateFuelType(item.fuel || item.fuelType)}
              </Text>
            </View>
            
            <View style={styles.tiktokDetailItem}>
              <Ionicons name="settings" size={14} color="#FFFFFF" />
              <Text style={styles.tiktokDetailText}>
                {translateTransmission(item.transmission)}
              </Text>
            </View>
            
            <View style={styles.tiktokDetailItem}>
              <Ionicons name="location" size={14} color="#FFFFFF" />
              <Text style={styles.tiktokDetailText}>
                {item.location || 'Sin ubicación'}
              </Text>
            </View>
          </View>
          
          <View style={styles.tiktokStatusBadge}>
            <Text style={styles.tiktokStatusText}>
              {translateStatus(item.status || 'available')}
            </Text>
          </View>
        </View>

        {/* Botones de acción (lado derecho) */}
        <View style={styles.tiktokActionsContainer}>
          <TouchableOpacity 
            style={styles.tiktokActionButton}
            onPress={handleLike}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={32} 
              color={isFavorite ? "#FF0000" : "#FFFFFF"} 
            />
            <Text style={styles.tiktokActionText}>Me gusta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tiktokActionButton}
            onPress={handleCommentTikTok}
          >
            <Ionicons name="chatbubble" size={32} color="#FFFFFF" />
            <Text style={styles.tiktokActionText}>Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tiktokActionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={32} color="#FFFFFF" />
            <Text style={styles.tiktokActionText}>Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar */}
        <TouchableOpacity 
          style={styles.tiktokCloseButton}
          onPress={() => setShowTikTokModal(false)}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, color: '#666' }}>Cargando vehículo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#666' }}>No se encontró el vehículo</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detalle del vehículo</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleSearchPress}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={handleChatPress}>
            <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Carrusel de imágenes */}
        <View style={styles.imageCarousel}>
          {(() => {
            const firstMedia = getFirstMedia(vehicle);
            
            if (firstMedia.type === 'video') {
              return (
                <TouchableOpacity 
                  style={styles.videoPreviewContainer}
                  onPress={handleVideoPress}
                  activeOpacity={0.9}
                >
                  <Video
                    source={{ uri: firstMedia.uri }}
                    style={styles.videoPreview}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay={true}
                    isMuted={true}
                  />
                  <View style={styles.videoPreviewOverlay}>
                    <View style={styles.playButtonLarge}>
                      <Ionicons name="play" size={40} color="#FFFFFF" />
                    </View>
                    <Text style={styles.videoPreviewText}>Toca para ver en pantalla completa</Text>
                  </View>
                </TouchableOpacity>
              );
            } else if (firstMedia.type === 'image') {
              return (
                <TouchableOpacity 
                  style={styles.videoPreviewContainer}
                  onPress={handleVideoPress}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: firstMedia.uri }}
                    style={styles.videoPreview}
                    resizeMode="cover"
                  />
                  <View style={styles.videoPreviewOverlay}>
                    <View style={styles.playButtonLarge}>
                      <Ionicons name="images" size={40} color="#FFFFFF" />
                    </View>
                    <Text style={styles.videoPreviewText}>Toca para ver en pantalla completa</Text>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="car-sport" size={80} color="#999" />
                  <Text style={styles.imagePlaceholderText}>Sin imágenes disponibles</Text>
                </View>
              );
            }
          })()}
          
          {vehicle.images && vehicle.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {vehicle.images.map((_: any, index: number) => (
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.vehicleYear}>{vehicle.year}</Text>
                <View style={[styles.statusBadge, vehicle.status === 'available' && styles.statusAvailable]}>
                  <Text style={styles.statusText}>{translateStatus(vehicle.status)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio</Text>
              <Text style={styles.price}>{formatCurrency(vehicle.price || 0)}</Text>
            </View>
          </View>

          {/* Stats rápidas */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Ionicons name="speedometer-outline" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{formatKilometers(vehicle.mileage || 0)}</Text>
              <Text style={styles.statLabel}>Kilometraje</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flash-outline" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{translateFuelType(vehicle.fuel || 'N/A')}</Text>
              <Text style={styles.statLabel}>Combustible</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="settings-outline" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{translateTransmission(vehicle.transmission || 'N/A')}</Text>
              <Text style={styles.statLabel}>Transmisión</Text>
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#65676B" />
            <Text style={styles.locationText}>{vehicle.location || 'Ubicación no disponible'}</Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{vehicle.description || 'Sin descripción disponible'}</Text>
        </View>

        {/* Especificaciones técnicas */}
        {vehicle.specifications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especificaciones técnicas</Text>
            <View style={styles.specsGrid}>
              {vehicle.specifications.motor && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Motor:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.motor}</Text>
                </View>
              )}
              {vehicle.specifications.potencia && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Potencia:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.potencia}</Text>
                </View>
              )}
              {vehicle.specifications.cilindrada && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Cilindrada:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.cilindrada}</Text>
                </View>
              )}
              {vehicle.specifications.traccion && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Tracción:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.traccion}</Text>
                </View>
              )}
              {vehicle.specifications.color && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Color:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.color}</Text>
                </View>
              )}
              {vehicle.specifications.puertas && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Puertas:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.puertas}</Text>
                </View>
              )}
              {vehicle.specifications.pasajeros && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Pasajeros:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.pasajeros}</Text>
                </View>
              )}
              {vehicle.specifications.VIN && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>VIN:</Text>
                  <Text style={styles.specValue}>{vehicle.specifications.VIN}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Características */}
        {vehicle.features && vehicle.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.featuresList}>
              {vehicle.features.map((feature: any, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Información del vendedor */}
        {vehicle.seller && (
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
        )}

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

      {/* Modal de Video */}
      {vehicle.videoUrl && (
        <Modal
          visible={showVideoPlayer}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowVideoPlayer(false)}
        >
          <View style={styles.videoModalContainer}>
            <TouchableOpacity 
              style={styles.videoModalClose} 
              onPress={() => setShowVideoPlayer(false)}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Video
              source={{ uri: vehicle.videoUrl }}
              style={styles.videoModalPlayer}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={showVideoPlayer}
              isMuted={false}
              volume={1.0}
              onError={(error) => {
                console.error('Error al reproducir el video:', error);
                Alert.alert('Error', 'No se pudo reproducir el video');
                setShowVideoPlayer(false);
              }}
            />
          </View>
        </Modal>
      )}

      {/* Modal TikTok */}
      {vehicle && vehicle.videoUrl && (
        <Modal
          visible={showTikTokModal}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowTikTokModal(false)}
        >
          <FlatList
            ref={tiktokFlatListRef}
            data={[vehicle]}
            renderItem={renderTikTokItem}
            keyExtractor={(item) => item.id?.toString() || '0'}
            pagingEnabled
            snapToInterval={SCREEN_HEIGHT}
            snapToAlignment="start"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            removeClippedSubviews={true}
            initialScrollIndex={0}
          />
        </Modal>
      )}
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
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  videoPreviewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    position: 'relative',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  videoPreviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  videoPreviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  videoModalPlayer: {
    width: '100%',
    height: 300,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  statusAvailable: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  // Estilos TikTok
  tiktokContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
    backgroundColor: '#000000',
  },
  tiktokVideoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  tiktokVideo: {
    width: '100%',
    height: '100%',
  },
  tiktokPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  tiktokPlaceholderEmoji: {
    fontSize: 120,
    opacity: 0.5,
  },
  tiktokInfoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 80,
    zIndex: 10,
  },
  tiktokUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tiktokAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tiktokUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tiktokCarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tiktokCarPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tiktokCarDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  tiktokDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tiktokDetailText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tiktokStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tiktokStatusText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tiktokActionsContainer: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    zIndex: 10,
    gap: 24,
  },
  tiktokActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiktokActionText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tiktokCloseButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
