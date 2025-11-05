import { Ionicons } from '@expo/vector-icons';
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Detalles, 2: Pago

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

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Indicador de pasos */}
      <View style={styles.stepIndicator}>
        <View style={styles.stepContainer}>
          <View style={[styles.stepCircle, currentStep >= 1 && styles.activeStep]}>
            <Text style={[styles.stepNumber, currentStep >= 1 && styles.activeStepText]}>1</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep === 1 && styles.activeStepLabel]}>Detalles</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepContainer}>
          <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStep]}>
            <Text style={[styles.stepNumber, currentStep >= 2 && styles.activeStepText]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep === 2 && styles.activeStepLabel]}>Pago</Text>
        </View>
      </View>

      {/* Paso 1: Detalle del Servicio */}
      {currentStep === 1 && (
        <>
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

          {/* Botón Siguiente */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.nextButtonFull} 
              onPress={handleNextStep}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>SIGUIENTE</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Paso 2: Forma de Pago */}
      {currentStep === 2 && (
        <>
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

            <View style={styles.separator} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a Pagar</Text>
              <Text style={styles.totalAmount}>{formatCurrency(inspectionDetails.price)}</Text>
            </View>
          </View>

          {/* Botones de navegación */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handlePreviousStep}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>ATRÁS</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.payButton, !selectedPaymentMethod && styles.disabledButton]} 
              onPress={handlePayment}
              activeOpacity={0.8}
              disabled={!selectedPaymentMethod}
            >
              <Text style={styles.payButtonText}>
                PAGAR
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingTop: 8,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1E21',
    marginBottom: 20,
    letterSpacing: 0.3,
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
    fontSize: 14,
    color: '#65676B',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1C1E21',
    fontWeight: '600',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 15,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#45A049',
  },
  nextButtonFull: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#45A049',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center'
  },
  disabledButton: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#45A049',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Estilos para indicador de pasos
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
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
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E4E6EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: '#4CAF50',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#65676B',
  },
  activeStepText: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65676B',
  },
  activeStepLabel: {
    color: '#4CAF50',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E4E6EA',
    marginHorizontal: 16,
  },
});
