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

export default function AuthScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        // Aquí iría la lógica de autenticación
        console.log('Login attempt:', { email, password });
        router.replace('/(tabs)');
    };

    const goToRegister = () => {
        router.push('/register');
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

                            {/* Formulario */}
                            <View style={styles.formContainer}>
                                <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
                                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
                                
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
                                            returnKeyType="done"
                                            onSubmitEditing={handleLogin}
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

                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                    <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>¿No tienes cuenta? </Text>
                                <TouchableOpacity onPress={goToRegister}>
                                    <Text style={styles.signUpText}>Regístrate aquí</Text>
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
        flex: 0.25,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 15,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    logo: {
        width:200,
        height: 200,
        borderRadius: 40,
    },
    brandName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    formContainer: {
        flex: 0.3,
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
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 16,
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
    forgotPassword: {
        alignItems: 'center',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
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
    signUpText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
    },
});