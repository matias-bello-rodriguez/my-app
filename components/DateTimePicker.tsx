import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mode: 'date' | 'time';
  placeholder?: string;
  disabled?: boolean;
}

export default function DateTimePicker({
  label,
  value,
  onChange,
  mode,
  placeholder,
  disabled = false,
}: DateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  // Calcular fecha mínima (18 años y 1 día desde hoy) usando useMemo
  const maxDate = React.useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() - 1);
  }, []);

  const minYear = 1900;
  const maxYear = maxDate.getFullYear();

  // Generar arrays de opciones
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];
  // Generar años desde 1900 hasta (año actual - 18 años)
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Inicializar valores desde el value prop
  React.useEffect(() => {
    if (value) {
      if (mode === 'date') {
        // Formato esperado: DD/MM/AAAA
        const parts = value.split('/');
        if (parts.length === 3) {
          setSelectedDay(parseInt(parts[0]) || 1);
          setSelectedMonth(parseInt(parts[1]) || 1);
          setSelectedYear(parseInt(parts[2]) || maxYear);
        }
      } else if (mode === 'time') {
        // Formato esperado: HH:MM
        const parts = value.split(':');
        if (parts.length === 2) {
          setSelectedHour(parseInt(parts[0]) || 12);
          setSelectedMinute(parseInt(parts[1]) || 0);
        }
      }
    } else {
      // Si no hay valor, inicializar con fecha por defecto (18 años atrás)
      if (mode === 'date') {
        setSelectedDay(maxDate.getDate());
        setSelectedMonth(maxDate.getMonth() + 1);
        setSelectedYear(maxYear);
      }
    }
  }, [value, mode, maxYear, maxDate]);

  const handleConfirm = () => {
    let newValue = '';
    if (mode === 'date') {
      // Validar que la fecha no sea mayor a 18 años atrás
      const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
      if (selectedDate > maxDate) {
        alert('Debes ser mayor de 18 años para registrarte');
        return;
      }
      newValue = `${selectedDay.toString().padStart(2, '0')}/${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`;
    } else {
      newValue = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    }
    onChange(newValue);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const displayValue = value || placeholder || (mode === 'date' ? 'Selecciona una fecha' : 'Selecciona una hora');

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={mode === 'date' ? 'calendar-outline' : 'time-outline'} 
          size={20} 
          color="#4CAF50"
          style={styles.inputIcon}
        />
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {displayValue}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#4CAF50" />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={handleCancel}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle}>
              <View style={styles.modalHandleBar} />
            </View>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'date' ? 'Selecciona una fecha' : 'Selecciona una hora'}
              </Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#65676B" />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              {mode === 'date' ? (
                <>
                  {/* Día */}
                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Día</Text>
                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                      {days.map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.pickerOption,
                            selectedDay === day && styles.pickerOptionSelected,
                          ]}
                          onPress={() => setSelectedDay(day)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.pickerOptionText,
                              selectedDay === day && styles.pickerOptionTextSelected,
                            ]}
                          >
                            {day.toString().padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Mes */}
                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Mes</Text>
                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                      {months.map((month) => (
                        <TouchableOpacity
                          key={month.value}
                          style={[
                            styles.pickerOption,
                            selectedMonth === month.value && styles.pickerOptionSelected,
                          ]}
                          onPress={() => setSelectedMonth(month.value)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.pickerOptionText,
                              selectedMonth === month.value && styles.pickerOptionTextSelected,
                            ]}
                          >
                            {month.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Año */}
                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Año</Text>
                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                      {years.map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={[
                            styles.pickerOption,
                            selectedYear === year && styles.pickerOptionSelected,
                          ]}
                          onPress={() => setSelectedYear(year)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.pickerOptionText,
                              selectedYear === year && styles.pickerOptionTextSelected,
                            ]}
                          >
                            {year}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </>
              ) : (
                <>
                  {/* Hora */}
                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Hora</Text>
                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                      {hours.map((hour) => (
                        <TouchableOpacity
                          key={hour}
                          style={[
                            styles.pickerOption,
                            selectedHour === hour && styles.pickerOptionSelected,
                          ]}
                          onPress={() => setSelectedHour(hour)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.pickerOptionText,
                              selectedHour === hour && styles.pickerOptionTextSelected,
                            ]}
                          >
                            {hour.toString().padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Minutos */}
                  <View style={styles.pickerColumn}>
                    <Text style={styles.pickerLabel}>Minutos</Text>
                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                      {minutes.map((minute) => (
                        <TouchableOpacity
                          key={minute}
                          style={[
                            styles.pickerOption,
                            selectedMinute === minute && styles.pickerOptionSelected,
                          ]}
                          onPress={() => setSelectedMinute(minute)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.pickerOptionText,
                              selectedMinute === minute && styles.pickerOptionTextSelected,
                            ]}
                          >
                            {minute.toString().padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 8,
  },
  input: {
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
  inputDisabled: {
    backgroundColor: '#F0F2F5',
    opacity: 0.6,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    color: '#999999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E4E6EA',
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1E21',
    letterSpacing: 0.2,
  },
  closeButton: {
    padding: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  pickerColumn: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 8,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerScroll: {
    maxHeight: 280,
  },
  pickerOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pickerOptionSelected: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerOptionText: {
    fontSize: 17,
    color: '#1C1E21',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E4E6EA',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#65676B',
    letterSpacing: 0.3,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
