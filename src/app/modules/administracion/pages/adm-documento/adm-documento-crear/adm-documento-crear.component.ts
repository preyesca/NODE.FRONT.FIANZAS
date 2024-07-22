import { Component } from '@angular/core';
import { AdmDocumentoService } from '../../../services/adm-documento.service';
import { Router } from '@angular/router';
import { IDocumento } from '../../../helpers/interfaces/adm-documento';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';

@Component({
  selector: 'app-adm-documento-crear',
  templateUrl: './adm-documento-crear.component.html'
})
export class AdmDocumentoCrearComponent {

  isInvalidForm: boolean = true;

  constructor(
    private documentoService: AdmDocumentoService,
    private router: Router,
    private readonly notifierService: NotifierService
  ) { }

  registrarDocumento(documento: IDocumento) {

    if (this.isInvalidForm) {
      return;
    }

    documento.nombre = documento.nombre.trim();
    this.documentoService.create(documento)
      .subscribe({
        next: (response: IResponse<IDocumento>) => {
          if (response.success) {
            this.return();
            this.notifierService.success(response.message);
          } else console.error(response.message);
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      })
  }

  cancelButton(value: boolean) {
    this.router.navigate(['administracion/documentos']);
  }

  return(): void {
    this.router.navigateByUrl(`/administracion/documentos`);
  }

  validarForm(valor: boolean) {
    this.isInvalidForm = valor;
  }

}
