import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { ISessionToken } from '../helpers/interfaces/auth.interface';
import {
  ILoginDto,
  ILoginResponseDto,
} from '../helpers/interfaces/login.interface';
import { IResponseRefreshToken } from '../helpers/interfaces/rtoken.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  pathAuth: string = `${environment.urlApi}/auth`;
  pathUser: string = `${environment.urlApi}/administracion/usuario`;

  constructor(private http: HttpClient) {}

  login(body: ILoginDto): Observable<IResponse<ILoginResponseDto>> {
    return this.http.post<IResponse<ILoginResponseDto>>(
      `${this.pathAuth}/login`,
      body
    );
  }

  loginWithToken(body: ISessionToken): Observable<IResponse<any>> {
    return this.http.post<IResponse<string>>(
      `${this.pathAuth}/token/create`,
      body
    );
  }

  refreshToken(
    token: string,
    refreshToken: string
  ): Observable<IResponse<IResponseRefreshToken>> {
    return this.http.post<IResponse<IResponseRefreshToken>>(
      `${this.pathAuth}/token/refresh`,
      {
        token,
        refreshToken,
      }
    );
  }

  getNameUser(id: string): Observable<IResponse<string>> {
    const urlGetNameUser = `${this.pathUser}/find-name/${id}`;
    return this.http.get<IResponse<string>>(urlGetNameUser);
  }

  activateAccount(id: string, body: any) {
    return this.http.post<IResponse<any>>(
      `${this.pathUser}/activate-account/${id}`,
      body
    );
  }

  recoverPassword(body: any) {
    return this.http.post<IResponse<any>>(
      `${this.pathUser}/recover-password`,
      body
    );
  }

  getTimeLogout() {
    return this.http.get(`${this.pathAuth}/sesiones/time-logout`);
  }
}
