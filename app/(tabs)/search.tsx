import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useHeader } from '../../contexts/HeaderContext';

const { width } = Dimensions.get('window');

// Tipos para mejor tipado
interface SearchFilters {
  query: string;
  brand: string;
  model: string;
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
  mileageMin: number;
  mileageMax: number;
  region: string;
  fuel: string;
  transmission: string;
  bodyType: string;
}

interface VehicleResult {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  location: string;
  image?: string;
}

// Componente de slider mejorado
const RangeSlider = ({ 
  label,
  value, 
  onValueChange, 
  minimumValue, 
  maximumValue, 
  step = 1,
  formatValue = (val: number) => val.toString()
}: {
  label: string;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  formatValue?: (val: number) => string;
}) => {
  const [minValue, maxValue] = value;
  
  return (
    <View style={styles.rangeSliderContainer}>
      <Text style={styles.rangeSliderLabel}>{label}</Text>
      <View style={styles.rangeValues}>
        <Text style={styles.rangeValueText}>{formatValue(minValue)}</Text>
        <Text style={styles.rangeValueText}>{formatValue(maxValue)}</Text>
      </View>
      <View style={styles.sliderInputContainer}>
        <View style={styles.sliderInputWrapper}>
          <Text style={styles.sliderInputLabel}>Mín</Text>
          <TextInput
            style={styles.sliderInput}
            value={minValue.toString()}
            onChangeText={(text) => {
              const numValue = parseInt(text) || minimumValue;
              if (numValue >= minimumValue && numValue < maxValue) {
                onValueChange([numValue, maxValue]);
              }
            }}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.sliderInputWrapper}>
          <Text style={styles.sliderInputLabel}>Máx</Text>
          <TextInput
            style={styles.sliderInput}
            value={maxValue.toString()}
            onChangeText={(text) => {
              const numValue = parseInt(text) || maximumValue;
              if (numValue <= maximumValue && numValue > minValue) {
                onValueChange([minValue, numValue]);
              }
            }}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};

