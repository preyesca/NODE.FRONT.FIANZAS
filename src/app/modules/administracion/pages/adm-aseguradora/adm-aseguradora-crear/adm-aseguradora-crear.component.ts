import { Component } from '@angular/core';
import { IAseguradora } from '../../../helpers/interfaces/adm-aseguradora';
import { AdmAseguradoraService } from '../../../services/adm-aseguradora.service';
import { Router } from '@angular/router';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';

@Component({
  selector: 'app-adm-aseguradora-crear',
  templateUrl: './adm-aseguradora-crear.component.html'
})
export class AdmAseguradoraCrearComponent {

  isInvalidForm: boolean = true;

  constructor(
    private aseguradoraService: AdmAseguradoraService,
    private router: Router,
    private readonly notifierService: NotifierService
  ) {

  }

  registrarAseguradora(aseguradora: IAseguradora) {

    if (this.isInvalidForm) {
      return;
    }

    aseguradora.nombreComercial = aseguradora.nombreComercial.trim();
    aseguradora.razonSocial = aseguradora.razonSocial.trim();

    this.aseguradoraService.create(aseguradora).subscribe({
      next: (response: IResponse<IAseguradora>) => {
        if (response.success) {
          this.return();
          this.notifierService.success(response.message);
        } else console.error(response.message);
      },
      error: (err) =>
        this.notifierService.error(err?.error?.message, 'Error'),
    });

  }

  cancelButton(value: boolean) {
    this.router.navigate(['administracion/aseguradoras']);
  }

  return(): void {
    this.router.navigateByUrl(`/administracion/aseguradoras`);
  }

  validarForm(valor: boolean) {
    this.isInvalidForm = valor;
  }

}
