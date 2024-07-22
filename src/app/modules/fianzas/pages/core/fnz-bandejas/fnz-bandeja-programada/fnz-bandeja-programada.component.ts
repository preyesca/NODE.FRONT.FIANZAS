import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { EFnzActividad } from 'src/app/modules/fianzas/helpers/enums/fnz-actividad.enum';
import { FnzBandejaService } from 'src/app/modules/fianzas/services/fnz-bandeja.service';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IFnzBandejaPaginate } from '../../helpers/interfaces/fnz-bandeja';

@Component({
  selector: 'app-fnz-bandeja-programada',
  templateUrl: './fnz-bandeja-programada.component.html',
  styleUrls: ['./fnz-bandeja-programada.component.scss'],
})
export class FnzBandejaProgramadaComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource();
  bandejas: Array<IFnzBandejaPaginate> = [];
  breadcrumbs: string[] = ['Bandejas', 'Programadas'];
  displayColumns = [
    'folioMultisistema',
    'cliente',
    'riesgo',
    'aseguradora',
    'actividad',
    // 'sla',
    'estado',
    'fechaAlta',
  ];

  itemsPorPage: Array<number> = [];
  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaAlta',
    sort: 'desc',
    search: '',
  };
  pageEvent!: PageEvent;
  constructor(
    private router: Router,
    private bandejaService: FnzBandejaService,
    private notifierService: NotifierService,
    private searchDataService: FnzSearchDataService,
    private userStorageService: UserStorageService
  ) {
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
  }

  ngOnInit(): void {
    this.search();
  }

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.paginateAll();
  }

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.paginateAll();
  }

  search() {
    this.searchDataService
      .getValueSearch()
      .pipe(
        distinctUntilChanged(),
        map((val) => val)
      )
      .subscribe((value) => {
        this.paginateParams.search = '';
        this.paginateParams.search = value.trim();
        this.paginateParams.pageSize = 10;
        this.paginateParams.pageIndex = 0;
        this.paginateAll();
      });
  }

  paginateAll() {
    this.bandejaService.programadas(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IFnzBandejaPaginate>>) => {
        if (response.success) {
          this.dataSource.data = response.data.docs;
          this.length = response.data.totalDocs;
        } else console.error(response.message);
      },
      error: (err) => {
        this.notifierService.error(err?.error?.message);
      },
    });
  }

  onRowDoubleClick(row: IFnzBandejaPaginate): void {
    if (!row) {
      this.notifierService.warning(
        'No se pudo obtener la información del registro',
        'Advertencia'
      );
      return;
    }

    // TODO
    // this.userStorageService.saveFolioInfo(row);

    const paths = [
      { actividad: EFnzActividad.SOLICITUD, path: 'solicitud' },
      { actividad: EFnzActividad.CARGA_DOCUMENTAL, path: 'carga-documental' },
      {
        actividad: EFnzActividad.VALIDACION_DIGITAL,
        path: 'validacion-digital',
      },
      {
        actividad: EFnzActividad.CONTACTO_TELEFONICO,
        path: 'contacto-telefonico',
      },
      {
        actividad: EFnzActividad.CONTACTO_ASEGURADORA,
        path: 'contacto-aseguradora',
      },
    ];

    const nextActividad = paths.find(
      (p) => p.actividad === row.actividadCodigo
    );

    if (nextActividad) {
      this.router.navigate([`/${nextActividad.path}/${row.folio}`]);
      return;
    }

    this.notifierService.error(
      'Se produjo un error al intentar acceder al siguiente módulo',
      'Mensaje'
    );
  }
}
