import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IFnzContactoTelefonicoPaginate } from '../../helpers/interfaces/fnz-contacto-telefonico';
import { IFnzBandejaPaginate } from '../../helpers/interfaces/fnz-bandeja';
import { FnzContactoTelefonicoService } from 'src/app/modules/fianzas/services/fnz-contacto-telefonico.service';

@Component({
  selector: 'app-fnz-historial-contacto-telefonico',
  templateUrl: './fnz-historial-contacto-telefonico.component.html',
  styleUrls: ['./fnz-historial-contacto-telefonico.component.scss']
})
export class FnzHistorialContactoTelefonicoComponent {

  folio!: IFnzBandejaPaginate;
  itemsPorPage: Array<number> = [];
  dataSource = new MatTableDataSource();
  contacto: Array<IFnzContactoTelefonicoPaginate> = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayColumns = [
    'fechaContacto',
    'usuario',
    'tipoLlamada',
    'estatus',
    'fechaProximaLlamada',
    'observaciones'
  ];


  constructor(
    private contactoTelefonicoService: FnzContactoTelefonicoService,
    private userStorageService: UserStorageService

  ) {
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
  }

  ngOnInit(): void {
    this.folio = this.userStorageService.getFolioInfo()!;
    this.findAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  findAll() {

    this.contactoTelefonicoService.findAll(this.folio.folio).subscribe((response: IResponse<IPaginate<IFnzContactoTelefonicoPaginate>>) => {
      if (response.success) {
        this.dataSource.data = response.data.docs;
      }
    })

  }

}
