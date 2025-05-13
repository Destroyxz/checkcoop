import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class editProfService {

private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para actualizar el perfil del usuario
  updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-profile`, formData);
  }
}
