import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EFnzEstatusActividad } from 'src/app/modules/fianzas/helpers/enums/fnz-estatus-actividad.enum';
import { FnzWorkFlowService } from 'src/app/modules/fianzas/services/fnz.workflow.service';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IFnzBandejaPaginate } from '../../../../core/helpers/interfaces/fnz-bandeja';

@Component({
  selector: 'app-fnz-encabezado-historial',
  templateUrl: './fnz-encabezado-historial.component.html',
})
export class FnzEncabezadoHistorialComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly #router = inject(Router);
  readonly #userStorageService = inject(UserStorageService);
  readonly #workFlowService = inject(FnzWorkFlowService);

  readonlyModule: boolean = false;

  displayedColumns: string[] = [
    'actividad',
    'estatus',
    'usuario',
    'perfil',
    'fechaAlta',
    'fechaFin',
  ];
  actividades: [] = [];
  dataSource = new MatTableDataSource<any>(this.actividades);
  folio!: IFnzBandejaPaginate;

  length: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions = [5, 10, 15];
  paginateParams: IPaginateParams = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'rowIndex',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  estatusActividad = {
    nueva: EFnzEstatusActividad.NUEVA,
    enProgreso: EFnzEstatusActividad.EN_PROGRESO,
    completada: EFnzEstatusActividad.COMPLETADA,
    enReproceso: EFnzEstatusActividad.EN_REPROCESO,
    cancelada: EFnzEstatusActividad.CANCELADA,
    finalizada: EFnzEstatusActividad.FINALIZADA,
    suspendida: EFnzEstatusActividad.SUSPENDIDA,
    programada: EFnzEstatusActividad.PROGRAMADA,
  };

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.getActividades();
  }

  ngOnInit(): void {
    this.folio = this.#userStorageService.getFolioInfo()!;
    this.getActividades();
  }

  getActividades(): void {
    this.#workFlowService
      .getInfoFolioActividadesPaginate(
        this.folio.folioMultisistema,
        this.folio.proyecto,
        this.paginateParams
      )
      .subscribe((response) => {
        this.actividades = response.data.docs;
        this.dataSource.data = this.actividades;
        this.length = response.data.totalDocs;
      });
  }

  return(): void {
    this.#router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
