import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FnzActividadesService } from 'src/app/modules/fianzas/services/fnz.actividades.service';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IFnzBandejaPaginate } from '../../../../core/helpers/interfaces/fnz-bandeja';
import { AppConsts } from 'src/app/shared/AppConsts';

@Component({
  selector: 'app-fnz-encabezado-bitacora',
  templateUrl: './fnz-encabezado-bitacora.component.html',
  styleUrls: ['./fnz-encabezado-bitacora.component.scss'],
})
export class FnzEncabezadoBitacoraComponent implements OnInit {
  readonly #userStorageService = inject(UserStorageService);
  readonly #actividadesService = inject(FnzActividadesService);

  constructor() {
    this.itemsPorPage = AppConsts.DEFAULT.settings.components.table.ItemsPorPage;
  }

  displayedColumns: string[] = ['fecha', 'actividad', 'estatus', 'comentarios'];
  bitacora: [] = [];
  dataSource = new MatTableDataSource<any>(this.bitacora);
  folio!: IFnzBandejaPaginate;
  itemsPorPage: Array<number> = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = [5, 10, 15];
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fecha',
    sort: 'asc',
    search: '',
  };


  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.getActividades();
  }

  sortChange(sort: { active: string; direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.getActividades();
  }

  ngOnInit(): void {
    this.init();
    this.getActividades();
  }

  init() {
    this.folio = this.#userStorageService.getFolioInfo()!;
  }

  getActividades() {
    this.#actividadesService
      .getInfoFolioActividades(this.folio.folio, this.paginateParams)
      .subscribe((response) => {
        this.bitacora = response.data.docs;
        this.dataSource.data = this.bitacora;
        this.length = response.data.totalDocs;
      });
  }
}
