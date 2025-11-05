import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Componente slider personalizado usando TouchableOpacity
const CustomSlider = ({ 
  value, 
  onValueChange, 
  minimumValue, 
  maximumValue, 
  step = 1 
}: {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
}) => {
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;
  
  return (
    <View style={styles.customSlider}>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderProgress, { width: `${percentage}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
      </View>
      <View style={styles.sliderControls}>
        <TouchableOpacity 
          style={styles.sliderButton}
          onPress={() => onValueChange(Math.max(minimumValue, value - step))}
        >
          <Ionicons name="remove" size={16} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.sliderButton}
          onPress={() => onValueChange(Math.min(maximumValue, value + step))}
        >
          <Ionicons name="add" size={16} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 5000000, max: 50000000 });
  const [kilometrageRange, setKilometrageRange] = useState({ min: 0, max: 200000 });
  const [yearRange, setYearRange] = useState({ min: 2010, max: 2025 });
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');

  const brands = [
    'Todas las marcas', 'Toyota', 'BMW', 'Mercedes-Benz', 'Honda', 'Hyundai', 
    'Nissan', 'Volkswagen', 'Mazda', 'Chevrolet', 'Kia', 'Subaru', 'Lexus'
  ];

  const models = [
    'Todos los modelos', 'Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius',
    'Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'
  ];

  const regions = [
    'Todas las regiones', 'Región Metropolitana', 'Valparaíso', 'Biobío', 
    'Araucanía', 'Los Lagos', 'Maule', 'O\'Higgins', 'Antofagasta', 'Atacama'
  ];

  const fuelTypes = [
    'Todos los combustibles', 'Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GNC', 'GLP'
  ];

  const vehicleTypes = [
    'Todos los tipos', 'Sedan', 'Hatchback', 'SUV', 'Pickup', 'Convertible', 'Coupe', 'Wagon'
  ];

  const transmissions = [
    'Todas las transmisiones', 'Manual', 'Automática', 'CVT', 'Semiautomática'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatKilometers = (km: number) => {
    return `${km.toLocaleString('es-CL')} km`;
  };

  const handleSearch = () => {
    const searchParams = {
      searchText,
      selectedBrand,
      selectedModel,
      priceRange,
      kilometrageRange,
      yearRange,
      selectedRegion,
      selectedFuel,
      selectedVehicleType,
      selectedTransmission
    };
    console.log('Búsqueda realizada:', searchParams);
    // Aquí implementarías la lógica de búsqueda
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedBrand('');
    setSelectedModel('');
    setPriceRange({ min: 5000000, max: 50000000 });
    setKilometrageRange({ min: 0, max: 200000 });
    setYearRange({ min: 2010, max: 2025 });
    setSelectedRegion('');
    setSelectedFuel('');
    setSelectedVehicleType('');
    setSelectedTransmission('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Barra de búsqueda estilo Facebook */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#65676B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="¿Qué auto estás buscando?"
              placeholderTextColor="#65676B"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchText.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#65676B" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Filtros principales */}
      <View style={styles.filtersContainer}>
        <Text style={styles.sectionTitle}>Filtros de búsqueda</Text>
        
        {/* Dropdowns de marca y modelo */}
        <View style={styles.dropdownSection}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Marca</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedBrand}
                onValueChange={setSelectedBrand}
                style={styles.picker}
              >
                {brands.map((brand, index) => (
                  <Picker.Item key={index} label={brand} value={brand} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Modelo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedModel}
                onValueChange={setSelectedModel}
                style={styles.picker}
              >
                {models.map((model, index) => (
                  <Picker.Item key={index} label={model} value={model} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Rangos de valores */}
        <View style={styles.slidersSection}>
          {/* Precio */}
          <View style={styles.rangeContainer}>
            <Text style={styles.rangeTitle}>Precio</Text>
            <View style={styles.rangeValues}>
              <Text style={styles.rangeValueText}>Desde: {formatCurrency(priceRange.min)}</Text>
              <Text style={styles.rangeValueText}>Hasta: {formatCurrency(priceRange.max)}</Text>
            </View>
            <Text style={styles.rangeSubtitle}>Mínimo</Text>
            <CustomSlider
              value={priceRange.min}
              onValueChange={(value) => setPriceRange(prev => ({ ...prev, min: value }))}
              minimumValue={1000000}
              maximumValue={priceRange.max - 500000}
              step={500000}
            />
            <Text style={styles.rangeSubtitle}>Máximo</Text>
            <CustomSlider
              value={priceRange.max}
              onValueChange={(value) => setPriceRange(prev => ({ ...prev, max: value }))}
              minimumValue={priceRange.min + 500000}
              maximumValue={100000000}
              step={500000}
            />
          </View>

          {/* Kilometraje */}
          <View style={styles.rangeContainer}>
            <Text style={styles.rangeTitle}>Kilometraje</Text>
            <View style={styles.rangeValues}>
              <Text style={styles.rangeValueText}>Desde: {formatKilometers(kilometrageRange.min)}</Text>
              <Text style={styles.rangeValueText}>Hasta: {formatKilometers(kilometrageRange.max)}</Text>
            </View>
            <Text style={styles.rangeSubtitle}>Mínimo</Text>
            <CustomSlider
              value={kilometrageRange.min}
              onValueChange={(value) => setKilometrageRange(prev => ({ ...prev, min: value }))}
              minimumValue={0}
              maximumValue={kilometrageRange.max - 5000}
              step={5000}
            />
            <Text style={styles.rangeSubtitle}>Máximo</Text>
            <CustomSlider
              value={kilometrageRange.max}
              onValueChange={(value) => setKilometrageRange(prev => ({ ...prev, max: value }))}
              minimumValue={kilometrageRange.min + 5000}
              maximumValue={300000}
              step={5000}
            />
          </View>

          {/* Año */}
          <View style={styles.rangeContainer}>
            <Text style={styles.rangeTitle}>Año</Text>
            <View style={styles.rangeValues}>
              <Text style={styles.rangeValueText}>Desde: {yearRange.min}</Text>
              <Text style={styles.rangeValueText}>Hasta: {yearRange.max}</Text>
            </View>
            <Text style={styles.rangeSubtitle}>Mínimo</Text>
            <CustomSlider
              value={yearRange.min}
              onValueChange={(value) => setYearRange(prev => ({ ...prev, min: value }))}
              minimumValue={2000}
              maximumValue={yearRange.max - 1}
              step={1}
            />
            <Text style={styles.rangeSubtitle}>Máximo</Text>
            <CustomSlider
              value={yearRange.max}
              onValueChange={(value) => setYearRange(prev => ({ ...prev, max: value }))}
              minimumValue={yearRange.min + 1}
              maximumValue={2025}
              step={1}
            />
          </View>
        </View>

        {/* Filtros adicionales en dos columnas */}
        <View style={styles.additionalFiltersSection}>
          <View style={styles.filtersRow}>
            <View style={styles.filterColumn}>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Región</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedRegion}
                    onValueChange={setSelectedRegion}
                    style={styles.picker}
                  >
                    {regions.map((region, index) => (
                      <Picker.Item key={index} label={region} value={region} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Combustible</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedFuel}
                    onValueChange={setSelectedFuel}
                    style={styles.picker}
                  >
                    {fuelTypes.map((fuel, index) => (
                      <Picker.Item key={index} label={fuel} value={fuel} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.filterColumn}>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Tipo de vehículo</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedVehicleType}
                    onValueChange={setSelectedVehicleType}
                    style={styles.picker}
                  >
                    {vehicleTypes.map((type, index) => (
                      <Picker.Item key={index} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Transmisión</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedTransmission}
                    onValueChange={setSelectedTransmission}
                    style={styles.picker}
                  >
                    {transmissions.map((transmission, index) => (
                      <Picker.Item key={index} label={transmission} value={transmission} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
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
  searchHeader: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1E21',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 20,
  },
  dropdownSection: {
    marginBottom: 24,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  picker: {
    height: 50,
    color: '#1C1E21',
  },
  slidersSection: {
    marginBottom: 24,
  },
  rangeContainer: {
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E6EA',
  },
  rangeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 12,
  },
  rangeValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rangeValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  rangeSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#65676B',
    marginTop: 12,
    marginBottom: 6,
  },
  customSlider: {
    marginVertical: 8,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E4E6EA',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 8,
  },
  sliderProgress: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    backgroundColor: '#4CAF50',
    borderRadius: 9,
    marginLeft: -9,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sliderControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  additionalFiltersSection: {
    marginBottom: 24,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 16,
  },
  filterColumn: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  clearFiltersButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
