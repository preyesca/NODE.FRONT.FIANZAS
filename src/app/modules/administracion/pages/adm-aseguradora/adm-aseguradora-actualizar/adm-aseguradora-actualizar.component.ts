import { Component } from '@angular/core';
import { IAseguradora } from '../../../helpers/interfaces/adm-aseguradora';
import { AdmAseguradoraService } from '../../../services/adm-aseguradora.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';

@Component({
  selector: 'app-adm-aseguradora-actualizar',
  templateUrl: './adm-aseguradora-actualizar.component.html'
})
export class AdmAseguradoraActualizarComponent {

  idAseguradora: string = "";
  isInvalidForm: boolean = true;

  constructor(
    private aseguradoraService: AdmAseguradoraService,
    private router: Router,
    private readonly notifierService: NotifierService,
    private route: ActivatedRoute
  ) {

  }

  editarAseguradora(aseguradora: IAseguradora) {

    if (this.isInvalidForm) {
      return;
    }

    this.route.params.subscribe(params => {
      this.idAseguradora = params['id'];

      if (this.idAseguradora) {

        this.aseguradoraService.update(this.idAseguradora, aseguradora)
          .subscribe({
            next: (response: IResponse<IAseguradora>) => {
              if (response.success) {
                this.return();
                this.notifierService.success(response.message);
              } else console.error(response.message);
            },
            error: (err) =>
              this.notifierService.error(err?.error?.message, 'Error'),
          })
      }

    })

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
