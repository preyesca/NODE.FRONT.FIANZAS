import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged, map } from 'rxjs';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IConfiguracionDocumentalPaginate } from '../../helpers/interfaces/adm-configuracion-documental';
import { AdmConfiguracionDocumentalService } from '../../services/adm-configuracion-documental.service';

@Component({
  selector: 'app-adm-configuracion-documental',
  templateUrl: './adm-configuracion-documental.component.html',
  styleUrls: ['./adm-configuracion-documental.component.scss'],
})
export class AdmConfiguracionDocumentalComponent {
  readonly #searchDataService = inject(FnzSearchDataService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userSession!: IUserStorageUserDto;

  dataSource: MatTableDataSource<IConfiguracionDocumentalPaginate> =
    new MatTableDataSource();
  breadcrumbs: string[] = ['Administración', 'Configuración Documental'];
  itemsPorPage: Array<number> = [];

  displayedColumns: string[] = [
    'paisDescripcion',
    'proyecto',
    'aseguradora',
    'tipoPersonaDescripcion',
    'giroDescripcion',
    'estatus',
    'action',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'aseguradora',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  constructor(
    config: NgbModalConfig,
    private notifierService: NotifierService,
    private router: Router,
    private admConfiguracionDocumentalService: AdmConfiguracionDocumentalService
  ) {
    config.backdrop = 'static'; // Permite que el modal se quede estetico
    config.keyboard = false; // desabilita la tecla esc
    config.size = 'xl'; // Tamaños del modal sm lg xl
  }

  ngOnInit(): void {
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
    this.search();
  }

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.paginateAll();
  }

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.paginateAll();
  }

  paginateAll(): void {
    this.admConfiguracionDocumentalService
      .paginateAll(this.paginateParams)
      .subscribe({
        next: (
          response: IResponse<IPaginate<IConfiguracionDocumentalPaginate>>
        ) => {
          if (response.success) {
            this.dataSource.data = response.data.docs;
            this.length = response.data.totalDocs;
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.warning(err?.error?.message),
      });
  }

  create(): void {
    this.router.navigateByUrl('/administracion/configuracion-documental/crear');
  }

  edit(_id: string): void {
    this.router.navigateByUrl(
      `/administracion/configuracion-documental/actualizar/${_id}`
    );
  }

  view(_id: string): void {
    this.router.navigateByUrl(
      `/administracion/configuracion-documental/ver/${_id}`
    );
  }

  /**
   * Obtiene el valor de la búsqueda
   * @param value Valor de la búsqueda
   */
  search() {
    this.#searchDataService
      .getValueSearch()
      .pipe(
        distinctUntilChanged(),
        map((val) => val)
      )
      .subscribe((value: string) => {
        this.paginateParams.search = '';
        this.paginateParams.search = value.trim();
        this.paginateParams.pageSize = 10;
        this.paginateParams.pageIndex = 0;
        this.paginateAll();
      });
  }
}
