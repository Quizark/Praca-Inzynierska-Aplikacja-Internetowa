import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';  // Adres API

  constructor(private http: HttpClient) {}

  homeFetchNotifications(token: string, email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
