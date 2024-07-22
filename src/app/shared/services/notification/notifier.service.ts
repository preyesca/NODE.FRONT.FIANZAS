import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  public toastrService = inject(ToastrService);

  success(message: string, title?: string) {
    this.toastrService.success(message, title, {
      disableTimeOut: false,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      enableHtml: true,
    });
  }

  error(message: string, title?: string) {
    this.toastrService.error(message, title, {
      disableTimeOut: false,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      enableHtml: true,
    });
  }

  warning(message: string, title?: string) {
    this.toastrService.warning(message, title, {
      disableTimeOut: false,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      enableHtml: true,
    });
  }

  info(message: string, title?: string) {
    this.toastrService.info(message, title, {
      disableTimeOut: false,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      enableHtml: true,
    });
  }
}
