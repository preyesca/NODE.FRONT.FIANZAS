import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-documento-ver',
  templateUrl: './adm-documento-ver.component.html'
})
export class AdmDocumentoVerComponent {


  constructor(private router: Router) { }

  cancelButton(value: boolean) {
    this.router.navigate(['administracion/documentos']);
  }

}
