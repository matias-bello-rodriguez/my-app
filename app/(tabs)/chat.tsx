import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useHeader } from '../../contexts/HeaderContext';

interface Conversation {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    online: boolean;
    avatar?: string;
}

export default function ChatScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
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
    
    // Datos de ejemplo de conversaciones
    const [conversations] = useState<Conversation[]>([
        {
            id: '1',
            name: 'Juan Pérez',
            lastMessage: 'Hola, ¿el auto sigue disponible?',
            timestamp: 'Hace 5 min',
            unread: 2,
            online: true,
        },
        {
            id: '2',
            name: 'María González',
            lastMessage: '¿Puedo verlo mañana?',
            timestamp: 'Hace 1 hora',
            unread: 0,
            online: true,
        },
        {
            id: '3',
            name: 'Carlos Rojas',
            lastMessage: 'Gracias por la información',
            timestamp: 'Ayer',
            unread: 0,
            online: false,
        },
        {
            id: '4',
            name: 'Ana Silva',
            lastMessage: '¿Acepta permuta?',
            timestamp: 'Hace 2 días',
            unread: 1,
            online: false,
        },
        {
            id: '5',
            name: 'Pedro Martínez',
            lastMessage: 'El precio es negociable?',
            timestamp: 'Hace 3 días',
            unread: 0,
            online: false,
        },
    ]);

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBackPress = () => {
        router.back();
    };

    const handleConversationPress = (conversation: Conversation) => {
        router.push({
            pathname: '/chat-detail' as any,
            params: { 
                id: conversation.id,
                name: conversation.name,
                online: conversation.online.toString()
            }
        });
    };

    const renderConversation = ({ item }: { item: Conversation }) => (
        <TouchableOpacity 
            style={styles.conversationItem}
            onPress={() => handleConversationPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.avatarContainer}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={24} color="#FFFFFF" />
                    </View>
                )}
                {item.online && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>{item.name}</Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                
                <View style={styles.messageRow}>
                    <Text 
                        style={[
                            styles.lastMessage,
                            item.unread > 0 && styles.unreadMessage
                        ]}
                        numberOfLines={1}
                    >
                        {item.lastMessage}
                    </Text>
                    {item.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chats</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="create-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#65676B" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar en chats"
                        placeholderTextColor="#65676B"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#65676B" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Conversations List */}
            {filteredConversations.length > 0 ? (
                <FlatList
                    data={filteredConversations}
                    renderItem={renderConversation}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
                    <Text style={styles.emptyText}>
                        {searchQuery ? 'No se encontraron conversaciones' : 'No tienes conversaciones'}
                    </Text>
                </View>
            )}
        </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'ios' ? 50 : 12,
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
        gap: 12,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E6EA',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1C1E21',
    },
    listContainer: {
        paddingBottom: 16,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#44B700',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    conversationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1E21',
        flex: 1,
    },
    timestamp: {
        fontSize: 12,
        color: '#65676B',
        marginLeft: 8,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        fontSize: 14,
        color: '#65676B',
        flex: 1,
    },
    unreadMessage: {
        color: '#1C1E21',
        fontWeight: '600',
    },
    unreadBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        marginLeft: 8,
    },
    unreadCount: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#65676B',
        marginTop: 16,
        textAlign: 'center',
    },
});
