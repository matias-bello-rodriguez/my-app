import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
    const router = useRouter();
    const { context } = useLocalSearchParams();
    const carPosition = useRef(new Animated.Value(-100)).current;
    const wheelRotation = useRef(new Animated.Value(0)).current;
    const bounceAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animación del auto moviéndose de izquierda a derecha
        const carMovement = Animated.loop(
            Animated.timing(carPosition, {
                toValue: width + 100,
                duration: 3000,
                useNativeDriver: true,
            })
        );

        // Animación de las ruedas girando
        const wheelSpinning = Animated.loop(
            Animated.timing(wheelRotation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        );

        // Animación de rebote sutil para simular movimiento
        const carBounce = Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnimation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ])
        );

        // Iniciar todas las animaciones
        carMovement.start();
        wheelSpinning.start();
        carBounce.start();

        // Resetear posición del auto cada 3 segundos
        const resetInterval = setInterval(() => {
            carPosition.setValue(-100);
        }, 3000);

        // Simular carga y navegar después de 4 segundos
        const loadingTimeout = setTimeout(() => {
            router.replace('/(tabs)');
        }, 4000);

        return () => {
            carMovement.stop();
            wheelSpinning.stop();
            carBounce.stop();
            clearInterval(resetInterval);
            clearTimeout(loadingTimeout);
        };
    }, [carPosition, wheelRotation, bounceAnimation, router]);

    const wheelRotate = wheelRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const carBounce = bounceAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -3],
    });

    const getLoadingMessage = () => {
        if (context === 'register') {
            return '¡Cuenta creada exitosamente! Bienvenido a AutoBox...';
        }
        return 'Preparando tu experiencia AutoBox...';
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
            <View style={styles.container}>
                {/* Fondo con degradado simulado */}
                <View style={styles.background}>
                    {/* Carretera */}
                    <View style={styles.road}>
                        {/* Líneas de carretera */}
                        <View style={styles.roadLines}>
                            <View style={styles.roadLine} />
                            <View style={styles.roadLine} />
                            <View style={styles.roadLine} />
                            <View style={styles.roadLine} />
                            <View style={styles.roadLine} />
                        </View>

                        {/* Auto animado */}
                        <Animated.View 
                            style={[
                                styles.carContainer,
                                {
                                    transform: [
                                        { translateX: carPosition },
                                        { translateY: carBounce },
                                    ],
                                },
                            ]}
                        >
                            {/* Cuerpo del auto */}
                            <View style={styles.carBody}>
                                <Ionicons name="car-sport" size={60} color="#4CAF50" />
                            </View>
                            
                            {/* Ruedas giratorias */}
                            <View style={styles.wheelsContainer}>
                                <Animated.View 
                                    style={[
                                        styles.wheel,
                                        { transform: [{ rotate: wheelRotate }] }
                                    ]}
                                >
                                    <View style={styles.wheelInner} />
                                </Animated.View>
                                <Animated.View 
                                    style={[
                                        styles.wheel,
                                        { transform: [{ rotate: wheelRotate }] }
                                    ]}
                                >
                                    <View style={styles.wheelInner} />
                                </Animated.View>
                            </View>

                            {/* Efecto de velocidad */}
                            <View style={styles.speedLines}>
                                <View style={styles.speedLine} />
                                <View style={styles.speedLine} />
                                <View style={styles.speedLine} />
                            </View>
                        </Animated.View>
                    </View>

                    {/* Indicador de carga */}
                    <View style={styles.loadingIndicator}>
                        <View style={styles.progressBar}>
                            <Animated.View 
                                style={[
                                    styles.progressFill,
                                    {
                                        transform: [
                                            { 
                                                scaleX: carPosition.interpolate({
                                                    inputRange: [-100, width + 100],
                                                    outputRange: [0, 1],
                                                    extrapolate: 'clamp',
                                                })
                                            }
                                        ],
                                        transformOrigin: 'left',
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.loadingText}>{getLoadingMessage()}</Text>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4CAF50',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    road: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginVertical: 40,
        width: '100%',
    },
    roadLines: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        height: 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    roadLine: {
        width: 30,
        height: 4,
        backgroundColor: '#333333',
        borderRadius: 2,
    },
    carContainer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
    },
    carBody: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    wheelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 50,
        marginTop: -5,
    },
    wheel: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wheelInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#666666',
    },
    speedLines: {
        position: 'absolute',
        left: -30,
        top: 15,
        flexDirection: 'row',
        gap: 5,
    },
    speedLine: {
        width: 15,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 1,
    },
    loadingIndicator: {
        alignItems: 'center',
        marginBottom: 20,
    },
    progressBar: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        marginBottom: 15,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    loadingText: {
        fontSize: 16,
        color: '#E8F5E8',
        textAlign: 'center',
        fontWeight: '300',
    },
});