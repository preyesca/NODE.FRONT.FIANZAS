import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { IConfiguracionDocumental } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { IDocumento, IDocumentoPaginate } from 'src/app/modules/administracion/helpers/interfaces/adm-documento';
import { IArchivo } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { AdmDocumentoService } from 'src/app/modules/administracion/services/adm-documento.service';
import { AppConsts } from 'src/app/shared/AppConsts';
import {
  IPaginate,
  IPaginateParams,
  IRequestPaginate,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { AuthStorageService } from 'src/app/shared/services/storage/auth-storage.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from 'src/environments/environment';
import { EDocumento } from '../../../../../shared/helpers/enums/core/documento.enum';
import { FnzTitularService } from '../../../services/fnz.titular.service';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import { IFnzArchivo } from '../helpers/interfaces/fnz-carga-documental';
import { IFnzTitular } from '../helpers/interfaces/fnz-titular';

@Component({
  selector: 'app-fnz-carga-documental-masiva',
  templateUrl: './fnz-carga-documental-masiva.component.html',
  styleUrls: ['./fnz-carga-documental-masiva.component.css'],
})
export class FnzCargaDocumentalMasivaComponent implements OnInit {
  breadcrumbs: string[] = ['Fianzas', 'Folio', 'Carga documental masiva'];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;
  public title: string = 'documento';
  public styleInput: string = 'background-white';
  userSession!: IUserStorageUserDto;
  displayedColumns: string[] = [
    'nombre',
    'titular',
    'documento',
    'fechaVigencia',
    'operaciones',
  ];
  extension_valid: string = AppConsts.FILE.EXTENSION_VALID;
  isUploading: Boolean = false;
  uploadProgress: number = 0;
  dataSource = new MatTableDataSource<IFnzArchivo>();
  dataArchivos: IFnzArchivo[] = [];
  documentos!: IDocumento[];
  cliente: any[] = [];
  configuracion!: IConfiguracionDocumental;
  titular: IFnzTitular[] = [];
  proyecto: string = '';
  paginate: IRequestPaginate = {
    paginate: {
      search: '',
    },
  };

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  paginateParams: IPaginateParams = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'rowIndex',
    sort: 'desc',
    search: '',
  };

  constructor(
    private notifierService: NotifierService,
    private http: HttpClient,
    private userStorageService: UserStorageService,
    private authStorageService: AuthStorageService,
    private titularService: FnzTitularService,
    private utilsService: UtilsService,
    private admDocumentoService: AdmDocumentoService
  ) {}

  ngOnInit(): void {
    const userSession = this.userStorageService.getCurrentUserInfo();
    if (!userSession) {
      this.authStorageService.logout();
      return;
    }
    this.userSession = userSession!;
    this.proyecto = this.userSession.proyecto._id;
    this.catalogs();
  }

  catalogs() {
    this.titularService.getTitularesSolicitudes(this.paginate).subscribe({
      next: (response: IResponse<IPaginate<IFnzBandejaPaginate>>) => {
        if (response.success) {
          this.cliente = [];
          if (response.data!.docs) {
            this.cliente = response.data.docs;
          }
        } else console.error(response.message);
      },
      error: (err) => {
        this.notifierService.error(err?.error?.message);
      },
    });

    this.admDocumentoService.getAll().subscribe({
      next: (response: IResponse<Array<IDocumento>>) => {
        if (response.success) {
          this.documentos = response.data;
          debugger
          this.documentos = this.documentos.filter(
            (element: any) =>
              element.clave != EDocumento.FIC &&
              element.clave != EDocumento.ANEXO &&
              element.clave != EDocumento.ACUSE_ENVIO &&
              element.clave != EDocumento.CONFIRMACION_ENTREGA
          );
        } else console.error(response.message);
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    });
  }


  onDragover(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.styleInput = 'background-blue';
  }
  onDragout(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.styleInput = 'background-white';
  }

  onDrop(event: DragEvent) {
    this.styleInput = 'background-white';
  }

  onChangeTitular(index: number, value: string) {
    this.dataArchivos[index].titular = value;
    if (index == 0) {
      this.dataArchivos.forEach((item) => {
        item.titular = value;
      });
    }
  }

  onChangeDocumento(index: number, value: string) {
    this.dataArchivos[index].documento = value;
    //this.dataArchivos[index].vigencia = this.documentos?.find((element) => element._id === value)
  }

  onChangeFechaVigencia(index: number, value: Date) {
    this.dataArchivos[index].fechaVigencia = value;
  }

  selectFiles(files: FileList | null) {
    let blnMensaje = false;

    if (files?.length === 0) {
      return;
    }

    for (let i = 0; i < files!.length; i++) {
      const strExtension = files![i].name
        .split('.')
        [files![i].name.split('.').length - 1].toUpperCase();
      const lstExtensiones = this.extension_valid.split(',');

      if (lstExtensiones.includes('.' + strExtension)) {
        let archivo: IFnzArchivo = {
          documento: '',
          nombreDocumento: '',
          titular: '',
          aseguradora: '',
          file: files![i],
          nombreOriginal: files![i].name,
          fechaVigencia: new Date(),
          vigencia: false,
        };
        this.dataArchivos.push(archivo);
        this.dataSource = new MatTableDataSource<IFnzArchivo>(
          this.dataArchivos
        );
      } else {
        blnMensaje = true;
      }
    }
    if (blnMensaje) {
      this.notifierService.warning(
        'Ups, las extensiones permitidas son <br>' +
          this.extension_valid.split('.').join(' ')
      );
    }
  }

  uploadFiles(docsForm: NgForm) {
    if (!docsForm.valid) {
      return;
    }
    let contador = 0;
    this.dataArchivos.forEach((item) => {
      this.isUploading = false;
      this.uploadProgress = 0;
      contador += 1;
      const formData: FormData = this.setFormData(item);
      const request = new HttpRequest(
        'POST',
        `${environment.urlApi}/expedientedigital/archivos`,
        formData
      );
      this.isUploading = true;
      this.upload_file_masivo(contador, request);
    });
  }

  upload_file_masivo(contador: number, request: any) {
    return new Promise((resolve: any, reject) => {
      this.http
        .request<[]>(request)
        .pipe(
          finalize(() => {
            this.isUploading = false;
            this.uploadProgress = 0;
            if (this.dataArchivos.length == contador) {
              this.dataArchivos = [];
              this.dataSource.data = [];
            }
          })
        )
        .subscribe(
          (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round(
                (100 * event.loaded) / event.total!
              );
            } else if (event instanceof HttpResponse) {
              resolve();
              if (this.dataArchivos.length == contador) {
                this.notifierService.success(
                  'Los archivos se cargaron correctamente'
                );
              }
            }
          },
          (error) => {
            this.notifierService.error(
              'Información',
              'Sucedió un error al cargar los archivos'
            );
            console.log(error);
          }
        );
    });
  }

  setFormData(file: IFnzArchivo): FormData {
    const formData = new FormData();
    formData.append('file', file!.file);
    formData.append('aseguradora', file.aseguradora);
    formData.append('titular', file.titular);
    formData.append('documento', file.documento);
    formData.append('nombreOriginal', file.nombreOriginal);
    formData.append('fechaVigencia', file.fechaVigencia.toString());
    return formData;
  }

  deleteFile(indexRow: number) {
    this.dataArchivos.splice(indexRow, 1);
    this.dataSource = new MatTableDataSource<IArchivo>(this.dataArchivos);
  }

  showFile(indexRow: number) {
    const fileSelected = this.dataArchivos[indexRow].file;
    const reader = new FileReader();
    const self = this;

    reader.onload = function (readerEvt) {
      let binaryString = readerEvt.target?.result!;
      let base64 = btoa(binaryString.toString());
      self.utilsService.b64toBlob;
      let blobFile = self.utilsService.b64toBlob(
        base64,
        fileSelected.type,
        512
      );
      let urlBlobFile = window.URL.createObjectURL(blobFile);

      window.open(
        urlBlobFile,
        '_blank',
        'location=yes,height=650,width=600,scrollbars=yes,status=yes'
      );
    };
    reader.readAsBinaryString(fileSelected);
  }

  clear() {
    this.dataArchivos = [];
    this.dataSource = new MatTableDataSource<IFnzArchivo>();
  }

  public static base64toBlob(
    b64Data: string,
    contentType: string,
    sliceSize: number
  ) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