export default function Search() {
  const { hideHeader, showHeader } = useHeader();
  const router = useRouter();
  
  // Estados principales
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<VehicleResult[]>([]);

  // Ocultar header cuando la pantalla esté enfocada y mostrarlo cuando se desenfoque
  useFocusEffect(
    useCallback(() => {
      // Cuando la pantalla se enfoca (se abre)
      hideHeader();
      
      // Cuando la pantalla se desenfoca (se cierra o navega a otra)
      return () => {
        showHeader();
      };
    }, [hideHeader, showHeader])
  );

  // Función para volver atrás
  const handleGoBack = () => {
    showHeader(); // Mostrar header antes de navegar
    router.back();
  };
  
  // Estados de filtros
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    brand: '',
    model: '',
    priceMin: 5000000,
    priceMax: 50000000,
    yearMin: 2010,
    yearMax: 2025,
    mileageMin: 0,
    mileageMax: 200000,
    region: '',
    fuel: '',
    transmission: '',
    bodyType: ''
  });



  // Datos estáticos
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

  const bodyTypes = [
    'Todos los tipos', 'Sedan', 'Hatchback', 'SUV', 'Pickup', 'Convertible', 'Coupe', 'Wagon'
  ];

  const transmissions = [
    'Todas las transmisiones', 'Manual', 'Automática', 'CVT', 'Semiautomática'
  ];

  // Funciones auxiliares
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  const formatKilometers = useCallback((km: number) => {
    return `${km.toLocaleString('es-CL')} km`;
  }, []);

  // Manejadores de eventos
  const handleSearch = useCallback(async () => {
    try {
      // Simular búsqueda
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Resultados simulados
      const mockResults: VehicleResult[] = [
        {
          id: '1',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2022,
          price: 18500000,
          mileage: 25000,
          fuel: 'Gasolina',
          transmission: 'Automática',
          location: 'Santiago, RM'
        },
        {
          id: '2',
          brand: 'Honda',
          model: 'Civic',
          year: 2021,
          price: 17200000,
          mileage: 35000,
          fuel: 'Gasolina',
          transmission: 'Manual',
          location: 'Valparaíso, V'
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al realizar la búsqueda');
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      brand: '',
      model: '',
      priceMin: 5000000,
      priceMax: 50000000,
      yearMin: 2010,
      yearMax: 2025,
      mileageMin: 0,
      mileageMax: 200000,
      region: '',
      fuel: '',
      transmission: '',
      bodyType: ''
    });
    setSearchQuery('');
  }, []);

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Renderizar resultado de búsqueda
  const renderSearchResult = ({ item }: { item: VehicleResult }) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{item.brand} {item.model}</Text>
        <Text style={styles.resultPrice}>{formatCurrency(item.price)}</Text>
      </View>
      <View style={styles.resultDetails}>
        <Text style={styles.resultDetail}>Año: {item.year}</Text>
        <Text style={styles.resultDetail}>Km: {formatKilometers(item.mileage)}</Text>
        <Text style={styles.resultDetail}>{item.fuel} | {item.transmission}</Text>
        <Text style={styles.resultLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header de búsqueda */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBarContainer}>
          {/* Botón de volver atrás */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#65676B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar marca, modelo o características..."
              placeholderTextColor="#65676B"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#65676B" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.filterToggleButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons 
              name={showFilters ? "close" : "options"} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Panel de filtros expandible */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            <Text style={styles.filtersPanelTitle}>Filtros avanzados</Text>
            
            {/* Marca y Modelo */}
            <View style={styles.filterRow}>
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Marca</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filters.brand}
                    onValueChange={(value) => updateFilter('brand', value)}
                    style={styles.picker}
                  >
                    {brands.map((brand, index) => (
                      <Picker.Item key={index} label={brand} value={brand} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Modelo</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filters.model}
                    onValueChange={(value) => updateFilter('model', value)}
                    style={styles.picker}
                  >
                    {models.map((model, index) => (
                      <Picker.Item key={index} label={model} value={model} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Rango de precio */}
            <RangeSlider
              label="Precio"
              value={[filters.priceMin, filters.priceMax]}
              onValueChange={([min, max]) => {
                updateFilter('priceMin', min);
                updateFilter('priceMax', max);
              }}
              minimumValue={1000000}
              maximumValue={100000000}
              step={500000}
              formatValue={formatCurrency}
            />

            {/* Rango de año */}
            <RangeSlider
              label="Año"
              value={[filters.yearMin, filters.yearMax]}
              onValueChange={([min, max]) => {
                updateFilter('yearMin', min);
                updateFilter('yearMax', max);
              }}
              minimumValue={2000}
              maximumValue={2025}
              step={1}
            />

            {/* Rango de kilometraje */}
            <RangeSlider
              label="Kilometraje"
              value={[filters.mileageMin, filters.mileageMax]}
              onValueChange={([min, max]) => {
                updateFilter('mileageMin', min);
                updateFilter('mileageMax', max);
              }}
              minimumValue={0}
              maximumValue={300000}
              step={5000}
              formatValue={formatKilometers}
            />

            {/* Otros filtros */}
            <View style={styles.filterRow}>
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Región</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filters.region}
                    onValueChange={(value) => updateFilter('region', value)}
                    style={styles.picker}
                  >
                    {regions.map((region, index) => (
                      <Picker.Item key={index} label={region} value={region} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Combustible</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filters.fuel}
                    onValueChange={(value) => updateFilter('fuel', value)}
                    style={styles.picker}
                  >
                    {fuelTypes.map((fuel, index) => (
                      <Picker.Item key={index} label={fuel} value={fuel} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>Limpiar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={handleSearch}
              >
                <Text style={styles.applyFiltersText}>Aplicar filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {searchResults.length} vehículos encontrados
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchHeader: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Más padding top ya que no hay header del layout
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  filterToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  filtersPanelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  filterHalf: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#1C1E21',
  },
  rangeSliderContainer: {
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E6EA',
  },
  rangeSliderLabel: {
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
  sliderInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sliderInputWrapper: {
    flex: 1,
  },
  sliderInputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#65676B',
    marginBottom: 4,
  },
  sliderInput: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#1C1E21',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  clearFiltersButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFiltersText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyFiltersText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    flex: 1,
  },
  resultPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  resultDetails: {
    gap: 4,
  },
  resultDetail: {
    fontSize: 14,
    color: '#65676B',
  },
  resultLocation: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 4,
  },
});
