import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FnzFolioEstatusService } from 'src/app/modules/fianzas/services/fnz-folio-estatus.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { IFnzFolioEstatusPaginate } from '../../helpers/interfaces/fnz-folio-estatus';

@Component({
  selector: 'app-fnz-folio',
  templateUrl: './fnz-folio-estatus.component.html',
  styleUrls: ['./fnz-folio-estatus.component.scss'],
})
export class FnzFolioEstatusComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  defaultPaginator = {
    page: 1,
    limit: AppConsts.DEFAULT.pagination.limit,
    search: '',
    itemsPorPage: AppConsts.DEFAULT.pagination.table.itemsPorPage,
  };

  dataSource: MatTableDataSource<IFnzFolioEstatusPaginate> =
    new MatTableDataSource();
  layouts: Array<IFnzFolioEstatusPaginate> = [];
  itemsPorPage: Array<number> = AppConsts.DEFAULT.pagination.table.itemsPorPage;
  breadcrumbs: string[] = ['Fianzas', 'Folio', 'Estatus carga'];
  displayColumns = [
    'filename',
    'archivoSize',
    'totalRows',
    'correcto',
    'fechaInicioCarga',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaInicioCarga',
    sort: 'desc',
    search: ''
  };
  pageEvent!: PageEvent;

  constructor(
    private readonly router: Router,
    private readonly notifierService: NotifierService,
    private readonly swalDialog: SwalService,
    private readonly folioEstatusService: FnzFolioEstatusService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.paginateAll();
  }


  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.paginateAll();
  }

  sortChange(sort: { active: string, direction: string }) {
    this.paginateParams.sort = sort.direction;
    this.paginateParams.order = sort.active;
    this.length = 0;
    this.pageIndex = 0;
    this.paginateAll();
  }

  paginateAll(): void {
    this.folioEstatusService.paginateAll(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IFnzFolioEstatusPaginate>>) => {
        if (response.success){
          this.dataSource.data = response.data.docs;
          this.length = response.data.totalDocs;
          //this.paginator.pageSize = response.data.hasNextPage;
        }
        else console.error(response.message);
      },
      error: (err) => this.notifierService.warning(err?.error?.message),
    });
  }

  onRowDoubleClick(row: IFnzFolioEstatusPaginate): void {
    if (row && row.procesado && !row.correcto)
      this.router.navigateByUrl(`/folio/estatus-carga/${row._id}`);
  }
}
