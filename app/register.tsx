import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
    const router = useRouter();

    const handleRegister = () => {
        // Aquí iría la lógica de registro
        console.log('Register attempt:', { name, lastName, rut, birthDate, region, comuna, email, password, confirmPassword });
        router.replace('/(tabs)');
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
                {[1, 2, 3].map((step) => (
                    <View key={step} style={styles.stepContainer}>
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
                        {step < 3 && (
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
                                                    onChangeText={setName}
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
                                                    onChangeText={setLastName}
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
                                                    onChangeText={setRut}
                                                    placeholder="RUT (12345678-9)"
                                                    placeholderTextColor="#999999"
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="calendar-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={birthDate}
                                                    onChangeText={setBirthDate}
                                                    placeholder="Fecha de nacimiento (DD/MM/AAAA)"
                                                    placeholderTextColor="#999999"
                                                    returnKeyType="done"
                                                    onSubmitEditing={nextStep}
                                                />
                                            </View>
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
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="location-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={region}
                                                    onChangeText={setRegion}
                                                    placeholder="Región"
                                                    placeholderTextColor="#999999"
                                                    autoCapitalize="words"
                                                    returnKeyType="next"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.inputWrapper}>
                                                <Ionicons name="business-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={comuna}
                                                    onChangeText={setComuna}
                                                    placeholder="Comuna"
                                                    placeholderTextColor="#999999"
                                                    autoCapitalize="words"
                                                    returnKeyType="done"
                                                    onSubmitEditing={nextStep}
                                                />
                                            </View>
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
                                                <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                                <TouchableOpacity onPress={goToLogin}>
                                    <Text style={styles.loginText}>Inicia sesión</Text>
                                </TouchableOpacity>
                            </View>
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
        alignItems: 'center',
        flex: 0.13,
        paddingTop: 10,
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
    stepContainer: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircleActive: {
        backgroundColor: '#4CAF50',
    },
    stepCircleInactive: {
        backgroundColor: '#CCCCCC',
    },
    stepText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepTextActive: {
        color: '#FFFFFF',
    },
    stepTextInactive: {
        color: '#666666',
    },
    stepLine: {
        height: 2,
        width: 40,
        marginHorizontal: 10,
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