import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    KeyboardTypeOptions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useHeader } from '../../contexts/HeaderContext';
import apiService from '../../services/apiService';

export default function ProfileScreen() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { hideHeader, showHeader } = useHeader();
    
    // Ocultar header cuando la pantalla esté enfocada y mostrarlo cuando se desenfoque
    useFocusEffect(
        useCallback(() => {
            // Cuando la pantalla se enfoca (se abre)
            hideHeader();
            
            // Cuando la pantalla se desenfoca (se cierra o navega a otra)
            return () => {
                showHeader();
            };
        }, [hideHeader, showHeader])
    );
    
    // Función para volver atrás
    const handleGoBack = () => {
        showHeader(); // Mostrar header antes de navegar
        router.back();
    };

    // Funciones para navegación del header
    const handleSearchPress = () => {
        router.push('/search');
    };

    const handleChatPress = () => {
        router.push('/(tabs)');
    };
    
    // Estados para los datos del usuario
    const [userId, setUserId] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [rut, setRut] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Estados originales para cancelar edición
    const [originalData, setOriginalData] = useState<any>(null);

    // Cargar datos del perfil
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const profile = await apiService.getProfile();
            
            setUserId(profile.id);
            setName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setRut(profile.rut || '');
            setEmail(profile.email || '');
            setPhone(profile.phone || '');
            setProfileImage(profile.avatarUrl || null);

            // Guardar datos originales
            setOriginalData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                rut: profile.rut,
                email: profile.email,
                phone: profile.phone,
                avatarUrl: profile.avatarUrl,
            });
        } catch (error: any) {
            console.error('Error al cargar perfil:', error);
            Alert.alert('Error', 'No se pudo cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleImagePicker = () => {
        Alert.alert(
            'Foto de Perfil',
            'Selecciona una opción',
            [
                {
                    text: 'Tomar Foto',
                    onPress: () => openCamera(),
                },
                {
                    text: 'Elegir de Galería',
                    onPress: () => openGallery(),
                },
                {
                    text: 'Eliminar Foto',
                    onPress: () => removeImage(),
                    style: 'destructive',
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permisos', 'Se necesitan permisos de cámara para tomar una foto.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permisos', 'Se necesitan permisos de galería para seleccionar una imagen.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setProfileImage(null);
    };

    const handleSave = async () => {
        if (saving) return;

        try {
            setSaving(true);

            const updateData: any = {
                firstName: name,
                lastName: lastName,
                phone: phone || undefined,
            };

            // Solo incluir avatarUrl si cambió
            if (profileImage !== originalData?.avatarUrl) {
                updateData.avatarUrl = profileImage;
            }

            await apiService.updateProfile(userId, updateData);
            
            // Actualizar datos originales
            setOriginalData({
                ...originalData,
                ...updateData,
            });

            setIsEditing(false);
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Restaurar valores originales
        if (originalData) {
            setName(originalData.firstName || '');
            setLastName(originalData.lastName || '');
            setRut(originalData.rut || '');
            setEmail(originalData.email || '');
            setPhone(originalData.phone || '');
            setProfileImage(originalData.avatarUrl || null);
        }
        setIsEditing(false);
    };

    const renderProfileImage = () => {
        return (
            <TouchableOpacity 
                style={styles.profileImageContainer} 
                onPress={isEditing ? handleImagePicker : undefined}
                activeOpacity={isEditing ? 0.7 : 1}
            >
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <View style={styles.profileImagePlaceholder}>
                        <Ionicons name="person" size={60} color="#FFFFFF" />
                    </View>
                )}
                
                {isEditing && (
                    <View style={styles.editImageOverlay}>
                        <Ionicons name="camera" size={24} color="#FFFFFF" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderField = (
        label: string, 
        value: string, 
        setValue: (value: string) => void, 
        placeholder: string, 
        iconName: any, 
        keyboardType: KeyboardTypeOptions = 'default', 
        autoCapitalize: 'none' | 'sentences' | 'words' | 'characters' = 'words',
        editable: boolean = true
    ) => {
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name={iconName} size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, (!isEditing || !editable) && styles.inputDisabled]}
                        value={value}
                        onChangeText={setValue}
                        placeholder={placeholder}
                        placeholderTextColor="#999999"
                        editable={isEditing && editable}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                        returnKeyType="next"
                    />
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.profileHeader}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={handleGoBack}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mi Perfil</Text>
                    <View style={styles.headerSpacer} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Cargando perfil...</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? "padding" : "height"}
        >
            {/* Header de perfil */}
            <View style={styles.profileHeader}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleGoBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIcon} onPress={handleSearchPress}>
                        <Ionicons name="search" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon} onPress={handleChatPress}>
                        <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        {/* Foto de perfil */}
                        <View style={styles.profileSection}>
                            <View style={styles.profileHeaderRow}>
                                <View style={styles.profileImageContainer}>
                                    {renderProfileImage()}
                                </View>
                                <TouchableOpacity 
                                    style={styles.editButton}
                                    onPress={() => setIsEditing(!isEditing)}
                                >
                                    <Ionicons 
                                        name={isEditing ? "close" : "pencil"} 
                                        size={24} 
                                        color="#4CAF50" 
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.profileName}>
                                {name} {lastName}
                            </Text>
                            <Text style={styles.profileEmail}>{email}</Text>
                            {isEditing && (
                                <Text style={styles.imageHint}>
                                    Toca la imagen para cambiarla
                                </Text>
                            )}
                        </View>

                        {/* Información personal */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Información Personal</Text>
                            
                            {renderField(
                                'Nombre',
                                name,
                                setName,
                                'Ingresa tu nombre',
                                'person-outline'
                            )}

                            {renderField(
                                'Apellido',
                                lastName,
                                setLastName,
                                'Ingresa tu apellido',
                                'person-outline'
                            )}

                            {renderField(
                                'RUT',
                                rut,
                                setRut,
                                'Ingresa tu RUT',
                                'card-outline',
                                'default',
                                'none',
                                false // No editable
                            )}

                            {renderField(
                                'Fecha de Nacimiento',
                                birthDate,
                                setBirthDate,
                                'DD/MM/AAAA',
                                'calendar-outline',
                                'numeric',
                                'none',
                                false // No editable por ahora
                            )}

                            {renderField(
                                'Teléfono',
                                phone,
                                setPhone,
                                'Ingresa tu teléfono',
                                'call-outline',
                                'phone-pad',
                                'none'
                            )}
                        </View>

                        {/* Ubicación */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Ubicación</Text>
                            
                            {renderField(
                                'Región',
                                region,
                                setRegion,
                                'Selecciona tu región',
                                'location-outline',
                                'default',
                                'words',
                                false // No editable por ahora
                            )}

                            {renderField(
                                'Comuna',
                                comuna,
                                setComuna,
                                'Selecciona tu comuna',
                                'business-outline',
                                'default',
                                'words',
                                false // No editable por ahora
                            )}
                        </View>

                        {/* Contacto */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Contacto</Text>
                            
                            {renderField(
                                'Correo Electrónico',
                                email,
                                setEmail,
                                'Ingresa tu email',
                                'mail-outline',
                                'email-address',
                                'none',
                                false // No editable
                            )}
                        </View>

                        {/* Botones de acción */}
                        {isEditing && (
                            <View style={styles.actionButtons}>
                                <TouchableOpacity 
                                    style={styles.cancelButton} 
                                    onPress={handleCancel}
                                    disabled={saving}
                                >
                                    <Text style={styles.cancelButtonText}>CANCELAR</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                                    onPress={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                                            <Text style={styles.saveButtonText}>GUARDANDO...</Text>
                                        </>
                                    ) : (
                                        <Text style={styles.saveButtonText}>GUARDAR</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    profileHeader: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'ios' ? 50 : 12, // Menos padding en Android
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSpacer: {
        width: 44, // Mismo ancho que el backButton para centrar el título
    },
    scrollContainer: {
        flexGrow: 1,
    },
    content: {
        padding: 20,
    },
    profileSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    profileImageContainer: {
        position: 'relative',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#4CAF50',
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#45A049',
    },
    editImageOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1E21',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 16,
        color: '#65676B',
        marginBottom: 8,
    },
    imageHint: {
        fontSize: 12,
        color: '#2196F3',
        fontStyle: 'italic',
    },
    formSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50',
        paddingLeft: 12,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1E21',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E4E6EA',
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1C1E21',
        height: 48,
    },
    inputDisabled: {
        color: '#65676B',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 16,
    },
    cancelButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        flex: 1,
        borderWidth: 2,
        borderColor: '#E4E6EA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cancelButtonText: {
        color: '#65676B',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 2,
        borderColor: '#45A049',
    },
    saveButtonDisabled: {
        backgroundColor: '#A5D6A7',
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#65676B',
    },
});
