import { Component, Input, OnInit } from '@angular/core';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FnzEncabezadoService } from '../../../services/fnz-encabezado.service';
import { IFnzEncabezado } from '../helpers/interfaces/fnz-encabezado';

@Component({
  selector: 'app-fnz-encabezado',
  templateUrl: './fnz-encabezado.component.html',
  styleUrls: ['./fnz-encabezado.component.scss'],
})
export class FnzEncabezadoComponent implements OnInit {
  @Input()
  public folio!: string;

  header: IFnzEncabezado = <IFnzEncabezado>{};
  mostrarDetalle: boolean = false;

  constructor(
    private readonly notifierService: NotifierService,
    private readonly encabezadoService: FnzEncabezadoService
  ) {}

  ngOnInit(): void {
    this.encabezadoService.getInfoGeneralByFolio(this.folio).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) this.header = response.data;
        else console.error(response.message);
      },
      error: (err) => this.notifierService.error(err?.error?.message, 'Error'),
    });
  }
}
