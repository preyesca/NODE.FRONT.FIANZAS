import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FnzFolioEstatusService } from 'src/app/modules/fianzas/services/fnz-folio-estatus.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import {
  IFnzFolioLayout,
  IFnzFolioLayoutDetail,
  IFnzFolioLayoutHeader,
} from '../../helpers/interfaces/fnz-folio-estatus';

@Component({
  selector: 'app-fnz-folio',
  templateUrl: './fnz-folio-estatus-details.component.html',
  styleUrls: ['./fnz-folio-estatus-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class FnzFolioEstatusDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  expandedElement!: IFnzFolioLayoutDetail;

  layoutHeader: IFnzFolioLayoutHeader = <IFnzFolioLayoutHeader>{};
  dataSource = new MatTableDataSource();
  itemsPorPage: Array<number> = AppConsts.DEFAULT.pagination.table.itemsPorPage;

  breadcrumbs: string[] = ['Fianzas', 'Folio', 'Estatus carga'];
  displayColumns = ['rowIndex', 'message'];
  header: string = '';

  totalDocs: number = 0;

  paginateParams: IPaginateParams = {
    pageSize: 1000,
    pageIndex: 0,
    order: 'rowIndex',
    sort: 'asc',
    search: '',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly notifierService: NotifierService,
    private folioEstatusService: FnzFolioEstatusService
  ) {}

  ngOnInit(): void {
    this.header = this.activatedRoute.snapshot.params['header'] || '';
    this.paginateAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  paginateAll(): void {
    this.folioEstatusService
      .getLayoutDetailsByHeader(this.header, this.paginateParams)
      .subscribe({
        next: (response: IResponse<IFnzFolioLayout>) => {
          if (response.success) {
            const { header, details } = response.data;
            this.layoutHeader = header;
            this.dataSource.data = details.docs;

            // this.paginator.pageSize = details.limit;
            // this.paginator.pageIndex = details.page - 1;
            // this.totalDocs = details.totalDocs;

            // this.dataSource.paginator = this.paginator;
          } else console.error(response.message);
        },
        error: (err) => {
          this.dataSource.data = [];
          this.return();
          this.notifierService.error(err?.error?.message);
        },
      });
  }

  onPageEvent(e: PageEvent) {
    // console.log(e);
    // this.paginateParams.pageSize = e.length;
    // this.paginateParams.pageIndex = e.pageIndex;
    // this.totalDocs = e.length;
    // console.log(this.paginator);
    // this.paginateAll();
  }

  expandedClick(element: any): void {
    if (element && element.columns?.length > 0) this.expandedElement = element;
  }

  return(): void {
    this.router.navigateByUrl(`/folio/estatus-carga`);
  }
}
