import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { IArchivo } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { AppConsts } from 'src/app/shared/AppConsts';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fnz-shared-upload',
  templateUrl: './fnz-shared-upload.component.html',
  styleUrls: ['./fnz-shared-upload.component.css'],
})
export class FnzSharedUploadComponent implements OnInit, OnChanges {
  @Input() documentos: any;
  @Input() titular: string = '';
  @Input() aseguradora: string = '';
  @Output() updateEventUploadEmitter = new EventEmitter<any>();
  @Output() updateEventResponseEmitter = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;

  displayedColumns: string[] = [
    'nombreOriginal',
    'documento',
    // 'fechaVigencia',
    'operaciones',
  ];
  extension_valid: string = AppConsts.FILE.EXTENSION_VALID;
  isUploading: Boolean = false;
  uploadProgress: number = 0;
  dataSource = new MatTableDataSource<IArchivo>();
  dataArchivos: IArchivo[] = [];
  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  minDateFin = moment();

  constructor(
    private notifierService: NotifierService,
    private http: HttpClient,
    private swalService: SwalService,
    private router: Router,
    private utilsService: UtilsService
  ) {}
  ngOnChanges(): void {}
  ngOnInit(): void {}

  onDragover(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDragout(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onChangeDocumento(index: number, value: string) {
    this.dataArchivos[index].documento = value;
    this.dataArchivos[index].nombreDocumento = this.documentos.find(
      (x: any) => x.documento === value
    )?.nombreBase;
    const vigencia = this.documentos.find(
      (element: any) => element.documento === value
    )?.vigencia;
    this.dataArchivos[index].vigencia = vigencia;
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
        let archivo: IArchivo = {
          documento: '',
          nombreDocumento: '',
          titular: this.titular,
          aseguradora: this.aseguradora,
          file: files![i],
          nombreOriginal: files![i].name,
          vigencia: false,
          fechaVigencia: new Date(),
        };
        this.dataArchivos.push(archivo);
        this.dataSource = new MatTableDataSource<IArchivo>(this.dataArchivos);
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
      this.upload_file_masivo(contador, request, item);
    });
  }

  upload_file_masivo(contador: number, request: any, item: any) {
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
            this.updateEventUploadEmitter.emit(item);
          })
        )
        .subscribe(
          (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round(
                (100 * event.loaded) / event.total!
              );
            } else if (event.type === HttpEventType.Response) {
              const response = event.body as any; // Conversión de tipo
              if (response.success) {
                this.updateEventResponseEmitter.emit(response.data);
              }
            }
            if (event instanceof HttpResponse) {
              resolve();
              if (this.dataArchivos.length == contador) {
                this.notifierService.success(
                  'Los archivos se cargaron correctamente'
                );
              }
            }
          },
          (error) => {
            this.notifierService.error(error?.error?.message, 'Error');
          }
        );
    });
  }

  setFormData(file: IArchivo): FormData {
    const formData = new FormData();
    formData.append('file', file!.file);
    formData.append('aseguradora', file.aseguradora);
    formData.append('titular', file.titular);
    formData.append('documento', file.documento);
    formData.append('nombreOriginal', file.nombreOriginal);
    formData.append('nombreDocumento', file.nombreDocumento);
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
    this.dataSource = new MatTableDataSource<IArchivo>();
  }

  generarMensajeHtml(documentos: Array<string>): string {
    let mensaje = '';
    mensaje += "<div style='text-align: left'> </br>";
    mensaje += '<ul>';
    documentos.forEach((element: any) => {
      mensaje += '<li>';
      mensaje += element;
      mensaje += '</li>';
    });
    mensaje += '</ul>';
    mensaje += '</div> </br>';
    return mensaje;
  }
}
