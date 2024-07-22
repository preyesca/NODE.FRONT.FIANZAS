import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-not-found',
  templateUrl: './share-not-found.component.html',
  styleUrls: ['./share-not-found.component.scss']
})
export class ShareNotFoundComponent {
  /**
   *
   */
  constructor(private readonly router: Router) {

  }

  click_inicio() {
    //TODO EN CASO DE QUE EXISTA UNA SESION REDIRIGIR A LA PAGINA DE INCIO, CASO CONTRARIO ENVIAR A LOGIN
    this.router.navigateByUrl('/authentication/login')
  }
}
