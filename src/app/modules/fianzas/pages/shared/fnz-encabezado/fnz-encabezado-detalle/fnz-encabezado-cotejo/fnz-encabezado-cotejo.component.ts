import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { IConfiguracionDocumental } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { ICargaDocumentalMasivaCatalogs } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { IFileBase64 } from 'src/app/modules/administracion/helpers/interfaces/core-validacion-documental';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { AdmConfiguradorFirmaCotejoService } from 'src/app/modules/administracion/services/adm-configuracion-firma-cotejo.service';
import { FnzExpedienteDigitalService } from 'src/app/modules/fianzas/services/fnz-expediente-digital.service';
import { EPerfil } from 'src/app/shared/helpers/enums/core/perfil.enum';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { AuthStorageService } from 'src/app/shared/services/storage/auth-storage.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { IFnzBandejaPaginate } from '../../../../core/helpers/interfaces/fnz-bandeja';
import {
  Documentos,
  IFnzArchivoCotejo,
  IFnzCotejo,
} from '../../../../core/helpers/interfaces/fnz-cotejo';
import { IFnzEjecutivo } from '../../../helpers/interfaces/fnz-ejecutivo';
import { AppConsts } from 'src/app/shared/AppConsts';

@Component({
  selector: 'app-fnz-encabezado-cotejo',
  templateUrl: './fnz-encabezado-cotejo.component.html',
  styleUrls: ['./fnz-encabezado-cotejo.component.scss'],
})
export class FnzEncabezadoCotejoComponent implements OnInit {
  readonly #notifierService = inject(NotifierService);
  readonly #swalService = inject(SwalService);
  readonly #userStorageService = inject(UserStorageService);
  readonly #authStorageService = inject(AuthStorageService);
  readonly #expedienteService = inject(FnzExpedienteDigitalService);
  readonly #configuracionDocumentalService = inject(
    AdmConfiguracionDocumentalService
  );
  readonly #configuradorFirmaCotejoService = inject(
    AdmConfiguradorFirmaCotejoService
  );
  readonly #utilService = inject(UtilsService);

  userSession!: IUserStorageUserDto;
  mostrarEliminar: boolean = false;
  idFolio: string = '';
  displayedColumns: string[] = [
    'documento',
    'archivo',
    'fechaCarga',
    'peso',
    'seCoteja',
    'operaciones',
  ];
  extension_valid: string = AppConsts.FILE.EXTENSION_VALID_COTEJO;
  documentosDataInicial: IFnzArchivoCotejo[] = [];
  documentosCotejar = new IFnzCotejo();
  firmaEjecutivo: IFnzEjecutivo | undefined;
  dataSource = new MatTableDataSource<any>(this.documentosDataInicial);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  folio!: IFnzBandejaPaginate;
  configuracion!: IConfiguracionDocumental;
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  readonlyModule: boolean = false;
  nombreEjecutivo: string = '';
  length: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions = [5, 10, 15];
  paginateParams: IPaginateParams = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'rowIndex',
    sort: 'asc',
    search: '',
  };
  pageEvent!: PageEvent;

  public onChangePage(e: PageEvent) {
    this.paginateParams.pageSize = e.pageSize;
    this.paginateParams.pageIndex = e.pageIndex;
    this.getArchivos();
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.folio = this.#userStorageService.getFolioInfo()!;
    const userSession = this.#userStorageService.getCurrentUserInfo();
    if (!userSession) {
      this.#authStorageService.logout();
      return;
    }
    this.userSession = userSession!;
    this.nombreEjecutivo = this.folio.ejecutivo?.nombre!;
    this.mostrarEliminar =
      userSession.proyecto.rol.clave === EPerfil.HELPDESK_EXTERNO ||
      userSession.proyecto.rol.clave === EPerfil.HELPDESK_INTERNO ||
      userSession.proyecto.rol.clave === EPerfil.HELPDESK_INTERNO;
    this.getArchivos();
    this.getConfiguracionFirmaCotejo();
  }

  getArchivos() {
    this.#expedienteService
      .find_by_titular_cotejo_paginate(
        this.folio.pais,
        this.folio.aseguradoraId,
        this.folio.proyecto,
        this.folio.titular,
        this.paginateParams
      )
      .subscribe((response) => {
        if (response.success) {
          this.documentosDataInicial = response.data.docs;
          this.documentosDataInicial.map((x) => {
            const cotejado = x.cotejado;
            x.changeCotejado = cotejado ? true : false;
          });
          this.documentosDataInicial = this.documentosDataInicial.filter((x: any) =>
            this.extension_valid.split(',').map(x => x.trim()).includes(x.filename.split('.').pop()!.toUpperCase()
            ));
          this.dataSource.data = this.documentosDataInicial;
          this.length = response.data.totalDocs;
        }
      });
  }

  filterItems(array: any) {
    return array.filter((el: any) => el.filename.split('.').pop()!.toUpperCase().includes("PNG"))

  }

  onChangeCheck(data: any): void {
    const documentoValidar = this.documentosCotejar.documentos.find(
      (documento) => documento.id === data.id
    );
    if (documentoValidar) {
      this.removeFromDataCotejar(data);
    } else {
      this.addToDataCotejar(data);
    }
  }

  private removeFromDataCotejar(data: any): void {
    const indice = this.documentosCotejar.documentos.findIndex(
      (elemento) => elemento.id === data.id
    );
    if (indice !== -1) {
      this.documentosCotejar.documentos.splice(indice, 1);
    }
  }

  private addToDataCotejar(data: any): void {
    const dataCotejarActualizada = this.documentosDataInicial.find(
      (doc) => doc.id === data.id
    );
    if (dataCotejarActualizada?.cotejado) {
      data.cotejar = false;
    } else {
      data.cotejar = true;
    }

    const dataCotejo: Documentos = {
      cotejar: data.cotejar,
      filename: data.cotejar
        ? data.nombreCorto
        : data.cotejado.filename,
      id: data.id,
    };

    this.documentosCotejar.documentos.push(dataCotejo);
  }

  getFilenameCotejado(path: string) {
    return path.split('/').pop();
  }

  enviarCotejo() {
    const configuracionFirmaCotejo = this.firmaEjecutivo;
    if (!configuracionFirmaCotejo) {
      this.#swalService.info({
        text: 'No existe la configuracion de firma para iniciar con el proceso de cotejo.',
      });
      return;
    }

    if (this.documentosCotejar.documentos.length === 0) {
      this.#swalService.warning({
        text: 'Debe seleccionar al menos un documento para iniciar con el proceso de cotejo.',
      });
      return false;
    }

    this.documentosCotejar.numeroCliente = this.folio.folioCodigo.split('-')[0];
    this.documentosCotejar.idUsuario = this.userSession._id;
    this.documentosCotejar.pathFirma = configuracionFirmaCotejo.firma;

    this.#expedienteService
      .cotejarODescotejarDocumentos(this.documentosCotejar)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.#swalService
              .success({
                text: 'Información almacenada correctamente. Se cotejaron los documentos seleccionados.',
              })
              .then((result) => {
                this.documentosCotejar = new IFnzCotejo();
                this.getArchivos();
              });
          }
        },
        error: (err) =>
          this.#notifierService.error(err?.error?.errorMessage, 'Error'),
      });

    return true;
  }

  async getConfiguracionFirmaCotejo() {
    try {
      const responseConfiguracion = await lastValueFrom(
        this.#configuradorFirmaCotejoService.findEjecutivoByClave(
          this.folio.ejecutivo!.numero
        )
      );
      if (responseConfiguracion.success && responseConfiguracion.data != null) {
        this.firmaEjecutivo = responseConfiguracion.data;
      }
    } catch (error) {
      this.firmaEjecutivo = undefined;
    }
  }

  click_descargar(data: any) {
    this.#expedienteService.getByArchivoCotejadoByBase64(data?.id).subscribe({
      next: (response: IResponse<IFileBase64>) => {
        if (response.success) {
          let blobFile = this.#utilService.b64toBlob(
            response.data.base64,
            response.data.contentType,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          window.open(
            urlBlobFile,
            '_blank',
            'location=yes,height=650,width=600,scrollbars=yes,status=yes'
          );
        }
      },
    });
  }

  click_eliminar(archivoId: string) {
    this.#expedienteService.deleteFile(archivoId).subscribe((response) => {
      if (response.success) {
        this.getArchivos();
      }
    });
  }
}
