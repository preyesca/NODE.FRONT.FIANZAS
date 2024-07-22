import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IConfiguracionDocumentalDocumentos } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { ICargaDocumentalMasivaCatalogs } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { IFnzDocumentacion } from '../../core/helpers/interfaces/fnz-documentacion';


@Component({
  selector: 'app-fnz-status-documentos',
  templateUrl: './fnz-status-documentos.component.html',
  styleUrls: ['./fnz-status-documentos.component.scss'],
})
export class FnzEstatusDocumentosComponent{
  @Input() documentos: IFnzDocumentacion[] = [];
  @Input() pendientes: number = 0;
}
 