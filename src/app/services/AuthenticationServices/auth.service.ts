import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDTO } from '../../models/LoginRequestDTO';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  sub: string;
  email: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iat: number;
  nbf: number;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "https://localhost:7138/api/Users/login"

  constructor(private http:HttpClient) { }

  login(credentials: LoginRequestDTO): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.baseUrl, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (e) {
      console.error('Invalid JWT:', e);
      return null;
    }
  }

  getUserId(): number | null {
    const payload = this.decodeToken();

    if (!payload) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return null;

    return parseInt(payload.sub);
  }

  getUserRole(): string | null {
    const payload = this.decodeToken();
    return payload ? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
  }

  getUserEmail(): string | null {
    const payload = this.decodeToken();
    return payload?.email || null;
  }

  isLoggedIn(): boolean {
    // const payload = this.decodeToken();
    // if (!payload) return false;

    // const now = Math.floor(Date.now() / 1000);
    // return payload.exp > now;
    const payload = this.decodeToken();
    if (!payload) return false;

    const now = Math.floor(Date.now() / 1000);
    const expired = payload.exp <= now;

    if (expired) this.logout();

    return !expired;
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }
}
