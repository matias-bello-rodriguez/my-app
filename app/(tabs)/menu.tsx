import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import authService from '../../services/authService';

export default function Menu() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await authService.logout();
              router.replace('/auth');
            } catch {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'settings-outline',
      title: 'Configuración',
      subtitle: 'Ajustes de la aplicación',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Ayuda y Soporte',
      subtitle: 'Centro de ayuda',
      onPress: () => Alert.alert('Próximamente', 'Función en desarrollo'),
    },
    {
      icon: 'information-circle-outline',
      title: 'Acerca de',
      subtitle: 'Versión 1.0.0',
      onPress: () => Alert.alert('AutoBox', 'Versión 1.0.0\n\n© 2024 AutoBox'),
    },
    {
      icon: 'log-out-outline',
      title: 'Cerrar Sesión',
      subtitle: 'Salir de tu cuenta',
      onPress: handleLogout,
      isDanger: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menú</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              item.isDanger && styles.menuItemDanger,
            ]}
            onPress={item.onPress}
            disabled={loading}
          >
            <View style={styles.menuItemLeft}>
              <View style={[
                styles.iconContainer,
                item.isDanger && styles.iconContainerDanger,
              ]}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.isDanger ? '#F44336' : '#4CAF50'}
                />
              </View>
              <View style={styles.menuItemText}>
                <Text style={[
                  styles.menuItemTitle,
                  item.isDanger && styles.menuItemTitleDanger,
                ]}>
                  {item.title}
                </Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  menuContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemDanger: {
    backgroundColor: '#FFF5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerDanger: {
    backgroundColor: '#FFEBEE',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 4,
  },
  menuItemTitleDanger: {
    color: '#F44336',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#65676B',
  },
});