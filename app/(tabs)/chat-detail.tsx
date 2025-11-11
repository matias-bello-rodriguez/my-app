import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useHeader } from '../../contexts/HeaderContext';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
    read?: boolean;
}

export default function ChatDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { name, online } = params;
    const isOnline = online === 'true';
    const { hideHeader, showHeader } = useHeader();
    
    // Ocultar header y tabs cuando la pantalla esté enfocada
    useFocusEffect(
        useCallback(() => {
            hideHeader();
            return () => {
                showHeader();
            };
        }, [hideHeader, showHeader])
    );
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hola, ¿el auto sigue disponible?',
            sender: 'other',
            timestamp: '10:30',
        },
        {
            id: '2',
            text: 'Sí, está disponible. ¿Te interesa verlo?',
            sender: 'me',
            timestamp: '10:32',
            read: true,
        },
        {
            id: '3',
            text: 'Me gustaría saber más detalles sobre el kilometraje y si tiene algún problema mecánico',
            sender: 'other',
            timestamp: '10:35',
        },
        {
            id: '4',
            text: 'Tiene 85,000 km y está en excelente estado. Acabo de hacerle la revisión técnica.',
            sender: 'me',
            timestamp: '10:36',
            read: true,
        },
        {
            id: '5',
            text: '¿Incluye alguna inspección mecánica?',
            sender: 'other',
            timestamp: '10:38',
        },
    ]);

    const handleBackPress = () => {
        router.back();
    };

    const handleSendMessage = () => {
        if (message.trim().length === 0) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: message.trim(),
            sender: 'me',
            timestamp: new Date().toLocaleTimeString('es-CL', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            read: false,
        };

        setMessages([...messages, newMessage]);
        setMessage('');
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender === 'me';
        
        return (
            <View style={[
                styles.messageContainer,
                isMe ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                {!isMe && (
                    <View style={styles.messageAvatarPlaceholder}>
                        <Ionicons name="person" size={16} color="#FFFFFF" />
                    </View>
                )}
                
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.myMessageBubble : styles.otherMessageBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.otherMessageText
                    ]}>
                        {item.text}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text style={[
                            styles.messageTime,
                            isMe ? styles.myMessageTime : styles.otherMessageTime
                        ]}>
                            {item.timestamp}
                        </Text>
                        {isMe && (
                            <Ionicons 
                                name={item.read ? "checkmark-done" : "checkmark"} 
                                size={14} 
                                color={item.read ? "#4CAF50" : "#FFFFFF"} 
                                style={{ marginLeft: 4 }}
                            />
                        )}
                    </View>
                </View>
                
                {isMe && <View style={styles.spacer} />}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.headerCenter}>
                    <View style={styles.headerAvatarContainer}>
                        <View style={styles.headerAvatarPlaceholder}>
                            <Ionicons name="person" size={20} color="#FFFFFF" />
                        </View>
                        {isOnline && <View style={styles.headerOnlineIndicator} />}
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{name}</Text>
                        <Text style={styles.headerStatus}>
                            {isOnline ? 'En línea' : 'Desconectado'}
                        </Text>
                    </View>
                </View>

                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="call-outline" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="videocam-outline" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                inverted={false}
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="add-circle" size={28} color="#4CAF50" />
                </TouchableOpacity>
                
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor="#65676B"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity style={styles.emojiButton}>
                        <Ionicons name="happy-outline" size={24} color="#65676B" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[
                        styles.sendButton,
                        message.trim().length === 0 && styles.sendButtonDisabled
                    ]}
                    onPress={handleSendMessage}
                    disabled={message.trim().length === 0}
                >
                    <Ionicons 
                        name="send" 
                        size={20} 
                        color="#FFFFFF" 
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    header: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        paddingTop: Platform.OS === 'ios' ? 50 : 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatarContainer: {
        position: 'relative',
        marginRight: 10,
    },
    headerAvatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerOnlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#44B700',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerStatus: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 8,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messagesContainer: {
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    messageAvatarPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '70%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
    },
    myMessageBubble: {
        backgroundColor: '#4CAF50',
        borderBottomRightRadius: 4,
    },
    otherMessageBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#FFFFFF',
    },
    otherMessageText: {
        color: '#1C1E21',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        justifyContent: 'flex-end',
    },
    messageTime: {
        fontSize: 11,
    },
    myMessageTime: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    otherMessageTime: {
        color: '#65676B',
    },
    spacer: {
        width: 36,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E4E6EA',
    },
    attachButton: {
        marginBottom: 6,
        marginRight: 8,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F0F2F5',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 40,
        maxHeight: 100,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1C1E21',
        maxHeight: 80,
        paddingTop: 8,
    },
    emojiButton: {
        marginLeft: 8,
        marginBottom: 2,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
