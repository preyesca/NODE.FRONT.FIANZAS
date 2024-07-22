import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IAseguradoraPaginate } from '../../helpers/interfaces/adm-aseguradora';
import { AdmAseguradoraService } from '../../services/adm-aseguradora.service';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-adm-aseguradora',
  templateUrl: './adm-aseguradora.component.html',
  styleUrls: ['./adm-aseguradora.component.scss'],
})
export class AdmAseguradoraComponent implements OnInit {
  readonly #searchDataService = inject(FnzSearchDataService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  breadcrumbs: string[] = ['Administración', 'Aseguradoras'];
  dataSource: MatTableDataSource<IAseguradoraPaginate> =
    new MatTableDataSource();
  itemsPorPage: Array<number> = [];
  aseguradoras: Array<IAseguradoraPaginate> = [];

  displayedColumns: string[] = [
    'pais',
    'nombreComercial',
    'altaProyecto',
    'documentos',
    'estatus',
    'action',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'nombreComercial',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  constructor(
    private notifierService: NotifierService,
    private admAseguradoraService: AdmAseguradoraService
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
    this.admAseguradoraService.paginateAll(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IAseguradoraPaginate>>) => {
        if (response.success) {
          this.aseguradoras = response.data.docs.map((a: any) => {
            a.altaProyectoShow = a.altaProyecto ? 'Si' : 'No';
            a.documentosShow = a.documentos ? 'Si' : 'No';
            a.estadoFlag = a.estatus == 'Activo' ? true : false;
            return a;
          });
          this.dataSource.data = this.aseguradoras;
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
