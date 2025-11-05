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
    View,
    Alert,
} from "react-native";

export default function ForgotPasswordScreen(){
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const router = useRouter();

    const handleResetPassword = () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
            return;
        }

        // Aquí iría la lógica para enviar el email de recuperación
        console.log('Password reset request for:', email);
        
        // Simular envío exitoso
        setIsEmailSent(true);
        
        // Mostrar confirmación
        Alert.alert(
            'Email enviado',
            'Se ha enviado un enlace de recuperación a tu correo electrónico.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Regresar al login después de 3 segundos
                        setTimeout(() => {
                            router.back();
                        }, 1500);
                    }
                }
            ]
        );
    };

    const goBackToLogin = () => {
        router.back();
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
                                <Text style={styles.welcomeText}>¿Olvidaste tu contraseña?</Text>
                                <Text style={styles.subtitle}>
                                    {isEmailSent 
                                        ? 'Revisa tu correo electrónico para el enlace de recuperación'
                                        : 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña'
                                    }
                                </Text>
                                
                                {!isEmailSent && (
                                    <>
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
                                                    returnKeyType="done"
                                                    onSubmitEditing={handleResetPassword}
                                                />
                                            </View>
                                        </View>

                                        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
                                            <Text style={styles.resetButtonText}>ENVIAR ENLACE</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {isEmailSent && (
                                    <View style={styles.successContainer}>
                                        <View style={styles.successIcon}>
                                            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                                        </View>
                                        <Text style={styles.successText}>¡Email enviado exitosamente!</Text>
                                        <Text style={styles.successSubtext}>
                                            Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <TouchableOpacity onPress={goBackToLogin} style={styles.backToLoginButton}>
                                    <Ionicons name="arrow-back" size={20} color="#4CAF50" style={styles.backIcon} />
                                    <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
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
        width: 200,
        height: 200,
        borderRadius: 40,
    },
    formContainer: {
        flex: 0.5,
        justifyContent: 'center',
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
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    inputContainer: {
        marginBottom: 20,
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
    resetButton: {
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
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    successIcon: {
        marginBottom: 20,
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 10,
    },
    successSubtext: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    footer: {
        alignItems: 'center',
        flex: 0.25,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    backToLoginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    backIcon: {
        marginRight: 8,
    },
    backToLoginText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '600',
    },
});