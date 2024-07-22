import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IConfiguracionFirmaCotejoPaginate } from '../../helpers/interfaces/adm-configuracion-firma-cotejo';
import { AdmConfiguradorFirmaCotejoService } from '../../services/adm-configuracion-firma-cotejo.service';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-adm-configuracion-firma-cotejo',
  templateUrl: './adm-configuracion-firma-cotejo.component.html',
  styleUrls: ['./adm-configuracion-firma-cotejo.component.scss'],
})
export class AdmConfiguracionFirmaCotejoComponent implements OnInit {
  readonly #searchDataService = inject(FnzSearchDataService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly #router = inject(Router);
  readonly #configFirmaService = inject(AdmConfiguradorFirmaCotejoService);

  breadcrumbs: string[] = ['Administración', 'Configuración', 'Firma cotejo'];

  dataSource: MatTableDataSource<IConfiguracionFirmaCotejoPaginate> =
    new MatTableDataSource();
  itemsPorPage: Array<number> = [];
  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'proyecto',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  displayedColumns: string[] = ['pais', 'proyecto', 'action'];

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

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.paginateAll();
  }

  paginateAll() {
    this.#configFirmaService.paginate(this.paginateParams).subscribe({
      next: (
        response: IResponse<IPaginate<IConfiguracionFirmaCotejoPaginate>>
      ) => {
        if (response.success) {
          this.dataSource.data = response.data.docs;
          this.length = response.data.totalDocs;
        }
      },
    });
  }

  create() {
    this.#router.navigateByUrl(
      'administracion/configurador-firma-contejo/crear'
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
      this.paginateAll()
    });
  }
}
