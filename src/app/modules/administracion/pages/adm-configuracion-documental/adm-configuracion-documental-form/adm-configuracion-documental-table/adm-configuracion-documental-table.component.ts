import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IConfiguracionDocumentalDocumentos } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';

@Component({
  selector: 'app-adm-configuracion-documental-table',
  templateUrl: './adm-configuracion-documental-table.component.html',
  styleUrls: ['./adm-configuracion-documental-table.component.css'],
})
export class AdmConfiguracionDocumentalTableComponent
  implements OnInit, OnChanges
{
  @Input() configuracion: IConfiguracionDocumentalDocumentos[] = [];
  @Input() motivo: Array<ICatalogo> = [];
  @Input() action!: EFormAction;
  @Output() updateConfiguracionEvent = new EventEmitter();
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = [
    'nombre',
    'activo',
    'obligatorio',
    'ocr',
    'vigencia',
    'motivosRechazo',
  ];
  itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPageCustom;
  dataSource = new MatTableDataSource<IConfiguracionDocumentalDocumentos>();
  isView: boolean = false;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource =
      new MatTableDataSource<IConfiguracionDocumentalDocumentos>(
        this.configuracion
      );
    this.isView = this.action === EFormAction.VIEW;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataSource =
      new MatTableDataSource<IConfiguracionDocumentalDocumentos>(
        this.configuracion
      );
    this.isView = this.action === EFormAction.VIEW;
  }

  onChangeMotivo(index: number, value: number) {
    const registroExiste = this.configuracion[index].motivosRechazo.filter(
      (element) => element === value
    );

    if (!registroExiste)
      this.configuracion[index].motivosRechazo.push(Number(value));
  }

  changeActivo(index: number, event: any) {
    
    if(!event.checked){
      this.configuracion[index].obligatorio = false;
      this.configuracion[index].vigencia = false;
    }
    
    this.configuracion[index].activo = event.checked;
  }

  changeObligatorio(index: number, event: any) {
    this.configuracion[index].obligatorio = event.checked;
  }

  changeOcr(index: number, event: any) {
    this.configuracion[index].ocr = event.checked;
  }

  changeVigencia(index: number, event: any) {
    this.configuracion[index].vigencia = event.checked;
  }

  updateConfiguracion() {
    this.updateConfiguracionEvent.emit();
  }
}
