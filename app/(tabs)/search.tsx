import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useHeader } from '../../contexts/HeaderContext';
import apiService from '../../services/apiService';

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
  images?: string[];
  videoUrl?: string;
  videos?: string[];
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
  const searchInputRef = useRef<TextInput>(null);
  
  // Estados principales
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<VehicleResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Toyota Corolla',
    'Honda Civic 2020',
    'BMW X3',
    'Hyundai Tucson',
    'Nissan Sentra'
  ]);
  const [showRecentSearches, setShowRecentSearches] = useState(true);

  // Estados para dropdowns
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showTransmissionDropdown, setShowTransmissionDropdown] = useState(false);

  // Ocultar header cuando la pantalla esté enfocada y mostrarlo cuando se desenfoque
  useFocusEffect(
    useCallback(() => {
      // Cuando la pantalla se enfoca (se abre)
      hideHeader();
      
      // Resetear todo el estado de búsqueda
      setSearchQuery('');
      setSearchResults([]);
      setShowRecentSearches(true);
      setShowFilters(false);
      
      // Cerrar todos los dropdowns
      setShowBrandDropdown(false);
      setShowModelDropdown(false);
      setShowRegionDropdown(false);
      setShowFuelDropdown(false);
      setShowTransmissionDropdown(false);
      
      // Resetear filtros
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
      
      // Enfocar automáticamente el campo de búsqueda con un pequeño delay
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      
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

  const transmissionTypes = [
    { id: '', name: 'Todas las transmisiones' },
    { id: 'Manual', name: 'Manual' },
    { id: 'Automática', name: 'Automática' },
    { id: 'CVT', name: 'CVT' },
    { id: 'Semiautomática', name: 'Semiautomática' },
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

  // Función para obtener el primer medio disponible (video primero, luego imagen)
  const getFirstMedia = useCallback((item: VehicleResult): { type: 'video' | 'image' | null; uri: string } => {
    // Prioridad 1: videoUrl (legacy)
    if (item.videoUrl && typeof item.videoUrl === 'string') {
      return { type: 'video', uri: item.videoUrl };
    }
    
    // Prioridad 2: primer video del array
    if (item.videos && Array.isArray(item.videos) && item.videos.length > 0) {
      return { type: 'video', uri: item.videos[0] };
    }
    
    // Prioridad 3: primer imagen del array
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return { type: 'image', uri: item.images[0] };
    }
    
    // Sin medios disponibles
    return { type: null, uri: '' };
  }, []);

  // Manejadores de eventos
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() && !filters.brand && !filters.fuel && !filters.transmission) {
      // Si no hay ningún criterio de búsqueda, no hacer nada
      return;
    }
    
    if (searchQuery.trim()) {
      // Agregar a búsquedas recientes
      setRecentSearches(prev => {
        const newSearches = [searchQuery, ...prev.filter(s => s !== searchQuery)];
        return newSearches.slice(0, 5); // Mantener solo las últimas 5
      });
    }
    
    // Siempre ocultar búsquedas recientes al realizar búsqueda
    setShowRecentSearches(false);
    setIsSearching(true);
    
    try {
      let results: VehicleResult[] = [];

      // Determinar si usar búsqueda simple o con filtros
      const hasFilters = filters.brand || filters.fuel || filters.transmission || 
                        filters.priceMin !== 5000000 || filters.priceMax !== 50000000 ||
                        filters.yearMin !== 2010 || filters.yearMax !== 2025 ||
                        filters.mileageMin !== 0 || filters.mileageMax !== 200000;

      if (hasFilters || showFilters) {
        // Búsqueda con filtros avanzados
        const vehicles = await apiService.searchVehiclesWithFilters({
          query: searchQuery.trim() || undefined,
          brand: filters.brand || undefined,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          yearMin: filters.yearMin,
          yearMax: filters.yearMax,
          kilometersMin: filters.mileageMin,
          kilometersMax: filters.mileageMax,
          fuelType: filters.fuel || undefined,
          transmission: filters.transmission || undefined,
          location: filters.region || undefined,
        });

        results = vehicles.map((vehicle: any) => ({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          mileage: vehicle.kilometers,
          fuel: vehicle.fuelType,
          transmission: vehicle.transmission,
          location: vehicle.location || 'No especificada',
          image: vehicle.images?.[0],
          videoUrl: vehicle.videoUrl,
        }));
      } else if (searchQuery.trim()) {
        // Búsqueda simple por texto
        const vehicles = await apiService.searchVehiclesByQuery(searchQuery.trim());
        
        results = vehicles.map((vehicle: any) => ({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          mileage: vehicle.kilometers,
          fuel: vehicle.fuelType,
          transmission: vehicle.transmission,
          location: vehicle.location || 'No especificada',
          image: vehicle.images?.[0],
          videoUrl: vehicle.videoUrl,
        }));
      }
      
      setSearchResults(results);
      
      if (results.length === 0) {
        Alert.alert('Sin resultados', 'No se encontraron vehículos que coincidan con tu búsqueda.');
      }
    } catch (error) {
      console.error('Error al realizar búsqueda:', error);
      Alert.alert('Error', 'Hubo un problema al realizar la búsqueda. Por favor intenta nuevamente.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filters, showFilters]);

  const handleRecentSearchPress = useCallback((searchTerm: string) => {
    setSearchQuery(searchTerm);
    setShowRecentSearches(false);
    // Ejecutar búsqueda automáticamente
    setTimeout(() => {
      handleSearch();
    }, 100);
  }, [handleSearch]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
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
    setShowRecentSearches(true);
    // No limpiar los resultados, solo los filtros
  }, []);

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Renderizar resultado de búsqueda
  const renderSearchResult = ({ item }: { item: VehicleResult }) => (
    <TouchableOpacity 
      style={styles.resultCard} 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/car-detail-by-searchbar',
        params: {
          vehicleId: item.id,
          brand: item.brand,
          model: item.model,
          year: item.year.toString(),
          price: item.price.toString(),
          mileage: item.mileage.toString(),
          fuel: item.fuel,
          transmission: item.transmission,
          location: item.location,
        }
      })}
    >
      {/* Video o imagen del vehículo */}
      <View style={styles.vehicleMediaContainer}>
        {(() => {
          const firstMedia = getFirstMedia(item);
          
          if (firstMedia.type === 'video') {
            return (
              <>
                <Video
                  source={{ uri: firstMedia.uri }}
                  style={styles.vehicleVideo}
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  shouldPlay={true}
                  isMuted={true}
                />
                <View style={styles.videoIconOverlay}>
                  <Ionicons name="play-circle" size={30} color="#FFFFFF" />
                </View>
              </>
            );
          } else if (firstMedia.type === 'image') {
            return (
              <>
                <Image
                  source={{ uri: firstMedia.uri }}
                  style={styles.vehicleVideo}
                  resizeMode="cover"
                />
                <View style={styles.videoIconOverlay}>
                  <Ionicons name="images" size={30} color="#FFFFFF" />
                </View>
              </>
            );
          } else {
            return (
              <View style={styles.placeholderMedia}>
                <Ionicons name="car-sport" size={50} color="#999" />
              </View>
            );
          }
        })()}
      </View>

      <View style={styles.resultHeader}>
        <View style={styles.resultMainInfo}>
          <Text style={styles.resultPlate}>{item.brand} {item.model}</Text>
          <Text style={styles.resultModel} numberOfLines={2}>{item.year}</Text>
        </View>
        <View style={styles.resultPriceBadge}>
          <Text style={styles.resultPriceText}>{formatCurrency(item.price)}</Text>
        </View>
      </View>
      
      <View style={styles.resultDetails}>
        <View style={styles.resultDetailRow}>
          <Ionicons name="speedometer" size={14} color="#65676B" />
          <Text style={styles.resultDetailText} numberOfLines={1}>{formatKilometers(item.mileage)}</Text>
        </View>
        <View style={styles.resultDetailRow}>
          <Ionicons name="flash" size={14} color="#65676B" />
          <Text style={styles.resultDetailText}>{item.fuel} | {item.transmission}</Text>
        </View>
        <View style={styles.resultDetailRow}>
          <Ionicons name="location" size={14} color="#65676B" />
          <Text style={styles.resultDetailText} numberOfLines={1}>{item.location}</Text>
        </View>
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
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Buscar marca, modelo o características..."
              placeholderTextColor="#65676B"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                // Solo mostrar búsquedas recientes si no hay resultados y el campo está vacío
                setShowRecentSearches(text.length === 0 && searchResults.length === 0);
              }}
              onFocus={() => setShowRecentSearches(searchQuery.length === 0 && searchResults.length === 0)}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  // Solo mostrar búsquedas recientes si no hay resultados
                  setShowRecentSearches(searchResults.length === 0);
                }}
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
        {/* Búsquedas recientes */}
        {showRecentSearches && recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            <View style={styles.recentSearchesHeader}>
              <Text style={styles.recentSearchesTitle}>Reciente</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.clearRecentText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            
            {recentSearches.map((searchTerm, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
                onPress={() => handleRecentSearchPress(searchTerm)}
                activeOpacity={0.7}
              >
                <Ionicons name="time" size={16} color="#65676B" />
                <Text style={styles.recentSearchText}>{searchTerm}</Text>
                <Ionicons name="arrow-up-outline" size={16} color="#65676B" style={styles.recentSearchIcon} />
              </TouchableOpacity>
            ))}
          </View>
        )}

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

            {/* Transmisión */}
            <View style={styles.filterRow}>
              <View style={styles.filterFull}>
                <Text style={styles.filterLabel}>Transmisión</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowTransmissionDropdown(!showTransmissionDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !filters.transmission && styles.placeholderText]}>
                    {filters.transmission ? transmissionTypes.find(t => t.id === filters.transmission)?.name : 'Selecciona transmisión'}
                  </Text>
                  <Ionicons 
                    name={showTransmissionDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
                
                {showTransmissionDropdown && (
                  <View style={styles.dropdownMenu}>
                    {transmissionTypes.map((transmission) => (
                      <TouchableOpacity
                        key={transmission.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          updateFilter('transmission', transmission.id);
                          setShowTransmissionDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>{transmission.name}</Text>
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
                onPress={() => router.push('/search-detail')}
              >
                <Text style={styles.applyFiltersText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Indicador de carga */}
        {isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Buscando vehículos...</Text>
          </View>
        )}

        {/* Resultados de búsqueda */}
        {!isSearching && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {searchResults.length} vehículos encontrados
              </Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Ordenar</Text>
                <Ionicons name="chevron-down" size={16} color="#1976D2" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
              numColumns={2}
              columnWrapperStyle={styles.resultsRow}
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
  filterFull: {
    width: '100%',
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
    paddingTop: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
    paddingTop: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  resultsList: {
    paddingTop: 8,
  },
  resultsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    width: '48%', // Para mostrar 2 cards por fila
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultMainInfo: {
    flex: 1,
  },
  resultPlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 2,
  },
  resultModel: {
    fontSize: 12,
    color: '#65676B',
  },
  resultPriceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: '#4CAF50',
  },
  resultPriceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultDetails: {
    gap: 6,
  },
  resultDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultDetailText: {
    fontSize: 12,
    color: '#65676B',
    flex: 1,
  },
  // Estilos para imagen del vehículo
  vehicleImageContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E4E6EA',
  },
  vehicleImageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 6,
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
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
  // Estilos para búsquedas recientes
  recentSearchesContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
  },
  clearRecentText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  recentSearchText: {
    flex: 1,
    fontSize: 15,
    color: '#1C1E21',
    marginLeft: 12,
  },
  recentSearchIcon: {
    transform: [{ rotate: '45deg' }],
  },
  // Estilos para loading
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#65676B',
  },
  // Estilos para media (video/imagen)
  vehicleMediaContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  vehicleVideo: {
    width: '100%',
    height: '100%',
  },
  placeholderMedia: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIconOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 6,
  },
});
