import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

interface SelectPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
}

export default function SelectPicker({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  loading = false,
  icon = 'chevron-down-outline',
}: SelectPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (selectedValue: string) => {
    console.log('Opción seleccionada:', selectedValue);
    onChange(selectedValue);
    setShowPicker(false);
  };

  const displayValue = value 
    ? options.find(opt => opt.value === value)?.label || value
    : placeholder || 'Selecciona una opción';

  console.log('SelectPicker - Opciones:', options.length, 'Value:', value);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={() => !disabled && !loading && setShowPicker(true)}
        activeOpacity={0.7}
        disabled={disabled || loading}
      >
        <Ionicons 
          name={icon} 
          size={20} 
          color="#4CAF50"
          style={styles.inputIcon}
        />
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {displayValue}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : (
          <Ionicons name="chevron-down" size={20} color="#4CAF50" />
        )}
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={() => setShowPicker(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle}>
              <View style={styles.modalHandleBar} />
            </View>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Selecciona una opción'}
              </Text>
              <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#65676B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={`${option.value}-${index}`}
                  style={[
                    styles.option,
                    value === option.value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  optionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  optionSelected: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    color: '#1C1E21',
    fontWeight: '500',
    flex: 1,
  },
  optionTextSelected: {
    color: '#4CAF50',
    fontWeight: '700',
  },
});
