import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private readonly TOKEN_KEY = 'keyAUTH.token_';
  private readonly RTOKEN_KEY = 'keyAUTH.ref.token_';
  private readonly KEY_USER = 'keyUSR.info_';
  pathAuth: string = `${environment.urlApi}/auth`;


  constructor(private router: Router, private http: HttpClient) { }

  saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  saveRefreshToken(refreshToken: string): void {
    sessionStorage.setItem(this.RTOKEN_KEY, refreshToken);
  }

  saveTokenAndRefreshToken(token: string, refreshToken: string): void {
    this.saveToken(token);
    this.saveRefreshToken(refreshToken);
  }

  getToken(): string {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    return token ?? '';
  }

  getRefreshToken(): string {
    const rtoken = sessionStorage.getItem(this.RTOKEN_KEY);
    return rtoken ?? '';
  }

  isLoggedIn(): boolean {
    return (
      sessionStorage.getItem(this.TOKEN_KEY) !== null &&
      sessionStorage.getItem(this.RTOKEN_KEY) !== null
    );
  }

  getTokenUserInfo(): string {
    const usrInfo = sessionStorage.getItem(this.KEY_USER);
    return usrInfo ?? '';
  }

  logout(): void {
    this.http.post(
      `${this.pathAuth}/sesiones/singOff-by-usuario`, {}
    ).subscribe(reponse => {
      sessionStorage.clear();
      window.location.href = '/';
    })
  }

  logoutAdmin(data: { usuario: string }) {
    return this.http.post(
      `${this.pathAuth}/sesiones/logout-admin`, data
    )
  }
}
