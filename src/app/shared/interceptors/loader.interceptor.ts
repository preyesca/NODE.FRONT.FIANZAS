import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoaderInterceptorService implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.activeRequests === 0) {
      this.spinner.show();
    }
    this.activeRequests++;

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.activeRequests--;
            if (this.activeRequests === 0) {
              this.spinner.hide();
            }
          }
        },
        (error) => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.spinner.hide();
          }
        }
      )
    );
  }
}
