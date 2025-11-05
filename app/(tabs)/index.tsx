import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
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

    const CarCard = ({ car, showStatus = false, showLocation = false, showInspection = false, showTime = false }: any) => (
        <TouchableOpacity style={styles.carCard}>
            <View style={styles.carImageContainer}>
                <Text style={styles.carEmoji}>{car.image}</Text>
            </View>
            <View style={styles.carInfo}>
                <Text style={styles.carModel}>{car.model}</Text>
                <Text style={styles.carPrice}>{car.price}</Text>
                {showStatus && <Text style={styles.carStatus}>{car.status}</Text>}
                {showLocation && <Text style={styles.carLocation}>📍 {car.location}</Text>}
                {showInspection && <Text style={styles.carInspection}>{car.inspection}</Text>}
                {showTime && <Text style={styles.carTime}>{car.time}</Text>}
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E8" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.userDetails}>
                            <Text style={styles.greeting}>¡Hola, Usuario!</Text>
                            <Text style={styles.balance}>{formatCurrency(userBalance)}</Text>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="notifications-outline" size={20} color="#4CAF50" />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.badgeText}>3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botones principales */}
                <View style={styles.mainButtons}>
                    <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#4CAF50' }]}>
                        <View style={styles.mechanicIcon}>
                            <Ionicons name="person" size={30} color="#FFFFFF" />
                            <View style={styles.mechanicHat}>
                                <Text style={styles.hatText}>🧢</Text>
                            </View>
                        </View>
                        <Text style={styles.mainButtonText}>Solicitar{'\n'}mecánico</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#F44336' }]}>
                        <View style={styles.inspectionIcon}>
                            <Ionicons name="search" size={30} color="#FFFFFF" />
                            <Text style={styles.carIcon}>🚗</Text>
                        </View>
                        <Text style={styles.mainButtonText}>Revisar{'\n'}inspección</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#4CAF50' }]}>
                        <View style={styles.sellIcon}>
                            <Text style={styles.carIcon}>🚗</Text>
                            <Ionicons name="logo-usd" size={20} color="#FFD700" style={styles.dollarSign} />
                        </View>
                        <Text style={styles.mainButtonText}>Vender{'\n'}mi auto</Text>
                    </TouchableOpacity>
                </View>

                {/* Barra de marcas */}
                <View style={styles.brandsSection}>
                    <Text style={styles.sectionTitle}>Marcas populares</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsScroll}>
                        {brands.map((brand, index) => (
                            <TouchableOpacity key={index} style={styles.brandItem}>
                                <Text style={styles.brandLogo}>{brand.logo}</Text>
                                <Text style={styles.brandName}>{brand.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Mis autos en venta */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: '#2196F3' }]}>Mis autos en venta</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {myCars.map((car) => (
                            <CarCard key={car.id} car={car} showStatus={true} />
                        ))}
                        <TouchableOpacity style={styles.addCarCard}>
                            <Ionicons name="add-circle-outline" size={40} color="#4CAF50" />
                            <Text style={styles.addCarText}>Agregar auto</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Mis favoritos */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: '#4CAF50' }]}>Mis favoritos</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {favorites.map((car) => (
                            <CarCard key={car.id} car={car} showLocation={true} />
                        ))}
                    </ScrollView>
                </View>

                {/* Publicados con inspección mecánica */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Publicados con inspección mecánica</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {inspectedCars.map((car) => (
                            <CarCard key={car.id} car={car} showInspection={true} />
                        ))}
                    </ScrollView>
                </View>

                {/* Últimos publicados */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Últimos publicados</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {latestCars.map((car) => (
                            <CarCard key={car.id} car={car} showTime={true} />
                        ))}
                    </ScrollView>
                </View>

                {/* Botón final */}
                <TouchableOpacity style={styles.finalButton}>
                    <View style={styles.finalButtonContent}>
                        <Ionicons name="flash" size={24} color="#FFFFFF" />
                        <Text style={styles.finalButtonText}>Económicos y rendidores</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </View>
                </TouchableOpacity>

                {/* Espacio final */}
                <View style={styles.bottomSpace} />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    avatarText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    userDetails: {
        flex: 1,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    balance: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8F5E8',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderWidth: 2,
        borderColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    notificationBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#FF5722',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    mainButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 30,
        gap: 15,
    },
    mainButton: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    mainButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    mechanicIcon: {
        position: 'relative',
        alignItems: 'center',
    },
    mechanicHat: {
        position: 'absolute',
        top: -10,
        left: 5,
    },
    hatText: {
        fontSize: 16,
    },
    inspectionIcon: {
        position: 'relative',
        alignItems: 'center',
    },
    sellIcon: {
        position: 'relative',
        alignItems: 'center',
    },
    carIcon: {
        fontSize: 24,
        position: 'absolute',
        top: 5,
    },
    dollarSign: {
        position: 'absolute',
        top: -5,
        right: -10,
    },
    brandsSection: {
        paddingVertical: 25,
        backgroundColor: '#FFFFFF',
        marginVertical: 20,
        marginHorizontal: 24,
        borderRadius: 16,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        paddingHorizontal: 24,
        marginBottom: 18,
        letterSpacing: 0.5,
    },
    brandsScroll: {
        paddingLeft: 24,
    },
    brandItem: {
        alignItems: 'center',
        marginRight: 25,
        width: 80,
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    brandLogo: {
        fontSize: 28,
        marginBottom: 8,
    },
    brandName: {
        fontSize: 12,
        color: '#333333',
        textAlign: 'center',
        fontWeight: '600',
    },
    section: {
        paddingVertical: 25,
        backgroundColor: '#FFFFFF',
        marginVertical: 10,
        marginHorizontal: 24,
        borderRadius: 16,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    carCard: {
        width: 220,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginLeft: 24,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E8F5E8',
    },
    carImageContainer: {
        height: 130,
        backgroundColor: '#E8F5E8',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#4CAF50',
    },
    carEmoji: {
        fontSize: 52,
    },
    carInfo: {
        padding: 16,
    },
    carModel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    carPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 6,
    },
    carStatus: {
        fontSize: 13,
        color: '#2196F3',
        fontWeight: '600',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    carLocation: {
        fontSize: 13,
        color: '#666666',
        fontWeight: '500',
    },
    carInspection: {
        fontSize: 13,
        color: '#4CAF50',
        fontWeight: '600',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    carTime: {
        fontSize: 13,
        color: '#666666',
        fontStyle: 'italic',
        fontWeight: '500',
    },
    addCarCard: {
        width: 220,
        height: 200,
        backgroundColor: '#E8F5E8',
        borderRadius: 16,
        marginLeft: 24,
        borderWidth: 3,
        borderColor: '#4CAF50',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    addCarText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    finalButton: {
        marginHorizontal: 24,
        marginVertical: 30,
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    finalButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    finalButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
        letterSpacing: 1,
    },
    bottomSpace: {
        height: 40,
    },
});
