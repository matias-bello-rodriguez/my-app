import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import authService from '../services/authService';
import locationService, { Region, Comuna } from '../services/locationService';
import DateTimePicker from '../components/DateTimePicker';
import SelectPicker from '../components/SelectPicker';

export default function RegisterScreen(){
    const [currentStep, setCurrentStep] = useState(1);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [rut, setRut] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Estados para regiones y comunas
    const [regiones, setRegiones] = useState<Region[]>([]);
    const [comunas, setComunas] = useState<Comuna[]>([]);
    const [comunasFiltradas, setComunasFiltradas] = useState<Comuna[]>([]);
    const [loadingRegiones, setLoadingRegiones] = useState(false);
    const [loadingComunas, setLoadingComunas] = useState(false);

    // Cargar regiones al montar el componente
    useEffect(() => {
        loadRegiones();
        loadComunas();
    }, []);

    // Filtrar comunas cuando cambia la región
    useEffect(() => {
        if (region && comunas.length > 0) {
            const regionObj = regiones.find(r => r.name === region);
            console.log('Región seleccionada:', region, 'Código:', regionObj?.number);
            if (regionObj) {
                const filtered = comunas.filter(c => c.regionCode === regionObj.number);
                console.log('Comunas filtradas:', filtered.length);
                // Ordenar alfabéticamente
                const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
                setComunasFiltradas(sorted);
            }
        } else {
            setComunasFiltradas([]);
        }
        // Limpiar comuna si cambia la región
        if (region) {
            setComuna('');
        }
    }, [region, comunas, regiones]);

    const loadRegiones = async () => {
        setLoadingRegiones(true);
        try {
            const data = await locationService.getRegiones();
            console.log('Regiones cargadas:', data.length);
            setRegiones(data);
        } catch (error) {
            console.error('Error al cargar regiones:', error);
        } finally {
            setLoadingRegiones(false);
        }
    };

    const loadComunas = async () => {
        setLoadingComunas(true);
        try {
            const data = await locationService.getComunas();
            console.log('Comunas cargadas:', data.length);
            setComunas(data);
        } catch (error) {
            console.error('Error al cargar comunas:', error);
        } finally {
            setLoadingComunas(false);
        }
    };

    // Función para capitalizar cada palabra y filtrar caracteres especiales
    const formatName = (text: string): string => {
        // Permitir solo letras, espacios y tildes
        const filtered = text.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, '');
        
        // Capitalizar la primera letra de cada palabra
        return filtered
            .split(' ')
            .map(word => {
                if (word.length === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
    };

    // Manejadores para nombre y apellido con formato
    const handleNameChange = (text: string) => {
        setName(formatName(text));
    };

    const handleLastNameChange = (text: string) => {
        setLastName(formatName(text));
    };

    // Función para formatear el RUT con puntos y guión
    const formatRut = (text: string): string => {
        // Eliminar puntos y guiones previos para procesar el texto limpio
        let cleaned = text.replace(/\./g, '').replace(/-/g, '');
        
        // Separar números de la letra K
        const numbers = cleaned.replace(/[^0-9]/g, '');
        const hasK = /[kK]/.test(cleaned);
        
        if (numbers.length === 0) return '';
        
        // Si solo hay números sin K, no formatear hasta que haya más de un dígito
        if (!hasK && numbers.length === 1) return numbers;
        
        // Determinar el cuerpo y el dígito verificador
        let body = '';
        let dv = '';
        
        if (hasK) {
            // Si tiene K, el cuerpo son todos los números y el dv es K
            body = numbers;
            dv = 'K';
        } else {
            // Si no tiene K, separar el último número como dv
            body = numbers.slice(0, -1);
            dv = numbers.slice(-1);
        }
        
        if (body.length === 0) return dv;
        
        // Formatear el cuerpo con puntos (cada 3 dígitos de derecha a izquierda)
        const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // Retornar con guión antes del dígito verificador
        return `${formattedBody}-${dv}`;
    };

    // Manejador para el RUT
    const handleRutChange = (text: string) => {
        // Solo permitir números y K/k
        const filtered = text.replace(/[^0-9kK]/g, '');
        
        // Contar cuántas K hay
        const kCount = (filtered.match(/[kK]/g) || []).length;
        
        // Si hay más de una K, no permitir
        if (kCount > 1) return;
        
        // Si hay una K, verificar que esté al final
        if (kCount === 1) {
            const kIndex = filtered.search(/[kK]/);
            // Si la K no está al final, no permitir
            if (kIndex !== filtered.length - 1) return;
        }
        
        setRut(formatRut(filtered));
    };

    // Función para limpiar el RUT (sin puntos ni guión)
    const cleanRut = (rut: string): string => {
        return rut.replace(/\./g, '').replace(/-/g, '');
    };

    const handleRegister = async () => {
        if (loading) return;

        setLoading(true);
        try {
            await authService.register({
                firstName: name,
                lastName,
                rut: cleanRut(rut), // Enviar RUT sin puntos ni guión
                email,
                password,
            });

            // Navegar a loading después de crear la cuenta con contexto
            router.replace('/loading?context=register');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    const goToLogin = () => {
        router.push('/auth');
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepIndicator = () => {
        return (
            <View style={styles.stepIndicator}>
                {[1, 2, 3].map((step, index) => (
                    <View key={step} style={styles.stepRow}>
                        <View style={styles.stepContainer}>
                            <View style={[
                                styles.stepCircle, 
                                currentStep >= step ? styles.stepCircleActive : styles.stepCircleInactive
                            ]}>
                                <Text style={[
                                    styles.stepText,
                                    currentStep >= step ? styles.stepTextActive : styles.stepTextInactive
                                ]}>
                                    {step}
                                </Text>
                            </View>
                        </View>
                        {index < 2 && (
                            <View style={[
                                styles.stepLine,
                                currentStep > step ? styles.stepLineActive : styles.stepLineInactive
                            ]} />
                        )}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E8" />
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                            {/* Header con logo */}
                            <View style={styles.headerContainer}>
                                <View style={styles.logoContainer}>
                                    <Image 
                                        source={require('../assets/images/logo.jpeg')} 
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>

                            {/* Indicador de pasos */}
                            {renderStepIndicator()}

                            {/* Formulario por pasos */}
                            <View style={styles.formContainer}>
                                <Text style={styles.welcomeText}>¡Únete a AutoBox!</Text>
                                
                                {/* Paso 1: Información Personal */}
                                {currentStep === 1 && (
                                    <View style={styles.stepContent}>
                                        <Text style={styles.sectionTitle}>Información Personal</Text>
                                        
                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="person-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={name}
                                                    onChangeText={handleNameChange}
                                                    placeholder="Nombre"
                                                    placeholderTextColor="#999999"
                                                    autoCapitalize="words"
                                                    autoComplete="given-name"
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="person-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={lastName}
                                                    onChangeText={handleLastNameChange}
                                                    placeholder="Apellido"
                                                    placeholderTextColor="#999999"
                                                    autoCapitalize="words"
                                                    autoComplete="family-name"
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="card-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={rut}
                                                    onChangeText={handleRutChange}
                                                    placeholder="RUT (12.345.678-9)"
                                                    placeholderTextColor="#999999"
                                                    keyboardType="default"
                                                    autoCapitalize="characters"
                                                    maxLength={12}
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <DateTimePicker
                                                label=""
                                                value={birthDate}
                                                onChange={setBirthDate}
                                                mode="date"
                                                placeholder="Fecha de nacimiento (DD/MM/AAAA)"
                                            />
                                        </View>

                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity style={styles.nextButtonFull} onPress={nextStep}>
                                                <Text style={styles.nextButtonText}>SIGUIENTE</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {/* Paso 2: Ubicación */}
                                {currentStep === 2 && (
                                    <View style={styles.stepContent}>
                                        <Text style={styles.sectionTitle}>Ubicación</Text>

                                        <View style={styles.inputContainer}>
                                            <SelectPicker
                                                label=""
                                                value={region}
                                                onChange={setRegion}
                                                options={regiones.map(r => ({
                                                    label: r.name,
                                                    value: r.name
                                                }))}
                                                placeholder="Selecciona tu región"
                                                icon="location-outline"
                                                loading={loadingRegiones}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <SelectPicker
                                                label=""
                                                value={comuna}
                                                onChange={setComuna}
                                                options={comunasFiltradas.map(c => ({
                                                    label: c.name,
                                                    value: c.name
                                                }))}
                                                placeholder={region ? "Selecciona tu comuna" : "Primero selecciona una región"}
                                                icon="business-outline"
                                                disabled={!region}
                                                loading={loadingComunas}
                                            />
                                        </View>

                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                                                <Text style={styles.backButtonText}>ATRÁS</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                                                <Text style={styles.nextButtonText}>SIGUIENTE</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {/* Paso 3: Credenciales de Acceso */}
                                {currentStep === 3 && (
                                    <View style={styles.stepContent}>
                                        <Text style={styles.sectionTitle}>Credenciales de Acceso</Text>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="mail-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={email}
                                                    onChangeText={setEmail}
                                                    placeholder="Correo electrónico"
                                                    placeholderTextColor="#999999"
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                    autoComplete="email"
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    placeholder="Contraseña"
                                                    placeholderTextColor="#999999"
                                                    secureTextEntry={!showPassword}
                                                    autoComplete="password"
                                                    returnKeyType="next"
                                                />
                                                <TouchableOpacity 
                                                    onPress={() => setShowPassword(!showPassword)}
                                                    style={styles.eyeIcon}
                                                >
                                                    <Ionicons 
                                                        name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                                        size={20} 
                                                        color="#666666" 
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={confirmPassword}
                                                    onChangeText={setConfirmPassword}
                                                    placeholder="Confirmar contraseña"
                                                    placeholderTextColor="#999999"
                                                    secureTextEntry={!showConfirmPassword}
                                                    autoComplete="password"
                                                    returnKeyType="done"
                                                    onSubmitEditing={handleRegister}
                                                />
                                                <TouchableOpacity 
                                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    style={styles.eyeIcon}
                                                >
                                                    <Ionicons 
                                                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                                        size={20} 
                                                        color="#666666" 
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                                                <Text style={styles.backButtonText}>ATRÁS</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                                                <Text style={styles.registerButtonText}>REGISTRARME</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Footer */}
                            <TouchableOpacity 
                                style={styles.footer} 
                                onPress={goToLogin}
                            >
                                <Ionicons name="arrow-back" size={20} color="#4CAF50" />
                                <Text style={styles.loginText}> ¿Ya tienes cuenta? Inicia sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E8', // Verde muy claro opaco
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: '100%',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
        justifyContent: 'space-between',
        minHeight: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        flex: 0.12,
        justifyContent: 'center',
        marginBottom: 10,
    },
    logoContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1.5,
        borderColor: '#4CAF50',
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
    },
    formContainer: {
        flex: 0.75,
        justifyContent: 'flex-start',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4CAF50',
        marginTop: 15,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50',
        paddingLeft: 12,
    },
    inputContainer: {
        marginBottom: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4CAF50',
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        height: 56,
    },
    eyeIcon: {
        padding: 8,
    },
    registerButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 25,
        alignItems: 'center',
        flex: 1,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 0.2,
    },
    footerText: {
        color: '#666666',
        fontSize: 14,
    },
    loginText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
    },
    // Estilos para indicador de pasos
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircle: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    stepCircleActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    stepCircleInactive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
    },
    stepText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    stepTextActive: {
        color: '#FFFFFF',
    },
    stepTextInactive: {
        color: '#CCCCCC',
    },
    stepLine: {
        height: 3,
        width: 50,
        marginHorizontal: 8,
        borderRadius: 1.5,
    },
    stepLineActive: {
        backgroundColor: '#4CAF50',
    },
    stepLineInactive: {
        backgroundColor: '#CCCCCC',
    },
    // Estilos para contenido de pasos
    stepContent: {
        flex: 1,
    },
    // Estilos para botones de navegación
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        gap: 15,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 25,
        alignItems: 'center',
        flex: 1,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    nextButtonFull: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 25,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    backButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 25,
        alignItems: 'center',
        flex: 1,
        borderWidth: 2,
        borderColor: '#4CAF50',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    backButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});