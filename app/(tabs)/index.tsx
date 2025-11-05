import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Index() {
    const [userBalance] = useState(1250000); // Saldo del usuario

    // Datos mock para las secciones
    const brands = [
        { name: 'Mazda', logo: '🚗' },
        { name: 'Hyundai', logo: '🚙' },
        { name: 'Nissan', logo: '🚕' },
        { name: 'Ford', logo: '🚐' },
        { name: 'Toyota', logo: '🚗' },
        { name: 'Chevrolet', logo: '🚙' },
        { name: 'Honda', logo: '🚕' },
        { name: 'BMW', logo: '🚗' }
    ];

    const myCars = [
        { id: 1, model: 'Mazda 3 2020', price: '$12.500.000', image: '🚗', status: 'En venta' },
        { id: 2, model: 'Toyota Corolla 2019', price: '$11.200.000', image: '🚙', status: 'En venta' }
    ];

    const favorites = [
        { id: 1, model: 'Honda Civic 2021', price: '$15.800.000', image: '🚗', location: 'Santiago' },
        { id: 2, model: 'Nissan Sentra 2020', price: '$13.500.000', image: '🚕', location: 'Valparaíso' }
    ];

    const inspectedCars = [
        { id: 1, model: 'Ford Focus 2018', price: '$9.800.000', image: '🚐', inspection: '✅ Aprobada' },
        { id: 2, model: 'Hyundai Elantra 2019', price: '$11.500.000', image: '🚙', inspection: '✅ Aprobada' }
    ];

    const latestCars = [
        { id: 1, model: 'BMW Serie 3 2020', price: '$22.500.000', image: '🚗', time: 'Hace 2 horas' },
        { id: 2, model: 'Chevrolet Spark 2021', price: '$8.900.000', image: '🚙', time: 'Hace 4 horas' }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Barra de estado del usuario */}
                <View style={styles.userStatusBar}>
                    <View style={styles.userStatusContent}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.statusText}>¿Qué auto estás buscando hoy?</Text>
                    </View>
                    <Text style={styles.balanceText}>{formatCurrency(userBalance)}</Text>
                </View>

                {/* Navegación rápida */}
                <View style={styles.quickNav}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickNavScroll}>
                        {brands.map((brand, index) => (
                            <TouchableOpacity key={index} style={styles.quickNavItem}>
                                <Text style={styles.quickNavEmoji}>{brand.logo}</Text>
                                <Text style={styles.quickNavText}>{brand.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Posts estilo feed */}
                {/* Mis autos en venta */}
                <View style={styles.feedPost}>
                    <View style={styles.postHeader}>
                        <View style={styles.postUserInfo}>
                            <View style={styles.postAvatar}>
                                <Ionicons name="person" size={16} color="#FFFFFF" />
                            </View>
                            <View>
                                <Text style={styles.postUserName}>Mis autos en venta</Text>
                                <Text style={styles.postTime}>Hace 5 minutos</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedCarousel}>
                        {myCars.map((car) => (
                            <TouchableOpacity key={car.id} style={styles.feedCarCard}>
                                <Text style={styles.feedCarEmoji}>{car.image}</Text>
                                <Text style={styles.feedCarModel}>{car.model}</Text>
                                <Text style={styles.feedCarPrice}>{car.price}</Text>
                                <Text style={styles.feedCarStatus}>{car.status}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.addCarFeedCard}>
                            <Ionicons name="add" size={30} color="#4CAF50" />
                            <Text style={styles.addCarFeedText}>Agregar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="heart-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Me gusta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Comentar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="share-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Favoritos */}
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
                            <TouchableOpacity key={car.id} style={styles.feedCarCard}>
                                <Text style={styles.feedCarEmoji}>{car.image}</Text>
                                <Text style={styles.feedCarModel}>{car.model}</Text>
                                <Text style={styles.feedCarPrice}>{car.price}</Text>
                                <Text style={styles.feedCarLocation}>📍 {car.location}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="heart" size={20} color="#F44336" />
                            <Text style={[styles.postActionText, { color: '#F44336' }]}>Me gusta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Comentar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="share-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Inspecciones mecánicas */}
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
                            <TouchableOpacity key={car.id} style={styles.feedCarCard}>
                                <Text style={styles.feedCarEmoji}>{car.image}</Text>
                                <Text style={styles.feedCarModel}>{car.model}</Text>
                                <Text style={styles.feedCarPrice}>{car.price}</Text>
                                <Text style={styles.feedCarInspection}>{car.inspection}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="heart-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Me gusta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Comentar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="share-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Últimos publicados */}
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
                            <TouchableOpacity key={car.id} style={styles.feedCarCard}>
                                <Text style={styles.feedCarEmoji}>{car.image}</Text>
                                <Text style={styles.feedCarModel}>{car.model}</Text>
                                <Text style={styles.feedCarPrice}>{car.price}</Text>
                                <Text style={styles.feedCarTime}>{car.time}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="heart-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Me gusta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Comentar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}>
                            <Ionicons name="share-outline" size={20} color="#65676B" />
                            <Text style={styles.postActionText}>Compartir</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
    },
    quickNavEmoji: {
        fontSize: 24,
        marginBottom: 4,
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
});
