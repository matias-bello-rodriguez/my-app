import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
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

        {/* Sliders de rangos */}
        <View style={styles.slidersSection}>
          {/* Precio */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderTitle}>Precio</Text>
            <View style={styles.sliderValues}>
              <Text style={styles.sliderValue}>{formatCurrency(priceRange.min)}</Text>
              <Text style={styles.sliderValue}>{formatCurrency(priceRange.max)}</Text>
            </View>
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={1000000}
                maximumValue={100000000}
                step={500000}
                value={priceRange.min}
                onValueChange={(value: number) => setPriceRange(prev => ({ ...prev, min: value }))}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E4E6EA"
                thumbStyle={styles.sliderThumb}
              />
              <Slider
                style={styles.slider}
                minimumValue={1000000}
                maximumValue={100000000}
                step={500000}
                value={priceRange.max}
                onValueChange={(value: number) => setPriceRange(prev => ({ ...prev, max: value }))}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E4E6EA"
                thumbStyle={styles.sliderThumb}
              />
            </View>
          </View>

          {/* Kilometraje */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderTitle}>Kilometraje</Text>
            <View style={styles.sliderValues}>
              <Text style={styles.sliderValue}>{formatKilometers(kilometrageRange.min)}</Text>
              <Text style={styles.sliderValue}>{formatKilometers(kilometrageRange.max)}</Text>
            </View>
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={300000}
                step={5000}
                value={kilometrageRange.min}
                onValueChange={(value: number) => setKilometrageRange(prev => ({ ...prev, min: value }))}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E4E6EA"
                thumbStyle={styles.sliderThumb}
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={300000}
                step={5000}
                value={kilometrageRange.max}
                onValueChange={(value: number) => setKilometrageRange(prev => ({ ...prev, max: value }))}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E4E6EA"
                thumbStyle={styles.sliderThumb}
              />
            </View>
          </View>

          {/* Año */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderTitle}>Año</Text>
            <View style={styles.sliderValues}>
              <Text style={styles.sliderValue}>{yearRange.min}</Text>
              <Text style={styles.sliderValue}>{yearRange.max}</Text>
            </View>
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={2000}
                maximumValue={2025}
                step={1}
                value={yearRange.min}
                onValueChange={(value: number) => setYearRange(prev => ({ ...prev, min: value }))}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E4E6EA"
                thumbStyle={styles.sliderThumb}
              />
              <Slider
                style={styles.slider}
                minimumValue={2000}
                maximumValue={2025}
                step={1}
                value={yearRange.max}
                onValueChange={(value: number) => setYearRange(prev => ({ ...prev, max: value }))}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E4E6EA"
                thumbStyle={styles.sliderThumb}
              />
            </View>
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
  sliderContainer: {
    marginBottom: 20,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 8,
  },
  sliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  sliderWrapper: {
    marginHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 4,
  },
  sliderThumb: {
    backgroundColor: '#4CAF50',
    width: 20,
    height: 20,
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
