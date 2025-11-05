import { StyleSheet, Text, View } from 'react-native';

export default function Inspections() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inspecciones</Text>
      <Text style={styles.subtitle}>Próximamente disponible</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#65676B',
    textAlign: 'center',
  },
});