import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Publish() {
  const router = useRouter();
  
  const publishOptions = [
    {
      id: 'with-inspection',
      title: 'Publicación con Revisión Técnica',
      description: 'Publica tu auto con certificación de inspección mecánica incluida para mayor confianza del comprador',
      icon: 'checkmark-circle',
      iconColor: '#4CAF50',
      backgroundColor: '#F1F8E9',
      borderColor: '#4CAF50'
    },
    {
      id: 'own-publication',
      title: 'Publicación Propia',
      description: 'Crea tu propia publicación con fotos y descripción personalizada sin servicios adicionales',
      icon: 'create',
      iconColor: '#2196F3',
      backgroundColor: '#E3F2FD',
      borderColor: '#2196F3'
    }
  ];

  const handlePublishOption = (optionId: string) => {
    console.log(`Opción seleccionada: ${optionId}`);
    
    if (optionId === 'own-publication') {
      router.push('/raw-publish');
    } else {
      // Aquí puedes agregar la navegación para otras opciones
      console.log('Funcionalidad próximamente disponible');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="car-sport" size={48} color="#4CAF50" />
        <Text style={styles.title}>Vender Auto</Text>
        <Text style={styles.subtitle}>
          Elige la mejor opción para vender tu vehículo
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {publishOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              { borderLeftColor: option.borderColor }
            ]}
            onPress={() => handlePublishOption(option.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: option.backgroundColor }
              ]}>
                <Ionicons 
                  name={option.icon as any} 
                  size={32} 
                  color={option.iconColor} 
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color="#65676B" 
              />
            </View>
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
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#65676B',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    padding: 16,
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#65676B',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 16,
  },
  infoItems: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#65676B',
    flex: 1,
  },
});