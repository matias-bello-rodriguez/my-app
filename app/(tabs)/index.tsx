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
    View
} from 'react-native';
import apiService from '../../services/apiService';
import authService from '../../services/authService';

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

    const handleCarPress = (carId: string) => {
        console.log(`Auto seleccionado: ${carId}`);
        // Navegar a detalle del vehículo
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

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
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
                                    onPress={() => handleCarPress(car.id)}
                                >
                                    <View style={styles.videoBackground}>
                                        {car.images && car.images[0] ? (
                                            <Image 
                                                source={{ uri: car.images[0] }} 
                                                style={styles.carImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Text style={styles.videoEmoji}>🚗</Text>
                                        )}
                                        <View style={styles.videoOverlay}>
                                            <View style={styles.videoInfo}>
                                                <Text style={styles.videoModel}>{car.brand} {car.model} {car.year}</Text>
                                                <Text style={styles.videoPrice}>{formatCurrency(car.price)}</Text>
                                                <View style={styles.videoStatus}>
                                                    <Text style={styles.videoStatusText}>
                                                        {car.status || 'En venta'}
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
                            <TouchableOpacity key={car.id} style={styles.reelsVideoCard}>
                                <View style={styles.videoBackground}>
                                    <Text style={styles.videoEmoji}>{car.image}</Text>
                                    <View style={styles.videoOverlay}>
                                        <View style={styles.videoInfo}>
                                            <Text style={styles.videoModel}>{car.model}</Text>
                                            <Text style={styles.videoPrice}>{car.price}</Text>
                                            <View style={styles.videoStatus}>
                                                <Text style={[styles.videoStatusText, { backgroundColor: 'rgba(255, 152, 0, 0.8)' }]}>{car.time}</Text>
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
        width: 120,
        height: 200,
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
        fontSize: 60,
        position: 'absolute',
        top: '30%',
        opacity: 0.7,
    },
    videoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        padding: 12,
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
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    videoPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    videoStatus: {
        alignSelf: 'flex-start',
    },
    videoStatusText: {
        fontSize: 10,
        color: '#FFFFFF',
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
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
        width: 120,
        height: 200,
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
        fontSize: 12,
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
});
