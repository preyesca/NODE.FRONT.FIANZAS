import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-aseguradora-ver',
  templateUrl: './adm-aseguradora-ver.component.html'
})
export class AdmAseguradoraVerComponent {

  constructor(private router: Router) { }

  cancelButton(value:boolean){
    this.router.navigate(['administracion/aseguradoras']);
  }


}
