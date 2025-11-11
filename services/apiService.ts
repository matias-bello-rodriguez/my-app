import { Platform } from 'react-native';
import authService from './authService';

// API URL dinámica según la plataforma
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000/api'
  : 'http://192.168.0.19:3000/api';

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  description?: string;
  location?: string;
  images?: string[];
  status?: string;
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface Inspection {
  id: string;
  inspectionNumber: string;
  vehicleId: string;
  userId: string;
  inspectionDate: string;
  inspectionTime: string;
  autoboxLocation: string;
  status: string;
  price: number;
  vehicle?: Vehicle;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async fetch(endpoint: string, options?: RequestInit) {
    try {
      const token = await authService.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      };

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la petición');
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener vehículos del usuario autenticado
  async getMyVehicles(): Promise<Vehicle[]> {
    try {
      const user = await authService.getUser();
      if (!user) return [];
      
      return await this.fetch(`/vehicles/owner/${user.id}`);
    } catch (error) {
      console.error('Error al obtener mis vehículos:', error);
      return [];
    }
  }

  // Obtener todos los vehículos
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      return await this.fetch('/vehicles');
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      return [];
    }
  }

  // Buscar vehículos
  async searchVehicles(query: string): Promise<Vehicle[]> {
    try {
      return await this.fetch(`/vehicles/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error al buscar vehículos:', error);
      return [];
    }
  }

  // Obtener vehículos con inspección mecánica
  async getInspectedVehicles(): Promise<Vehicle[]> {
    try {
      // Por ahora retorna todos los vehículos, luego se puede filtrar por inspección
      const vehicles = await this.getAllVehicles();
      return vehicles.filter((v: any) => v.hasInspection); // Filtrar si existe el campo
    } catch (error) {
      console.error('Error al obtener vehículos inspeccionados:', error);
      return [];
    }
  }

  // Obtener vehículos recientes (últimos 10)
  async getLatestVehicles(): Promise<Vehicle[]> {
    try {
      const vehicles = await this.getAllVehicles();
      return vehicles
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error al obtener vehículos recientes:', error);
      return [];
    }
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      return await authService.getUser();
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  // Obtener perfil completo desde el backend
  async getProfile(): Promise<any> {
    try {
      return await this.fetch('/auth/profile');
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(userId: string, data: any): Promise<any> {
    try {
      const response = await this.fetch(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      // Actualizar usuario en AsyncStorage si es exitoso
      const user = await authService.getUser();
      if (user) {
        const updatedUser = { ...user, ...data };
        await authService.updateUser(updatedUser);
      }

      return response;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  // Crear vehículo
  async createVehicle(vehicleData: any): Promise<Vehicle> {
    try {
      const user = await authService.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const data = {
        ...vehicleData,
        ownerId: user.id,
      };

      return await this.fetch('/vehicles', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      throw error;
    }
  }

  // Obtener vehículo por ID
  async getVehicleById(id: string): Promise<Vehicle> {
    try {
      return await this.fetch(`/vehicles/${id}`);
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw error;
    }
  }

  // Actualizar vehículo
  async updateVehicle(id: string, data: any): Promise<Vehicle> {
    try {
      return await this.fetch(`/vehicles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      throw error;
    }
  }

  // Eliminar vehículo
  async deleteVehicle(id: string): Promise<void> {
    try {
      await this.fetch(`/vehicles/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      throw error;
    }
  }

  // Obtener marcas únicas de vehículos
  async getBrands(): Promise<string[]> {
    try {
      const vehicles = await this.getAllVehicles();
      const brands = [...new Set(vehicles.map((v: Vehicle) => v.brand))];
      return brands.sort();
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      return [];
    }
  }

  // Formatear precio en CLP
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Calcular tiempo transcurrido
  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    if (diffInDays < 30) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `Hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
  }

  // ==================== MÉTODOS DE INSPECCIONES ====================

  // Obtener todas las inspecciones
  async getAllInspections(): Promise<Inspection[]> {
    try {
      return await this.fetch('/inspections');
    } catch (error) {
      console.error('Error al obtener inspecciones:', error);
      return [];
    }
  }

  // Obtener inspecciones por usuario
  async getInspectionsByUser(userId: string): Promise<Inspection[]> {
    try {
      return await this.fetch(`/inspections/user/${userId}`);
    } catch (error) {
      console.error('Error al obtener inspecciones del usuario:', error);
      return [];
    }
  }

  // Obtener inspecciones por vehículo (patente)
  async getInspectionsByVehicle(vehicleId: string): Promise<Inspection[]> {
    try {
      return await this.fetch(`/inspections/vehicle/${vehicleId}`);
    } catch (error) {
      console.error('Error al obtener inspecciones del vehículo:', error);
      return [];
    }
  }

  // Buscar inspecciones por patente de vehículo
  async searchInspectionsByPlate(plate: string): Promise<Inspection[]> {
    try {
      // Primero buscar el vehículo por patente
      const vehicles = await this.searchVehicles(plate);
      if (vehicles.length === 0) {
        return [];
      }

      // Obtener todas las inspecciones de esos vehículos
      const inspectionsPromises = vehicles.map(vehicle => 
        this.getInspectionsByVehicle(vehicle.id)
      );
      const inspectionsArrays = await Promise.all(inspectionsPromises);
      
      // Aplanar el array y agregar información del vehículo
      return inspectionsArrays.flat().map((inspection, index) => ({
        ...inspection,
        vehicle: vehicles[Math.floor(index / vehicles.length)]
      }));
    } catch (error) {
      console.error('Error al buscar inspecciones por patente:', error);
      return [];
    }
  }

  // Obtener inspección por ID
  async getInspectionById(id: string): Promise<Inspection | null> {
    try {
      return await this.fetch(`/inspections/${id}`);
    } catch (error) {
      console.error('Error al obtener inspección:', error);
      return null;
    }
  }

  // Crear nueva inspección
  async createInspection(data: {
    vehicleId: string;
    userId: string;
    inspectionDate: string;
    inspectionTime: string;
    autoboxLocation: string;
    price: number;
  }): Promise<Inspection> {
    try {
      return await this.fetch('/inspections', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error al crear inspección:', error);
      throw error;
    }
  }

  // Actualizar inspección
  async updateInspection(id: string, data: Partial<Inspection>): Promise<Inspection> {
    try {
      return await this.fetch(`/inspections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error al actualizar inspección:', error);
      throw error;
    }
  }

  // Formatear fecha en formato español
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Obtener color según estado de inspección
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'completed': '#4CAF50',
      'pending': '#2196F3',
      'in-progress': '#FF9800',
      'cancelled': '#F44336',
    };
    return statusColors[status.toLowerCase()] || '#8E8E93';
  }

  // Obtener texto en español del estado
  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'completed': 'Completado',
      'pending': 'Pendiente',
      'in-progress': 'En Proceso',
      'cancelled': 'Cancelado',
    };
    return statusTexts[status.toLowerCase()] || status;
  }

  // ==================== MÉTODOS DE BÚSQUEDA ====================

  // Buscar vehículos por texto (marca, modelo, descripción)
  async searchVehiclesByQuery(query: string): Promise<Vehicle[]> {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }
      return await this.fetch(`/search?q=${encodeURIComponent(query.trim())}`);
    } catch (error) {
      console.error('Error al buscar vehículos:', error);
      return [];
    }
  }

  // Buscar vehículos con filtros avanzados
  async searchVehiclesWithFilters(filters: {
    query?: string;
    brand?: string;
    model?: string;
    priceMin?: number;
    priceMax?: number;
    yearMin?: number;
    yearMax?: number;
    kilometersMin?: number;
    kilometersMax?: number;
    fuelType?: string;
    transmission?: string;
    location?: string;
  }): Promise<Vehicle[]> {
    try {
      // Obtener todos los vehículos primero
      let vehicles = await this.getAllVehicles();

      // Aplicar filtros localmente
      if (filters.query && filters.query.trim()) {
        const queryLower = filters.query.toLowerCase();
        vehicles = vehicles.filter(v => 
          v.brand.toLowerCase().includes(queryLower) ||
          v.model.toLowerCase().includes(queryLower) ||
          (v.description && v.description.toLowerCase().includes(queryLower))
        );
      }

      if (filters.brand) {
        vehicles = vehicles.filter(v => 
          v.brand.toLowerCase() === filters.brand!.toLowerCase()
        );
      }

      if (filters.model) {
        vehicles = vehicles.filter(v => 
          v.model.toLowerCase().includes(filters.model!.toLowerCase())
        );
      }

      if (filters.priceMin !== undefined) {
        vehicles = vehicles.filter(v => v.price >= filters.priceMin!);
      }

      if (filters.priceMax !== undefined) {
        vehicles = vehicles.filter(v => v.price <= filters.priceMax!);
      }

      if (filters.yearMin !== undefined) {
        vehicles = vehicles.filter(v => v.year >= filters.yearMin!);
      }

      if (filters.yearMax !== undefined) {
        vehicles = vehicles.filter(v => v.year <= filters.yearMax!);
      }

      if (filters.kilometersMin !== undefined) {
        vehicles = vehicles.filter(v => v.kilometers >= filters.kilometersMin!);
      }

      if (filters.kilometersMax !== undefined) {
        vehicles = vehicles.filter(v => v.kilometers <= filters.kilometersMax!);
      }

      if (filters.fuelType) {
        vehicles = vehicles.filter(v => 
          v.fuelType.toLowerCase() === filters.fuelType!.toLowerCase()
        );
      }

      if (filters.transmission) {
        vehicles = vehicles.filter(v => 
          v.transmission.toLowerCase() === filters.transmission!.toLowerCase()
        );
      }

      if (filters.location) {
        vehicles = vehicles.filter(v => 
          v.location && v.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      return vehicles;
    } catch (error) {
      console.error('Error al buscar vehículos con filtros:', error);
      return [];
    }
  }
}

export default new ApiService();
