import { Ionicons } from '@expo/vector-icons';
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

  // Estados para dropdowns
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);

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
    { id: '', name: 'Todas las marcas' },
    { id: 'toyota', name: 'Toyota' },
    { id: 'bmw', name: 'BMW' },
    { id: 'mercedes', name: 'Mercedes-Benz' },
    { id: 'honda', name: 'Honda' },
    { id: 'hyundai', name: 'Hyundai' },
    { id: 'nissan', name: 'Nissan' },
    { id: 'volkswagen', name: 'Volkswagen' },
    { id: 'mazda', name: 'Mazda' },
    { id: 'chevrolet', name: 'Chevrolet' },
    { id: 'kia', name: 'Kia' },
    { id: 'subaru', name: 'Subaru' },
    { id: 'lexus', name: 'Lexus' },
    { id: 'audi', name: 'Audi' },
    { id: 'ford', name: 'Ford' },
    { id: 'peugeot', name: 'Peugeot' },
    { id: 'renault', name: 'Renault' },
    { id: 'mitsubishi', name: 'Mitsubishi' },
  ];

  const models = [
    { id: '', name: 'Todos los modelos' },
    { id: 'corolla', name: 'Corolla' },
    { id: 'camry', name: 'Camry' },
    { id: 'rav4', name: 'RAV4' },
    { id: 'highlander', name: 'Highlander' },
    { id: 'prius', name: 'Prius' },
    { id: 'civic', name: 'Civic' },
    { id: 'accord', name: 'Accord' },
    { id: 'crv', name: 'CR-V' },
    { id: 'pilot', name: 'Pilot' },
    { id: 'fit', name: 'Fit' },
    { id: 'x1', name: 'X1' },
    { id: 'x3', name: 'X3' },
    { id: 'serie3', name: 'Serie 3' },
    { id: 'clase_c', name: 'Clase C' },
    { id: 'clase_e', name: 'Clase E' },
    { id: 'elantra', name: 'Elantra' },
    { id: 'tucson', name: 'Tucson' },
    { id: 'santa_fe', name: 'Santa Fe' },
  ];

  const regions = [
    { id: '', name: 'Todas las regiones' },
    { id: 'rm', name: 'Región Metropolitana' },
    { id: 'valparaiso', name: 'Valparaíso' },
    { id: 'biobio', name: 'Biobío' },
    { id: 'araucania', name: 'Araucanía' },
    { id: 'los_lagos', name: 'Los Lagos' },
    { id: 'maule', name: 'Maule' },
    { id: 'ohiggins', name: 'O\'Higgins' },
    { id: 'antofagasta', name: 'Antofagasta' },
    { id: 'atacama', name: 'Atacama' },
    { id: 'coquimbo', name: 'Coquimbo' },
    { id: 'los_rios', name: 'Los Ríos' },
    { id: 'aysen', name: 'Aysén' },
    { id: 'magallanes', name: 'Magallanes' },
    { id: 'arica', name: 'Arica y Parinacota' },
    { id: 'tarapaca', name: 'Tarapacá' },
  ];

  const fuelTypes = [
    { id: '', name: 'Todos los combustibles' },
    { id: 'gasolina', name: 'Gasolina' },
    { id: 'diesel', name: 'Diésel' },
    { id: 'hibrido', name: 'Híbrido' },
    { id: 'electrico', name: 'Eléctrico' },
    { id: 'gnc', name: 'GNC (Gas Natural)' },
    { id: 'glp', name: 'GLP (Gas Licuado)' },
    { id: 'hibrido_enchufable', name: 'Híbrido Enchufable' },
    { id: 'gasolina_etanol', name: 'Gasolina + Etanol' },
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
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowBrandDropdown(!showBrandDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !filters.brand && styles.placeholderText]}>
                    {filters.brand ? brands.find(brand => brand.id === filters.brand)?.name : 'Selecciona una marca'}
                  </Text>
                  <Ionicons 
                    name={showBrandDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
                
                {showBrandDropdown && (
                  <View style={styles.dropdownMenu}>
                    {brands.map((brand) => (
                      <TouchableOpacity
                        key={brand.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          updateFilter('brand', brand.id);
                          setShowBrandDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>{brand.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Modelo</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowModelDropdown(!showModelDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !filters.model && styles.placeholderText]}>
                    {filters.model ? models.find(model => model.id === filters.model)?.name : 'Selecciona un modelo'}
                  </Text>
                  <Ionicons 
                    name={showModelDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
                
                {showModelDropdown && (
                  <View style={styles.dropdownMenu}>
                    {models.map((model) => (
                      <TouchableOpacity
                        key={model.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          updateFilter('model', model.id);
                          setShowModelDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>{model.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowRegionDropdown(!showRegionDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !filters.region && styles.placeholderText]}>
                    {filters.region ? regions.find(region => region.id === filters.region)?.name : 'Selecciona una región'}
                  </Text>
                  <Ionicons 
                    name={showRegionDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
                
                {showRegionDropdown && (
                  <View style={styles.dropdownMenu}>
                    {regions.map((region) => (
                      <TouchableOpacity
                        key={region.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          updateFilter('region', region.id);
                          setShowRegionDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>{region.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              <View style={styles.filterHalf}>
                <Text style={styles.filterLabel}>Combustible</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowFuelDropdown(!showFuelDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !filters.fuel && styles.placeholderText]}>
                    {filters.fuel ? fuelTypes.find(fuel => fuel.id === filters.fuel)?.name : 'Selecciona combustible'}
                  </Text>
                  <Ionicons 
                    name={showFuelDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
                
                {showFuelDropdown && (
                  <View style={styles.dropdownMenu}>
                    {fuelTypes.map((fuel) => (
                      <TouchableOpacity
                        key={fuel.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          updateFilter('fuel', fuel.id);
                          setShowFuelDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>{fuel.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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
  // Estilos para dropdown
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1C1E21',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#E4E6EA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1C1E21',
  },
});
