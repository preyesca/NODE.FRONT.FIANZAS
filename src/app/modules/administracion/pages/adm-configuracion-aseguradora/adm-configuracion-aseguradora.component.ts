import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IConfiguracionAseguradoraPaginate } from '../../helpers/interfaces/adm-configuracion-aseguradora';
import { AdmConfiguracionAseguradoraService } from '../../services/adm-configuracion-aseguradora.service';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-adm-configuracion-aseguradora',
  templateUrl: './adm-configuracion-aseguradora.component.html',
  styleUrls: ['./adm-configuracion-aseguradora.component.scss'],
})
export class AdmConfiguracionAseguradoraComponent {
  readonly #searchDataService = inject(FnzSearchDataService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  breadcrumbs: string[] = [
    'administracion.title',
    'administracion.configuracion-aseguradora.titlePlural',
  ];
  dataSource: MatTableDataSource<IConfiguracionAseguradoraPaginate> =
    new MatTableDataSource();
  itemsPorPage: Array<number> = [];

  displayedColumns: string[] = [
    'paisDescripcion',
    'proyecto',
    'aseguradora',
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
    private notifierService: NotifierService,
    private configuracionAseguradoraService: AdmConfiguracionAseguradoraService
  ) {}

  ngOnInit(): void {
    this.#searchDataService.setValueSearch('')
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
    this.search();
  }

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.paginateAll();
  }

  paginateAll(): void {
    this.configuracionAseguradoraService
      .paginateAll(this.paginateParams)
      .subscribe({
        next: (
          response: IResponse<IPaginate<IConfiguracionAseguradoraPaginate>>
        ) => {
          if (response.success) {
            this.dataSource.data = response.data.docs;
            this.length = response.data.totalDocs;
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.warning(err?.error?.message),
      });
  }

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.paginateAll();
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
        this.paginateAll()
      });
  }
}
