import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API URL dinámica según la plataforma
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000/api'
  : 'http://192.168.0.19:3000/api';

interface RegisterData {
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

class AuthService {
  private tokenKey = '@autobox_token';
  private userKey = '@autobox_user';

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Manejar errores del backend (validaciones)
        const errorMessage = Array.isArray(result.message)
          ? result.message.join('\n')
          : result.message || 'Error al crear la cuenta';
        throw new Error(errorMessage);
      }

      // Guardar token y usuario en AsyncStorage
      await this.saveAuth(result.accessToken, result.user);

      return result;
    } catch (error: any) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(result.message)
          ? result.message.join('\n')
          : result.message || 'Credenciales inválidas';
        throw new Error(errorMessage);
      }

      // Guardar token y usuario en AsyncStorage
      await this.saveAuth(result.accessToken, result.user);

      return result;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.tokenKey, this.userKey]);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async saveAuth(token: string, user: User): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.tokenKey, token],
        [this.userKey, JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('Error al guardar autenticación:', error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.userKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
}

export default new AuthService();
