// src/app/services/user-storage.service.ts
import { Injectable } from '@angular/core';

export interface UserStorage {
  id: number;
  empresa_id: number;
  exp_Token: number;
  nombre: string;
  apellidos?: string;
  email?: string;
  rol: string;
  hora_inicio_1?: string;
  hora_fin_1?: string;
  hora_inicio_2?: string;
  hora_fin_2?: string;
}


@Injectable({ providedIn: 'root' })
export class UserStorageService {
  private readonly STORAGE_KEY = 'user';

  /** Devuelve el objeto {exp_Token, nombre, rol} o null si no existe / no es JSON válido */
  getUser(): UserStorage | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    //console.log('LocalStorage raw "user":', raw);
    if (!raw) { return null; }
    try {
      return JSON.parse(raw) as UserStorage;
    } catch (e) {
      console.warn('Error parseando JSON de localStorage["user"]:', e);
      return null;
    }
  }

  /** (Opcional) Para guardar o actualizar el usuario */
  setUser(user: UserStorage): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /** (Opcional) Para borrar el usuario (logout) */
  clearUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
