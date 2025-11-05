import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function InspectionPayment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const paymentMethods = [
    { 
      id: 'webpay', 
      name: 'WebPay', 
      icon: 'card',
      description: 'Pago con tarjeta de crédito/débito'
    },
    { 
      id: 'goodcars_balance', 
      name: 'Descontar Saldo GoodCars', 
      icon: 'wallet',
      description: 'Usar saldo disponible en tu cuenta'
    },
    { 
      id: 'mechanic_pos', 
      name: 'Pago a Mecánico TCR Débito/Crédito', 
      icon: 'person',
      description: 'Pagar directamente al mecánico'
    },
    { 
      id: 'bank_transfer', 
      name: 'Transferencia Bancaria', 
      icon: 'business',
      description: 'Transferencia electrónica'
    },
  ];

  const inspectionDetails = {
    service: 'Inspección Mecánica Completa',
    price: 90000,
    duration: '60 minutos',
    vehicle: 'ABC-1234',
    date: '15/11/2025',
    time: '14:30',
    location: 'AutoBox Providencia'
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Por favor selecciona una forma de pago');
      return;
    }

    console.log('Procesando pago:', {
      paymentMethod: selectedPaymentMethod,
      amount: inspectionDetails.price,
      service: inspectionDetails.service
    });

    Alert.alert(
      'Pago Procesado', 
      `Pago de $${inspectionDetails.price.toLocaleString('es-CL')} procesado exitosamente con ${paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name}`
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CL')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#66BB6A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pago de Inspección</Text>
          <View style={styles.placeholder} />
        </View>
        <Ionicons name="receipt" size={48} color="#66BB6A" />
        <Text style={styles.title}>Confirmar Pago</Text>
        <Text style={styles.subtitle}>
          Confirma los detalles y selecciona tu forma de pago
        </Text>
      </View>

      {/* Detalle del Servicio */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Detalle del Servicio</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="car-sport" size={20} color="#66BB6A" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Servicio</Text>
            <Text style={styles.detailValue}>{inspectionDetails.service}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time" size={20} color="#66BB6A" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Duración</Text>
            <Text style={styles.detailValue}>{inspectionDetails.duration}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="document-text" size={20} color="#66BB6A" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Vehículo</Text>
            <Text style={styles.detailValue}>{inspectionDetails.vehicle}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color="#66BB6A" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha y Hora</Text>
            <Text style={styles.detailValue}>{inspectionDetails.date} - {inspectionDetails.time}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location" size={20} color="#66BB6A" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Ubicación</Text>
            <Text style={styles.detailValue}>{inspectionDetails.location}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a Pagar</Text>
          <Text style={styles.totalAmount}>{formatCurrency(inspectionDetails.price)}</Text>
        </View>
      </View>

      {/* Formas de Pago */}
      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Forma de Pago</Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentCard,
              selectedPaymentMethod === method.id && styles.selectedPaymentCard
            ]}
            onPress={() => setSelectedPaymentMethod(method.id)}
            activeOpacity={0.8}
          >
            <View style={styles.paymentInfo}>
              <Ionicons 
                name={method.icon as any} 
                size={24} 
                color={selectedPaymentMethod === method.id ? "#66BB6A" : "#65676B"} 
              />
              <View style={styles.paymentText}>
                <Text style={[
                  styles.paymentName,
                  selectedPaymentMethod === method.id && styles.selectedPaymentText
                ]}>
                  {method.name}
                </Text>
                <Text style={[
                  styles.paymentDescription,
                  selectedPaymentMethod === method.id && styles.selectedPaymentText
                ]}>
                  {method.description}
                </Text>
              </View>
            </View>
            {selectedPaymentMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color="#66BB6A" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón de Pago */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.payButton, !selectedPaymentMethod && styles.disabledButton]} 
          onPress={handlePayment}
          activeOpacity={0.8}
          disabled={!selectedPaymentMethod}
        >
          <Ionicons name="card" size={24} color="#FFFFFF" />
          <Text style={styles.payButtonText}>
            Pagar {formatCurrency(inspectionDetails.price)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Información de Seguridad */}
      <View style={styles.securityInfo}>
        <View style={styles.securityRow}>
          <Ionicons name="shield-checkmark" size={20} color="#66BB6A" />
          <Text style={styles.securityText}>Pago 100% seguro y encriptado</Text>
        </View>
        <View style={styles.securityRow}>
          <Ionicons name="lock-closed" size={20} color="#66BB6A" />
          <Text style={styles.securityText}>Tus datos están protegidos</Text>
        </View>
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
    paddingTop: 60, // Espacio extra para evitar conflicto con status bar
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1E21',
  },
  placeholder: {
    width: 40,
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
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#65676B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1C1E21',
    fontWeight: '600',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#E4E6EA',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1E21',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#66BB6A',
  },
  paymentContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  selectedPaymentCard: {
    borderColor: '#66BB6A',
    backgroundColor: '#F1F8E9',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#65676B',
  },
  selectedPaymentText: {
    color: '#66BB6A',
  },
  buttonContainer: {
    padding: 16,
  },
  payButton: {
    backgroundColor: '#66BB6A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  securityInfo: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#65676B',
    marginLeft: 8,
  },
});
