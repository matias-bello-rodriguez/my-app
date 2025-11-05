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

    const goToForgotPassword = () => {
        router.push('/forgot-password');
    };

    const handleGoogleLogin = () => {
        // Aquí iría la lógica de autenticación con Google
        console.log('Google login attempt');
        // Simular login exitoso para propósitos de demostración
        router.replace('/(tabs)');
    };

    const handleFacebookLogin = () => {
        // Aquí iría la lógica de autenticación con Facebook
        console.log('Facebook login attempt');
        // Simular login exitoso para propósitos de demostración
        router.replace('/(tabs)');
    };

    const handleOutlookLogin = () => {
        // Aquí iría la lógica de autenticación con Microsoft/Outlook
        console.log('Outlook login attempt');
        // Simular login exitoso para propósitos de demostración
        router.replace('/(tabs)');
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
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
                                        <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={email}
                                            onChangeText={setEmail}
                                            placeholder="Correo electrónico"
                                            placeholderTextColor="#8E8E93"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            returnKeyType="next"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={password}
                                            onChangeText={setPassword}
                                            placeholder="Contraseña"
                                            placeholderTextColor="#8E8E93"
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
                                                color="#8E8E93" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.forgotPassword} onPress={goToForgotPassword}>
                                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                    <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                                </TouchableOpacity>

                                {/* Separador */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>O continúa con</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Botones de redes sociales */}
                                <View style={styles.socialButtonsContainer}>
                                    <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                                        <Text style={styles.socialButtonText}>Google</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                                        <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                                        <Text style={styles.socialButtonText}>Facebook</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.socialButton} onPress={handleOutlookLogin}>
                                        <Ionicons name="mail" size={24} color="#0078D4" />
                                        <Text style={styles.socialButtonText}>Outlook</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Footer */}
                            <TouchableOpacity 
                                style={styles.footer} 
                                onPress={goToRegister}
                            >
                                <Ionicons name="person-add" size={20} color="#FFFFFF" />
                                <Text style={styles.signUpText}> ¿No tienes cuenta? Regístrate</Text>
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
        backgroundColor: '#1C1C1E', // Negro oscuro
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
        flex: 0.15,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 25,
        padding: 15,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#38383A',
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
        flex: 0.5,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#38383A',
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
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
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    loginButtonText: {
        color: '#1C1C1E',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 0.15,
    },
    footerText: {
        color: '#8E8E93',
        fontSize: 14,
    },
    signUpText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    // Estilos para login social
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#48484A',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#8E8E93',
        fontSize: 14,
        fontWeight: '500',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 10,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#38383A',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    socialButtonText: {
        marginLeft: 8,
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});