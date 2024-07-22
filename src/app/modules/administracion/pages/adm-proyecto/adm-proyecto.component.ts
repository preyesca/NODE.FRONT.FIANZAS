import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IProyectoPaginate } from '../../helpers/interfaces/adm-proyecto';
import { AdmProyectoService } from '../../services/adm-proyecto.service';

@Component({
  selector: 'app-adm-proyecto',
  templateUrl: './adm-proyecto.component.html',
  styleUrls: ['./adm-proyecto.component.scss'],
})
export class AdmProyectoComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userSession!: IUserStorageUserDto;

  dataSource: MatTableDataSource<IProyectoPaginate> = new MatTableDataSource();
  breadcrumbs: string[] = ['Administración', 'Proyectos'];
  itemsPorPage: Array<number> = [];

  displayedColumns: string[] = [
    'paisDescripcion',
    'aseguradora',
    'ramoDescripcion',
    'procesoDescripcion',
    'negocioDescripcion',
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
    private admProyectoService: AdmProyectoService
  ) {
    config.backdrop = 'static'; // Permite que el modal se quede estetico
    config.keyboard = false; // desabilita la tecla esc
    config.size = 'xl'; // Tamaños del modal sm lg xl
  }

  ngOnInit(): void {
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
    this.paginateAll();
  }

  paginateAll(): void {
    this.admProyectoService.paginateAll(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IProyectoPaginate>>) => {
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

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.paginateAll();
  }

  create(): void {
    this.router.navigateByUrl('/administracion/proyectos/crear');
  }

  edit(_id: string): void {
    this.router.navigateByUrl(`/administracion/proyectos/actualizar/${_id}`);
  }

  view(_id: string): void {
    this.router.navigateByUrl(`/administracion/proyectos/ver/${_id}`);
  }
}
