import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }
  async success(options: any) {
    return Swal.fire(Object.assign({
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#0eb7e6',
      showCloseButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }, options));
  }

  async warning(options: any) {
    return Swal.fire(Object.assign({
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#0eb7e6',
      showCloseButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }, options));
  }

  async error(options: any) {
    return Swal.fire(Object.assign({
      icon: "error",
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#0eb7e6',
      showCloseButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }, options));
  }

  async info(options: any) {
    return Swal.fire(Object.assign({
      icon: "info",
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#0eb7e6',
      showCloseButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }, options));
  }

  async question(options: any) {
    return Swal.fire(Object.assign({
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0eb7e6',
      cancelButtonColor: '#14171c',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }, options));
  }
}
