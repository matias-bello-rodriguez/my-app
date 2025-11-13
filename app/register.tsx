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
    const [rutValid, setRutValid] = useState<boolean | null>(null);
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
        
        const formatted = formatRut(filtered);
        setRut(formatted);
        
        // Validar RUT cuando tenga al menos 8 caracteres sin formato
        const cleaned = cleanRut(formatted);
        if (cleaned.length >= 8) {
            setRutValid(validateRut(formatted));
        } else {
            setRutValid(null);
        }
    };

    // Función para limpiar el RUT (sin puntos ni guión)
    const cleanRut = (rut: string): string => {
        return rut.replace(/\./g, '').replace(/-/g, '');
    };

    // Función para formatear el RUT para el backend (formato: 12345678-9)
    const formatRutForBackend = (rut: string): string => {
        const cleaned = cleanRut(rut);
        if (cleaned.length < 2) return cleaned;
        
        // Separar cuerpo y dígito verificador
        const body = cleaned.slice(0, -1);
        const dv = cleaned.slice(-1);
        
        return `${body}-${dv}`;
    };

    const handleRegister = async () => {
        if (loading) return;

        // Validar paso 3 antes de registrar
        if (!validateStep3()) {
            return;
        }

        setLoading(true);
        try {
            await authService.register({
                firstName: name,
                lastName,
                rut: formatRutForBackend(rut), // Enviar RUT con formato: 12345678-9
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

    // Validar RUT chileno
    const validateRut = (rut: string): boolean => {
        // Limpiar el RUT
        const cleanedRut = cleanRut(rut);
        
        // Debe tener entre 8 y 9 caracteres (mínimo 7 dígitos + 1 verificador, máximo 8 dígitos + 1 verificador)
        if (cleanedRut.length < 8 || cleanedRut.length > 9) {
            return false;
        }
        
        // Separar cuerpo y dígito verificador
        const body = cleanedRut.slice(0, -1);
        const dv = cleanedRut.slice(-1).toUpperCase();
        
        // El cuerpo debe tener al menos 7 dígitos
        if (body.length < 7) {
            return false;
        }
        
        // Verificar que el cuerpo solo contenga números
        if (!/^\d+$/.test(body)) {
            return false;
        }
        
        // Calcular dígito verificador
        let sum = 0;
        let multiplier = 2;
        
        for (let i = body.length - 1; i >= 0; i--) {
            sum += parseInt(body[i]) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }
        
        const expectedDv = 11 - (sum % 11);
        let calculatedDv = '';
        
        if (expectedDv === 11) calculatedDv = '0';
        else if (expectedDv === 10) calculatedDv = 'K';
        else calculatedDv = expectedDv.toString();
        
        return dv === calculatedDv;
    };

    // Validar email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validar que la contraseña cumpla con los requisitos
    const validatePassword = (password: string): boolean => {
        if (password.length < 8) return false;
        
        const hasUpperCase = /[A-ZÁÉÍÓÚÜÑ]/.test(password);
        const hasLowerCase = /[a-záéíóúüñ]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(password);
        
        return hasUpperCase && hasLowerCase && hasSpecialChar;
    };

    // Función para calcular la fortaleza de la contraseña
    const getPasswordStrength = (password: string): { level: 'weak' | 'medium' | 'strong', text: string, color: string } => {
        if (password.length === 0) {
            return { level: 'weak', text: '', color: '#999999' };
        }

        const hasUpperCase = /[A-ZÁÉÍÓÚÜÑ]/.test(password);
        const hasLowerCase = /[a-záéíóúüñ]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(password);
        const isLongEnough = password.length >= 8;

        let strength = 0;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumber) strength++;
        if (hasSpecialChar) strength++;
        if (isLongEnough) strength++;

        if (strength <= 2) {
            return { level: 'weak', text: 'Débil', color: '#F44336' };
        } else if (strength <= 4) {
            return { level: 'medium', text: 'Suficiente', color: '#FF9800' };
        } else {
            return { level: 'strong', text: 'Fuerte', color: '#4CAF50' };
        }
    };

    // Validación del paso 1
    const validateStep1 = (): boolean => {
        if (!name.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu nombre');
            return false;
        }
        if (!lastName.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu apellido');
            return false;
        }
        if (!rut.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu RUT');
            return false;
        }
        const cleanedRut = cleanRut(rut);
        if (cleanedRut.length < 8) {
            Alert.alert('Error', 'El RUT debe tener al menos 8 dígitos (ej: 12.345.678-9)');
            return false;
        }
        if (!validateRut(rut)) {
            Alert.alert('Error', 'El RUT ingresado no es válido');
            return false;
        }
        if (!birthDate.trim()) {
            Alert.alert('Error', 'Por favor selecciona tu fecha de nacimiento');
            return false;
        }
        
        // Validar que sea mayor de 18 años
        const parts = birthDate.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
            const year = parseInt(parts[2]);
            const selectedDate = new Date(year, month, day);
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() - 1);
            
            if (selectedDate > minDate) {
                Alert.alert('Error', 'Debes ser mayor de 18 años para registrarte');
                return false;
            }
        }
        
        return true;
    };

    // Validación del paso 2
    const validateStep2 = (): boolean => {
        if (!region.trim()) {
            Alert.alert('Error', 'Por favor selecciona tu región');
            return false;
        }
        if (!comuna.trim()) {
            Alert.alert('Error', 'Por favor selecciona tu comuna');
            return false;
        }
        return true;
    };

    // Validación del paso 3
    const validateStep3 = (): boolean => {
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
            return false;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Por favor ingresa una contraseña');
            return false;
        }
        if (!validatePassword(password)) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, letras minúsculas y un carácter especial');
            return false;
        }
        if (!confirmPassword.trim()) {
            Alert.alert('Error', 'Por favor confirma tu contraseña');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return false;
        }
        return true;
    };

    const nextStep = () => {
        // Validar según el paso actual
        if (currentStep === 1 && !validateStep1()) {
            return;
        }
        if (currentStep === 2 && !validateStep2()) {
            return;
        }
        
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
                                            <View style={[
                                                styles.inputWrapper,
                                                rutValid === false && styles.inputWrapperError
                                            ]}>
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
                                            {rutValid === false && (
                                                <Text style={styles.errorText}>
                                                    RUT inválido
                                                </Text>
                                            )}
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
                                            <View style={[
                                                styles.inputWrapper,
                                                email.trim() && !validateEmail(email) && styles.inputWrapperError
                                            ]}>
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
                                                {email.trim() && (
                                                    <Ionicons 
                                                        name={validateEmail(email) ? "checkmark-circle" : "close-circle"} 
                                                        size={20} 
                                                        color={validateEmail(email) ? "#4CAF50" : "#F44336"} 
                                                        style={styles.validationIcon}
                                                    />
                                                )}
                                            </View>
                                            {email.trim() && !validateEmail(email) && (
                                                <Text style={styles.errorText}>
                                                    Ingresa un correo electrónico válido
                                                </Text>
                                            )}
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
                                            {password.length > 0 && (
                                                <View style={styles.passwordStrengthContainer}>
                                                    <View style={styles.passwordStrengthBar}>
                                                        <View 
                                                            style={[
                                                                styles.passwordStrengthFill,
                                                                { 
                                                                    width: getPasswordStrength(password).level === 'weak' ? '33%' : 
                                                                           getPasswordStrength(password).level === 'medium' ? '66%' : '100%',
                                                                    backgroundColor: getPasswordStrength(password).color
                                                                }
                                                            ]} 
                                                        />
                                                    </View>
                                                    <Text style={[styles.passwordStrengthText, { color: getPasswordStrength(password).color }]}>
                                                        {getPasswordStrength(password).text}
                                                    </Text>
                                                </View>
                                            )}
                                            {password.length > 0 && (
                                                <View style={styles.passwordRequirements}>
                                                    <View style={styles.requirementRow}>
                                                        <Ionicons 
                                                            name={password.length >= 8 ? "checkmark-circle" : "close-circle"} 
                                                            size={16} 
                                                            color={password.length >= 8 ? "#4CAF50" : "#F44336"} 
                                                        />
                                                        <Text style={[styles.requirementText, { color: password.length >= 8 ? "#4CAF50" : "#666666" }]}>
                                                            Mínimo 8 caracteres
                                                        </Text>
                                                    </View>
                                                    <View style={styles.requirementRow}>
                                                        <Ionicons 
                                                            name={/[A-ZÁÉÍÓÚÜÑ]/.test(password) ? "checkmark-circle" : "close-circle"} 
                                                            size={16} 
                                                            color={/[A-ZÁÉÍÓÚÜÑ]/.test(password) ? "#4CAF50" : "#F44336"} 
                                                        />
                                                        <Text style={[styles.requirementText, { color: /[A-ZÁÉÍÓÚÜÑ]/.test(password) ? "#4CAF50" : "#666666" }]}>
                                                            Una mayúscula
                                                        </Text>
                                                    </View>
                                                    <View style={styles.requirementRow}>
                                                        <Ionicons 
                                                            name={/[a-záéíóúüñ]/.test(password) ? "checkmark-circle" : "close-circle"} 
                                                            size={16} 
                                                            color={/[a-záéíóúüñ]/.test(password) ? "#4CAF50" : "#F44336"} 
                                                        />
                                                        <Text style={[styles.requirementText, { color: /[a-záéíóúüñ]/.test(password) ? "#4CAF50" : "#666666" }]}>
                                                            Letras minúsculas
                                                        </Text>
                                                    </View>
                                                    <View style={styles.requirementRow}>
                                                        <Ionicons 
                                                            name={/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(password) ? "checkmark-circle" : "close-circle"} 
                                                            size={16} 
                                                            color={/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(password) ? "#4CAF50" : "#F44336"} 
                                                        />
                                                        <Text style={[styles.requirementText, { color: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(password) ? "#4CAF50" : "#666666" }]}>
                                                            Un carácter especial (!@#$%...)
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
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
    inputWrapperError: {
        borderColor: '#F44336',
    },
    validationIcon: {
        marginLeft: 8,
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 16,
    },
    passwordStrengthContainer: {
        marginTop: 8,
        marginHorizontal: 4,
    },
    passwordStrengthBar: {
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    passwordStrengthFill: {
        height: '100%',
        borderRadius: 3,
    },
    passwordStrengthText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'right',
        marginBottom: 8,
    },
    passwordRequirements: {
        marginTop: 4,
        paddingHorizontal: 4,
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    requirementText: {
        fontSize: 12,
        marginLeft: 6,
    },
});