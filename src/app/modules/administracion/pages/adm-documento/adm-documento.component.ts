import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IDocumentoPaginate } from '../../helpers/interfaces/adm-documento';
import { AdmDocumentoService } from '../../services/adm-documento.service';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-adm-documento',
  templateUrl: './adm-documento.component.html',
})
export class AdmDocumentoComponent implements OnInit {
  readonly #searchDataService = inject(FnzSearchDataService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  breadcrumbs: string[] = ['Administración', 'Documentos'];
  dataSource: MatTableDataSource<IDocumentoPaginate> = new MatTableDataSource();
  itemsPorPage: Array<number> = [];
  documentos: Array<IDocumentoPaginate> = [];

  displayedColumns: string[] = [
    'pais',
    'categoria',
    'nombre',
    'estatus',
    'action',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'nombre',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  constructor(
    config: NgbModalConfig,
    private notifierService: NotifierService,
    private documentoService: AdmDocumentoService
  ) {
    config.backdrop = 'static'; // Permite que el modal se quede estetico
    config.keyboard = false; // desabilita la tecla esc
    config.size = 'xl'; // Tamaños del modal sm lg xl
  }

  ngOnInit(): void {
    this.#searchDataService.setValueSearch('')
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
    this.search();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
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

  paginateAll(): void {
    this.documentoService.paginate(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IDocumentoPaginate>>) => {
        if (response.success) {
          this.documentos = response.data.docs.map((d: any) => {
            d.estadoFlag = d.estatus == 'Activo';
            return d;
          });
          this.dataSource.data = this.documentos;
          this.length = response.data.totalDocs;
        } else console.error(response.message);
      },
      error: (err) => this.notifierService.warning(err?.error?.message),
    });
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
