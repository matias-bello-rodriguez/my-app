import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Dimensions,
    FlatList
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import apiService from '../../services/apiService';
import authService from '../../services/authService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Index() {
    const router = useRouter();
    const [userBalance] = useState(1250000); // Saldo del usuario
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [userName, setUserName] = useState('Usuario');
    
    // Estados para los datos de la API
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [myCars, setMyCars] = useState<any[]>([]);
    const [latestCars, setLatestCars] = useState<any[]>([]);
    const [inspectedCars, setInspectedCars] = useState<any[]>([]);
    const [favorites] = useState<any[]>([]); // Por ahora vacío, luego se implementará
    
    // Estados para el modal de video
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
    const [selectedCarInfo, setSelectedCarInfo] = useState<any>(null);
    
    // Estados para el modal TikTok
    const [showTikTokModal, setShowTikTokModal] = useState(false);
    const [tiktokCars, setTiktokCars] = useState<any[]>([]);
    const [currentTikTokIndex, setCurrentTikTokIndex] = useState(0);
    const tiktokFlatListRef = useRef<FlatList>(null);

    // Datos mock para las secciones
    const brands = [
        { 
            name: 'Toyota', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/toyota-1-logo-png-transparent.png'
        },
        { 
            name: 'BMW', 
            logo: 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png'
        },
        { 
            name: 'Mercedes', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/mercedes-benz-6-logo-png-transparent.png'
        },
        { 
            name: 'Honda', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/honda-2-logo-png-transparent.png'
        },
        { 
            name: 'Hyundai', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/hyundai-logo-png-transparent.png'
        },
        { 
            name: 'Nissan', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/nissan-logo-png-transparent.png'
        },
        { 
            name: 'Volkswagen', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/volkswagen-logo-png-transparent.png'
        },
        { 
            name: 'Mazda', 
            logo: 'https://logos-world.net/wp-content/uploads/2020/05/Mazda-Logo.png'
        },
        { 
            name: 'Chevrolet', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/chevrolet-logo-png-transparent.png'
        },
        { 
            name: 'Kia', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/kia-logo-png-transparent.png'
        },
        { 
            name: 'Subaru', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/subaru-logo-png-transparent.png'
        },
        { 
            name: 'Lexus', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/lexus-logo-png-transparent.png'
        },
        { 
            name: 'Peugeot', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/peugeot-2-logo-png-transparent.png'
        },
        { 
            name: 'Renault', 
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/renault-logo-png-transparent.png'
        }
    ];

    // Auto-scroll para las marcas
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isUserScrolling && scrollViewRef.current) {
                const nextIndex = (currentIndex + 1) % brands.length;
                const itemWidth = 84; // ancho del item + margin
                scrollViewRef.current.scrollTo({
                    x: nextIndex * itemWidth,
                    animated: true,
                });
                setCurrentIndex(nextIndex);
            }
        }, 3000); // Cambiar cada 3 segundos

        return () => clearInterval(interval);
    }, [currentIndex, isUserScrolling, brands.length]);

    // Cargar datos del usuario y vehículos
    const loadData = async () => {
        try {
            const user = await authService.getUser();
            if (user) {
                setUserName(user.firstName);
            }

            // Cargar datos en paralelo
            const [myVehicles, latest, inspected] = await Promise.all([
                apiService.getMyVehicles(),
                apiService.getLatestVehicles(),
                apiService.getInspectedVehicles(),
            ]);

            console.log('Mis vehículos:', JSON.stringify(myVehicles, null, 2));
            setMyCars(myVehicles);
            setLatestCars(latest);
            setInspectedCars(inspected);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Recargar datos al hacer pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleBrandPress = (brandName: string) => {
        console.log(`Marca seleccionada: ${brandName}`);
        router.push(`/search?brand=${brandName}`);
    };

    const handleCarPress = (car: any, carsList?: any[]) => {
        console.log(`Auto seleccionado: ${car.id}`);
        console.log('Datos del auto:', JSON.stringify(car, null, 2));
        console.log('videoUrl original:', car.videoUrl);
        console.log('Longitud de videoUrl:', car.videoUrl?.length);
        
        // Si el auto tiene video, mostrar el modal TikTok
        if (car.videoUrl && carsList) {
            console.log('Mostrando modal TikTok');
            const carIndex = carsList.findIndex(c => c.id === car.id);
            setTiktokCars(carsList);
            setCurrentTikTokIndex(carIndex >= 0 ? carIndex : 0);
            setShowTikTokModal(true);
        } else if (car.videoUrl) {
            // Si no hay lista, mostrar solo este video en el modal simple
            console.log('Mostrando video:', car.videoUrl);
            console.log('¿Es URL firmada?', car.videoUrl.includes('X-Amz-Signature'));
            setSelectedVideoUrl(car.videoUrl);
            setSelectedCarInfo(car);
            setShowVideoPlayer(true);
        } else {
            console.log('El auto no tiene video');
            // Si no tiene video, navegar a detalle del vehículo
            // router.push(`/car-detail/${car.id}`);
        }
    };

    const handleChatPress = () => {
        router.push('/(tabs)/chat');
    };

    const handleScrollBegin = () => {
        setIsUserScrolling(true);
    };

    const handleScrollEnd = () => {
        setTimeout(() => {
            setIsUserScrolling(false);
        }, 2000); // Reanudar auto-scroll después de 2 segundos
    };

    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
    };

    const getGreetingMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return `¡Buenos días, ${userName}!`;
        if (hour < 18) return `¡Buenas tardes, ${userName}!`;
        return `¡Buenas noches, ${userName}!`;
    };

    const translateStatus = (status: string) => {
        const translations: { [key: string]: string } = {
            'available': 'Disponible',
            'sold': 'Vendido',
            'inspection_pending': 'Inspección pendiente',
        };
        return translations[status] || status;
    };

    const handleLike = (carId: number) => {
        console.log(`Like en auto: ${carId}`);
    };

    const handleShare = (car: any) => {
        console.log(`Compartir auto: ${car.id}`);
    };

    const handleCommentTikTok = (carId: number) => {
        console.log(`Comentar en auto: ${carId}`);
        setShowTikTokModal(false);
        router.push('/(tabs)/chat');
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
                <TouchableOpacity 
                    style={styles.tiktokVideoContainer}
                    activeOpacity={1}
                >
                    {item.videoUrl ? (
                        <Video
                            source={{ uri: item.videoUrl }}
                            style={styles.tiktokVideo}
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            shouldPlay={isActive}
                            isMuted={false}
                        />
                    ) : item.images && item.images[0] ? (
                        <Image 
                            source={{ uri: item.images[0] }} 
                            style={styles.tiktokVideo}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.tiktokPlaceholder}>
                            <Text style={styles.tiktokPlaceholderEmoji}>🚗</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.tiktokInfoContainer}>
                    <View style={styles.tiktokUserInfo}>
                        <View style={styles.tiktokAvatar}>
                            <Ionicons name="person" size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.tiktokUsername}>@{userName}</Text>
                    </View>
                    
                    <Text style={styles.tiktokCarTitle}>
                        {item.brand} {item.model} {item.year}
                    </Text>
                    
                    <Text style={styles.tiktokCarPrice}>
                        ${Math.floor(item.price).toLocaleString('es-CL')}
                    </Text>
                    
                    <View style={styles.tiktokCarDetails}>
                        <View style={styles.tiktokDetailItem}>
                            <Ionicons name="speedometer" size={14} color="#FFFFFF" />
                            <Text style={styles.tiktokDetailText}>{item.mileage || '0'} km</Text>
                        </View>
                        <View style={styles.tiktokDetailItem}>
                            <Ionicons name="settings" size={14} color="#FFFFFF" />
                            <Text style={styles.tiktokDetailText}>{item.transmission || 'Manual'}</Text>
                        </View>
                        <View style={styles.tiktokDetailItem}>
                            <Ionicons name="location" size={14} color="#FFFFFF" />
                            <Text style={styles.tiktokDetailText}>{item.region || 'Chile'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.tiktokStatusBadge}>
                        <Text style={styles.tiktokStatusText}>
                            {translateStatus(item.status || 'available')}
                        </Text>
                    </View>
                </View>

                <View style={styles.tiktokActionsContainer}>
                    <TouchableOpacity 
                        style={styles.tiktokActionButton}
                        onPress={() => handleLike(item.id)}
                    >
                        <Ionicons name="heart" size={32} color="#FFFFFF" />
                        <Text style={styles.tiktokActionText}>Like</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.tiktokActionButton}
                        onPress={() => handleCommentTikTok(item.id)}
                    >
                        <Ionicons name="chatbubble" size={32} color="#FFFFFF" />
                        <Text style={styles.tiktokActionText}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.tiktokActionButton}
                        onPress={() => handleShare(item)}
                    >
                        <Ionicons name="share-social" size={32} color="#FFFFFF" />
                        <Text style={styles.tiktokActionText}>Compartir</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.tiktokCloseButton}
                    onPress={() => setShowTikTokModal(false)}
                >
                    <Ionicons name="close" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <>
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#4CAF50']}
                    tintColor="#4CAF50"
                />
            }
        >
                {/* Barra de estado del usuario */}
                <View style={styles.userStatusBar}>
                    <View style={styles.userStatusContent}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.statusText}>{getGreetingMessage()}</Text>
                    </View>
                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>Saldo:</Text>
                        <Text style={styles.balanceText}>
                            {showBalance ? formatCurrency(userBalance) : '••••••'}
                        </Text>
                        <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeButton}>
                            <Ionicons 
                                name={showBalance ? "eye" : "eye-off"} 
                                size={18} 
                                color="#65676B" 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cards de servicios estilo Reels */}
                <View style={styles.reelsContainer}>
                    <TouchableOpacity style={[styles.reelCard, { backgroundColor: '#42A5F5' }]} activeOpacity={0.8}>
                        <View style={styles.reelGradient}>
                            <Ionicons name="construct" size={28} color="#FFFFFF" />
                            <Text style={styles.reelTitle}>Solicitar</Text>
                            <Text style={styles.reelSubtitle}>Mecánico</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.reelCard, { backgroundColor: '#66BB6A' }]} activeOpacity={0.8}>
                        <View style={styles.reelGradient}>
                            <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
                            <Text style={styles.reelTitle}>Revisar</Text>
                            <Text style={styles.reelSubtitle}>Inspección</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.reelCard, { backgroundColor: '#8E8E93' }]} activeOpacity={0.8}>
                        <View style={styles.reelGradient}>
                            <Ionicons name="car-sport" size={28} color="#FFFFFF" />
                            <Text style={styles.reelTitle}>Vender</Text>
                            <Text style={styles.reelSubtitle}>Mi Auto</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Navegación rápida */}
                <View style={styles.quickNav}>
                    <ScrollView 
                        ref={scrollViewRef}
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.quickNavScroll}
                        onScrollBeginDrag={handleScrollBegin}
                        onScrollEndDrag={handleScrollEnd}
                        onMomentumScrollEnd={handleScrollEnd}
                        decelerationRate="fast"
                    >
                        {brands.map((brand, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.quickNavItem}
                                onPress={() => handleBrandPress(brand.name)}
                                activeOpacity={0.7}
                            >
                                <Image 
                                    source={{ uri: brand.logo }} 
                                    style={styles.brandLogo}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Posts estilo feed */}
                {/* Mis autos en venta */}
                {myCars.length > 0 && (
                    <View style={styles.feedPost}>
                        <View style={styles.postHeader}>
                            <View style={styles.postUserInfo}>
                                <View style={styles.postAvatar}>
                                    <Ionicons name="person" size={16} color="#FFFFFF" />
                                </View>
                                <View>
                                    <Text style={styles.postUserName}>Mis autos en venta</Text>
                                    <Text style={styles.postTime}>{myCars.length} vehículo{myCars.length > 1 ? 's' : ''}</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedCarousel}>
                            {myCars.map((car) => (
                                <TouchableOpacity 
                                    key={car.id} 
                                    style={styles.reelsVideoCard}
                                    onPress={() => handleCarPress(car, myCars)}
                                >
                                    <View style={styles.videoBackground}>
                                        {car.videoUrl ? (
                                            <Video
                                                source={{ uri: car.videoUrl }}
                                                style={styles.carVideo}
                                                resizeMode={ResizeMode.COVER}
                                                isLooping
                                                shouldPlay={true}
                                                isMuted={true}
                                            />
                                        ) : car.images && car.images[0] ? (
                                            <Image 
                                                source={{ uri: car.images[0] }} 
                                                style={styles.carImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Text style={styles.videoEmoji}>🚗</Text>
                                        )}
                                        {car.videoUrl && (
                                            <View style={styles.playIconOverlay}>
                                                <Ionicons name="play-circle" size={64} color="rgba(255, 255, 255, 0.9)" />
                                            </View>
                                        )}
                                        <View style={styles.videoOverlay}>
                                            <View style={styles.videoInfo}>
                                                <Text style={styles.videoModel}>{car.brand} {car.model} {car.year}</Text>
                                                <Text style={styles.videoPrice}>${Math.floor(car.price).toLocaleString('es-CL')}</Text>
                                                <View style={styles.videoStatus}>
                                                    <Text style={styles.videoStatusText}>
                                                        {translateStatus(car.status || 'available')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity 
                                style={styles.addCarReelsCard}
                                onPress={() => router.push('/publish')}
                            >
                                <View style={styles.addVideoBackground}>
                                    <Ionicons name="add" size={40} color="#4CAF50" />
                                    <Text style={styles.addVideoText}>Vender Auto</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                        <View style={styles.postActions}>
                            <TouchableOpacity style={styles.postAction}>
                                <Ionicons name="share-outline" size={20} color="#65676B" />
                                <Text style={styles.postActionText}>Compartir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Favoritos */}
                {favorites.length > 0 && (
                    <View style={styles.feedPost}>
                    <View style={styles.postHeader}>
                        <View style={styles.postUserInfo}>
                            <View style={[styles.postAvatar, { backgroundColor: '#F44336' }]}>
                                <Ionicons name="heart" size={16} color="#FFFFFF" />
                            </View>
                            <View>
                                <Text style={styles.postUserName}>Mis favoritos</Text>
                                <Text style={styles.postTime}>Actualizados</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedCarousel}>
                        {favorites.map((car) => (
                            <TouchableOpacity key={car.id} style={styles.reelsVideoCard}>
                                <View style={styles.videoBackground}>
                                    <Text style={styles.videoEmoji}>{car.image}</Text>
                                    <View style={styles.videoOverlay}>
                                        <View style={styles.videoInfo}>
                                            <Text style={styles.videoModel}>{car.model}</Text>
                                            <Text style={styles.videoPrice}>{car.price}</Text>
                                            <View style={styles.videoStatus}>
                                                <Text style={[styles.videoStatusText, { backgroundColor: 'rgba(244, 67, 54, 0.8)' }]}>📍 {car.location}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="share-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                )}

                {/* Inspecciones mecánicas */}
                {inspectedCars.length > 0 && (
                    <View style={styles.feedPost}>
                    <View style={styles.postHeader}>
                        <View style={styles.postUserInfo}>
                            <View style={[styles.postAvatar, { backgroundColor: '#2196F3' }]}>
                                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                            </View>
                            <View>
                                <Text style={styles.postUserName}>Autos con inspección mecánica</Text>
                                <Text style={styles.postTime}>Verificados ✅</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedCarousel}>
                        {inspectedCars.map((car) => (
                            <TouchableOpacity key={car.id} style={styles.reelsVideoCard}>
                                <View style={styles.videoBackground}>
                                    <Text style={styles.videoEmoji}>{car.image}</Text>
                                    <View style={styles.videoOverlay}>
                                        <View style={styles.videoInfo}>
                                            <Text style={styles.videoModel}>{car.model}</Text>
                                            <Text style={styles.videoPrice}>{car.price}</Text>
                                            <View style={styles.videoStatus}>
                                                <Text style={[styles.videoStatusText, { backgroundColor: 'rgba(76, 175, 80, 0.8)' }]}>{car.inspection}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="share-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                )}

                {/* Últimos publicados */}
                {latestCars.length > 0 && (
                    <View style={styles.feedPost}>
                    <View style={styles.postHeader}>
                        <View style={styles.postUserInfo}>
                            <View style={[styles.postAvatar, { backgroundColor: '#FF9800' }]}>
                                <Ionicons name="time" size={16} color="#FFFFFF" />
                            </View>
                            <View>
                                <Text style={styles.postUserName}>Últimos publicados</Text>
                                <Text style={styles.postTime}>Recién agregados</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedCarousel}>
                        {latestCars.map((car) => (
                            <TouchableOpacity 
                                key={car.id} 
                                style={styles.reelsVideoCard}
                                onPress={() => handleCarPress(car, latestCars)}
                            >
                                <View style={styles.videoBackground}>
                                    {car.videoUrl ? (
                                        <Video
                                            source={{ uri: car.videoUrl }}
                                            style={styles.carVideo}
                                            resizeMode={ResizeMode.COVER}
                                            isLooping
                                            shouldPlay={true}
                                            isMuted={true}
                                        />
                                    ) : car.images && car.images[0] ? (
                                        <Image 
                                            source={{ uri: car.images[0] }} 
                                            style={styles.carImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Text style={styles.videoEmoji}>🚗</Text>
                                    )}
                                    {car.videoUrl && (
                                        <View style={styles.playIconOverlay}>
                                            <Ionicons name="play-circle" size={64} color="rgba(255, 255, 255, 0.9)" />
                                        </View>
                                    )}
                                    <View style={styles.videoOverlay}>
                                        <View style={styles.videoInfo}>
                                            <Text style={styles.videoModel}>{car.brand} {car.model} {car.year}</Text>
                                            <Text style={styles.videoPrice}>${Math.floor(car.price).toLocaleString('es-CL')}</Text>
                                            <View style={styles.videoStatus}>
                                                <Text style={[styles.videoStatusText, { backgroundColor: 'rgba(255, 152, 0, 0.8)' }]}>
                                                    {translateStatus(car.status || 'available')}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="share-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                )}

                {/* Espaciado final */}
                <View style={styles.bottomSpace} />
            </ScrollView>
            
            {/* Modal TikTok */}
            <Modal
                visible={showTikTokModal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setShowTikTokModal(false)}
            >
                <View style={{ flex: 1, backgroundColor: '#000000' }}>
                    <FlatList
                        ref={tiktokFlatListRef}
                        data={tiktokCars}
                        renderItem={renderTikTokItem}
                        keyExtractor={(item) => item.id.toString()}
                        pagingEnabled
                        showsVerticalScrollIndicator={false}
                        snapToInterval={SCREEN_HEIGHT}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        initialScrollIndex={currentTikTokIndex}
                        getItemLayout={(data, index) => ({
                            length: SCREEN_HEIGHT,
                            offset: SCREEN_HEIGHT * index,
                            index,
                        })}
                    />
                </View>
            </Modal>
            
            {/* Modal para reproducir video */}
            <Modal
                visible={showVideoPlayer && !!selectedVideoUrl}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowVideoPlayer(false)}
            >
                <View style={styles.videoPlayerModal}>
                    <View style={styles.videoPlayerContainer}>
                        <View style={styles.videoPlayerHeader}>
                            <View>
                                <Text style={styles.videoPlayerTitle}>
                                    {selectedCarInfo ? `${selectedCarInfo.brand} ${selectedCarInfo.model} ${selectedCarInfo.year}` : 'Video del vehículo'}
                                </Text>
                                {selectedCarInfo && (
                                    <Text style={styles.videoPlayerPrice}>
                                        ${Math.floor(selectedCarInfo.price).toLocaleString('es-CL')}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => setShowVideoPlayer(false)}>
                                <Ionicons name="close" size={28} color="#1C1E21" />
                            </TouchableOpacity>
                        </View>
                        <Video
                            source={{ uri: selectedVideoUrl }}
                            style={styles.video}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            onError={(error) => {
                                console.error('Error al reproducir video:', error);
                            }}
                            onLoad={() => {
                                console.log('Video cargado correctamente');
                            }}
                            onLoadStart={() => {
                                console.log('Iniciando carga del video...');
                            }}
                        />
                        <TouchableOpacity
                            style={styles.closeVideoButton}
                            onPress={() => setShowVideoPlayer(false)}
                        >
                            <Text style={styles.closeVideoButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    userStatusBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E6EA',
    },
    userStatusContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    statusText: {
        fontSize: 16,
        color: '#65676B',
        flex: 1,
    },
    balanceText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginRight: 8,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 12,
        color: '#65676B',
        marginRight: 4,
    },
    eyeButton: {
        padding: 4,
        marginLeft: 4,
    },
    quickNav: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E6EA',
    },
    quickNavScroll: {
        paddingHorizontal: 16,
    },
    quickNavItem: {
        alignItems: 'center',
        marginRight: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: 64, // Ancho fijo para el cálculo del auto-scroll
    },
    brandLogo: {
        width: 48,
        height: 48,
        marginBottom: 8,
    },
    quickNavText: {
        fontSize: 12,
        color: '#65676B',
        fontWeight: '500',
    },
    feedPost: {
        backgroundColor: '#FFFFFF',
        marginVertical: 4,
        borderRadius: 0,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    postUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    postUserName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1E21',
    },
    postTime: {
        fontSize: 13,
        color: '#65676B',
        marginTop: 2,
    },
    feedCarousel: {
        paddingLeft: 16,
        paddingBottom: 12,
    },
    feedCarCard: {
        width: 160,
        backgroundColor: '#F0F2F5',
        borderRadius: 12,
        marginRight: 12,
        padding: 12,
        alignItems: 'center',
    },
    feedCarEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    feedCarModel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1E21',
        textAlign: 'center',
        marginBottom: 4,
    },
    feedCarPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    feedCarStatus: {
        fontSize: 12,
        color: '#2196F3',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    feedCarLocation: {
        fontSize: 12,
        color: '#65676B',
    },
    feedCarInspection: {
        fontSize: 12,
        color: '#4CAF50',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    feedCarTime: {
        fontSize: 12,
        color: '#65676B',
        fontStyle: 'italic',
    },
    addCarFeedCard: {
        width: 160,
        backgroundColor: '#F0F2F5',
        borderRadius: 12,
        marginRight: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderStyle: 'dashed',
        height: 140,
    },
    addCarFeedText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
        marginTop: 8,
    },
    postActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#E4E6EA',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    postAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
    },
    postActionText: {
        fontSize: 14,
        color: '#65676B',
        fontWeight: '600',
        marginLeft: 6,
    },
    bottomSpace: {
        height: 20,
    },
    reelsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E6EA',
    },
    reelCard: {
        flex: 1,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    reelGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
        position: 'relative',
    },
    reelTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 6,
        textAlign: 'center',
    },
    reelSubtitle: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.85,
        textAlign: 'center',
        marginTop: 1,
        fontWeight: '400',
    },
    // Estilos para Reels de video
    reelsVideoCard: {
        width: 200,
        height: 320,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#000000',
    },
    videoBackground: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoEmoji: {
        fontSize: 80,
        position: 'absolute',
        top: '35%',
        opacity: 0.7,
    },
    videoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        padding: 16,
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoInfo: {
        marginTop: 'auto',
        marginBottom: 8,
    },
    videoModel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    videoPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    videoStatus: {
        alignSelf: 'flex-start',
    },
    videoStatusText: {
        fontSize: 11,
        color: '#FFFFFF',
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        fontWeight: '600',
    },
    videoActions: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -40 }],
        alignItems: 'center',
    },
    videoActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    addCarReelsCard: {
        width: 200,
        height: 320,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F0F2F5',
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderStyle: 'dashed',
    },
    addVideoBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    addVideoText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#65676B',
    },
    carImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    carVideo: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    playIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    videoPlayerModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlayerContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
    },
    videoPlayerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    videoPlayerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1E21',
    },
    videoPlayerPrice: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
        marginTop: 4,
    },
    video: {
        flex: 1,
        width: '100%',
    },
    closeVideoButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeVideoButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
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
