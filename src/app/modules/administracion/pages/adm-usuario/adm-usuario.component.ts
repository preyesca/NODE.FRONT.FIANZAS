import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { distinctUntilChanged, map } from 'rxjs';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { AuthStorageService } from 'src/app/shared/services/storage/auth-storage.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IUsuarioPaginate } from '../../helpers/interfaces/adm-usuario';
import { AdmUsuarioService } from '../../services/adm-usuario.service';

@Component({
  selector: 'app-adm-usuario',
  templateUrl: './adm-usuario.component.html',
  styleUrls: ['./adm-usuario.component.scss'],
})
export class AdmUsuarioComponent implements OnInit {
  readonly #searchDataService = inject(FnzSearchDataService);
  readonly #sessionStorage = inject(UserStorageService);
  readonly #swalService = inject(SwalService);
  readonly #authService = inject(AuthStorageService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userSession!: IUserStorageUserDto;
  dataSource: MatTableDataSource<IUsuarioPaginate> = new MatTableDataSource();
  breadcrumbs: string[] = [
    'administracion.title',
    'administracion.usuario.titlePlural',
  ];
  itemsPorPage: Array<number> = [];

  displayedColumns: string[] = [
    //'paisDescripcion',
    'nombre',
    'correoElectronico',
    'estatus',
    'sesionAbierta',
    //'nombreRol',
    'action',
  ];

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: any = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'fechaCreacion',
    sort: 'desc',
    search: '',
  };
  pageEvent!: PageEvent;

  constructor(
    private notifierService: NotifierService,
    private admUsuarioService: AdmUsuarioService
  ) {}

  ngOnInit(): void {
    this.#searchDataService.setValueSearch('');
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
    this.search();
    this.userSession = this.#sessionStorage.getCurrentUserInfo();
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
    this.admUsuarioService.paginateAll(this.paginateParams).subscribe({
      next: (response: IResponse<IPaginate<IUsuarioPaginate>>) => {
        if (response.success) {
          this.dataSource.data = response.data.docs;
          this.length = response.data.totalDocs;
        } else console.error(response.message);
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    });
  }

  confirmLogout(usuario: string, nombre: string) {
    this.#swalService
      .question({
        html: `¿Realmente desea cerrar la sesión del siguiente usuario? <br> <strong> ${nombre}</strong>`,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.#authService.logoutAdmin({ usuario }).subscribe((result) => {
            this.search();
            this.notifierService.success('La sesión fué cerrada con éxito');
          });
        }
      });
  }
}
