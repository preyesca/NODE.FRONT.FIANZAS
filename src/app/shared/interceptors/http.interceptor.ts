import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { ERefreshTokenStatus } from 'src/app/modules/authentication/helpers/enums/rtoken-estatus.enum';
import { IResponseRefreshToken } from 'src/app/modules/authentication/helpers/interfaces/rtoken.interface';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { IResponse } from '../helpers/interfaces/response';
import { AuthStorageService } from '../services/storage/auth-storage.service';
import { CustomizerSettingsService } from '../services/layout/customizer-settings.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authStorageService: AuthStorageService,
    private authService: AuthService,
    private customSercive: CustomizerSettingsService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.authStorageService.isLoggedIn()) {
      const token = this.authStorageService.getToken();
      request = this.addHeaders(request, token);
      return next.handle(request).pipe(
        catchError((error) => {
          if (error.name === 'HttpErrorResponse' && error.status === 401)
            return this.handle401Unauthorized(token, request, next);
          return throwError(error);
        }),
        finalize(() => {
          this.resetCount(request)
        })
      );
    }
    else{
      return next.handle(request);
    }
  }

  private handle401Unauthorized(
    token: string,
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          const updatedRequest = this.addHeaders(req, token!);
          return next.handle(updatedRequest);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const rtoken = this.authStorageService.getRefreshToken();
      return this.authService.refreshToken(token, rtoken).pipe(
        switchMap((refreshTokenResult: IResponse<IResponseRefreshToken>) => {
          if (refreshTokenResult.data.status === ERefreshTokenStatus.OK) {
            this.isRefreshing = false;
            this.authStorageService.saveToken(refreshTokenResult.data.token!);
            return next.handle(
              this.addHeaders(req, refreshTokenResult.data.token!)
            );
          } else {
            this.authStorageService.logout();
            // this.notifierService.showError(
            //   'La sesión ha expirado, es necesario iniciar sesión nuevamente.',
            //   'Mensaje'
            // );
            return EMPTY;
          }
        }),
        catchError((error) => {
          return throwError(() => new Error(error));
        })
      );
    }
  }

  private addHeaders(req: HttpRequest<unknown>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private resetCount(req: HttpRequest<unknown>) {
    const urlRequest = req.url;
    if(urlRequest.includes('token/refresh')) return;
    this.customSercive.restartCount();
  }
}
