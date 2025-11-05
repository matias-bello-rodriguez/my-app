import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
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
                                            <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
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
                                <TouchableOpacity onPress={goBackToLogin}>
                                    <Text style={styles.backToLoginText}>
                                        <Ionicons name="arrow-back" size={16} color="#FFFFFF" /> Volver al inicio de sesión
                                    </Text>
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
    formContainer: {
        flex: 0.8,
        justifyContent: 'center',
        paddingVertical: 40,
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
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    inputContainer: {
        marginBottom: 20,
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
    resetButton: {
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
    resetButtonText: {
        color: '#1C1C1E',
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
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    successSubtext: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 0.2,
    },
    backToLoginText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});