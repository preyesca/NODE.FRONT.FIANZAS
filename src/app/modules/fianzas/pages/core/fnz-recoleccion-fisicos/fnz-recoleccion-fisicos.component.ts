import {HttpClient, HttpEventType, HttpRequest} from '@angular/common/http';
import {Component} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {lastValueFrom} from 'rxjs';

import {IConfiguracionDocumental} from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import {IFnzWorklFlow} from 'src/app/modules/fianzas/pages/core/helpers/interfaces/fnz-workflow';
import {AppConsts} from 'src/app/shared/AppConsts';
import {IResponse} from 'src/app/shared/helpers/interfaces/response';
import {IUserStorageUserDto} from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import {NotifierService} from 'src/app/shared/services/notification/notifier.service';
import {SwalService} from 'src/app/shared/services/notification/swal.service';
import {UserStorageService} from 'src/app/shared/services/storage/user-storage.service';
import {environment} from 'src/environments/environment';
import {FnzEstatusBitacoraConsts} from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import {EFnzActividad} from '../../../helpers/enums/fnz-actividad.enum';
import {FnzComentarioService} from '../../../services/fnz-comentario.service';
import {FnzRecoleccionFisicosService} from '../../../services/fnz-recoleccion-fisicos.service';
import {FnzWorkFlowActividadService} from '../../../services/fnz-workflow-actividad.service';
import {FnzWorkFlowService} from '../../../services/fnz.workflow.service';
import {EFnzNotificacion} from '../helpers/enums/fnz.notificacion.enum';
import {IFnzBandejaPaginate} from '../helpers/interfaces/fnz-bandeja';
import {
  IFnzArchivo,
  IFnzCargaDocumentalMasivaCatalogs,
} from '../helpers/interfaces/fnz-carga-documental';
import {IFnzComentario} from '../helpers/interfaces/fnz-comentario';
import {FileType} from './interfaces/file-response.interface';
import {RecoleccionFisicosType} from './interfaces/recoleccion-fisicos-response.interface';
import {EDocumento} from "../../../../../shared/helpers/enums/core/documento.enum";
import { AdmDocumentoService } from 'src/app/modules/administracion/services/adm-documento.service';
import { ISaveComentario } from 'src/app/modules/administracion/helpers/interfaces/core-comentario';

@Component({
  selector: 'app-fnz-recoleccion-fisicos',
  templateUrl: './fnz-recoleccion-fisicos.component.html',
  styleUrls: ['./fnz-recoleccion-fisicos.component.scss'],
})
export class FnzRecoleccionFisicosComponent {
  breadcrumbs = ['Fianzas', 'Recolección de físicos '];

  frmRecoleccionFisicos!: FormGroup;
  idFolio: number = 0;
  placeholderFile = 'Seleccione un archivo';
  fileName: string = '';
  extension_valid: string = AppConsts.FILE.EXTENSION_VALID_CONFIRM_SEND;
  catalogos: IFnzCargaDocumentalMasivaCatalogs = {};
  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IFnzBandejaPaginate;
  configuracion!: IConfiguracionDocumental;
  userSession!: IUserStorageUserDto;
  archivo!: any;
  isUploading: Boolean = false;
  uploadProgress: number = 0;
  comentario!: IFnzComentario;
  flagFile = false;
  documentoId = '';


  readonlyModule: boolean = false;
  loading: boolean = true;
  fileUploadExpDigital = {} as FileType;
  dataCoreRecoFisic = {} as RecoleccionFisicosType;

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private notifierService: NotifierService,
    private swalService: SwalService,
    private router: Router,
    private userStorageService: UserStorageService,
    private http: HttpClient,
    private workflowService: FnzWorkFlowService,
    private recoleccionFisicosService: FnzRecoleccionFisicosService,
    private comentarioService: FnzComentarioService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private admDocumentoService: AdmDocumentoService
  ) {
  }

  ngOnInit(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    this.readonlyModule = history.state.readonlyModule || false;
    const folio = this.route.snapshot.paramMap.get('id') || undefined;
    const actividadCodigo = EFnzActividad.RECOLECCION_DE_FISICOS;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, actividadCodigo)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;

            this.loadForm();
            this.getComentarios(true);
            this.getClaveGuia();
            this.getDocumento();
            // this.iniciarActividad();

            this.loading = false;
          } else {
            console.error(response.message);
            this.return();
          }
        },
        error: (err) => {
          this.notifierService.warning(err?.error?.message);
          this.return();
        },
      });
  }

  async getDocumento(): Promise<void> {
    const response = await lastValueFrom(
      this.admDocumentoService.getByClave(EDocumento.ACUSE_ENVIO)
    );
    this.documentoId = response.data._id;
  }


  async iniciarActividad() {
    if (this.folio.fechaInicial !== null) return;
    this.workflowService
      .actualizarActividad(this.folio.actividadId)
      .subscribe((response) => { });
  }

  async getComentarios(setForm: boolean) {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );

    if (response.success && response.data.length > 0) {
      if (setForm)
        this.frmRecoleccionFisicos.patchValue({
          comentarios: response.data[0].actividades.comentarios,
        });
      this.IDCOMENTARIO = response.data[0]._id;
    }
  }

  async getClaveGuia() {
    const response = await lastValueFrom(
      this.recoleccionFisicosService.findOneRecoFisic(this.folio.folio)
    );
    if (response.success) {
      this.frmRecoleccionFisicos.patchValue({
        claveGuia: response.data.claveGuia,
      });
    }
  }

  loadForm(): void {
    this.frmRecoleccionFisicos = this.formBuilder.group({
      id: new FormControl(0, [Validators.required]),
      idFolio: new FormControl(this.idFolio, [Validators.required]),
      claveGuia: new FormControl(''),
      comentarios: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 áéíóúñÁÉÍÓÚÑ.,]+$/),
      ]),
    });

    if (this.readonlyModule) this.frmRecoleccionFisicos.disable();
  }

  RecoleccionFisicosSubmit() {
    const validar = this.validacionesFormulario(this.frmRecoleccionFisicos);
    if (!validar) {
      return;
    }

    const comentario = this.frmRecoleccionFisicos.controls['comentarios'].value;
    let comentarios: IFnzComentario = {
      folio: this.folio.folio,
      actividades: {
        actividad: this.folio.actividadCodigo,
        comentarios: comentario,
      },
    };

    this.comentario = comentarios;
    this.sendCoreRecoFisic();
    this.workflowMarcado();
  }

  async workflowMarcado() {

    const dataForComentary: ISaveComentario = {
      folio: this.folio.folio,
      comentarios: this.comentario.actividades.comentarios,
      actividad: this.folio.actividadCodigo,
    };

    await this.getComentarios(false);

    if (this.IDCOMENTARIO == undefined) {
      this.comentarioService.create(dataForComentary).subscribe((response) => {
        const { _id } = response.data;
        this.IDCOMENTARIO = _id;
      });
    } else {
      this.comentarioService
        .update(`${this.IDCOMENTARIO}`, this.comentario)
        .subscribe((response) => { });
    }

    const workflow: IFnzWorklFlow = {
      folio: this.folio.folio,
      actividadInicial: this.folio.actividadCodigo,
      actividadFinal: EFnzActividad.VALIDACION_DE_ORIGINALES,
      actividad: FnzEstatusBitacoraConsts.FISICOS_ENVIADOS,
      notificacion: EFnzNotificacion.FISICOS_ENVIADOS,
      comentarios: this.frmRecoleccionFisicos.get('comentarios')?.value,
    };

    this.workflowService.avanzar(workflow).subscribe((response) => {
      this.swalService
        .success({
          html: `Información almacenada correctamente, se avanzó la actividad a <b>Validación Originales</b>.`,
        })
        .then(() => {
          this.router.navigate(['/bandejas']);
        });
    });
  }

  cargarMultiple(files: FileList | null) {
    let blnMensaje = false;
    if (files == null) return false;

    this.fileName = files[0].name;
    for (let i = 0; i < files!.length; i++) {
      const strExtension = files![i].name
        .split('.')
      [files![i].name.split('.').length - 1].toUpperCase();
      const lstExtensiones = this.extension_valid.split(',');

      if (lstExtensiones.includes('.' + strExtension)) {
        let archivo: IFnzArchivo = {
          documento: '',
          nombreDocumento: '',
          titular: this.folio.titular,
          aseguradora: this.folio.aseguradoraId,
          file: files![i],
          nombreOriginal: files![i].name,
          vigencia: false,
          fechaVigencia: new Date(),
        };
        this.archivo = archivo;
      } else {
        blnMensaje = true;
      }
    }

    if (blnMensaje) {
      this.notifierService.warning(
        'Ups, las extensiones permitidas son <br>' +
        this.extension_valid.split('.').join(' ')
      );
      this.fileName = '';
    }
    return;
  }

  subirCarga(): boolean {
    if (!this.archivo) {
      this.notifierService.warning(
        'Es necesario seleccionar al menos un documento'
      );
      return false;
    }
    let contador = 0;

    this.isUploading = false;
    this.uploadProgress = 0;
    contador += 1;
    this.archivo.documento = this.documentoId;
    const formData: FormData = this.setFormData(this.archivo);

    this.traerIdArchivoSubido(formData);

    this.isUploading = true;
    this.flagFile = true;
    return true;
  }

  traerIdArchivoSubido(formData: FormData) {
    const request = new HttpRequest(
      'POST',
      `${environment.urlApi}/expedientedigital/archivos`,
      formData,
      {
        reportProgress: true, // Habilitar el reporte de progreso
      }
    );

    this.http.request(request).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total!);
        } else if (event.type === HttpEventType.Response) {
          const response = event.body as IResponse<FileType>; // Conversión de tipo
          if (response.success) {
            this.fileUploadExpDigital = response.data;
            this.isUploading = false;
            /* Limpiar el file */
            this.fileName = '';
            this.archivo = null;
            this.notifierService.success(
              'Los archivos se cargaron correctamente'
            );
          }
        }
      },
      (error) => {
        this.isUploading = false;
        this.notifierService.warning(
          'Información',
          'Sucedió un error al cargar los archivos'
        );
      }
    );
  }

  sendCoreRecoFisic() {
    this.dataCoreRecoFisic.folio = this.folio.folio;
    this.dataCoreRecoFisic.archivo = this.fileUploadExpDigital._id;
    this.dataCoreRecoFisic.claveGuia =
      this.frmRecoleccionFisicos.get('claveGuia')?.value;

    this.recoleccionFisicosService
      .sendCoreRecoFisic(this.dataCoreRecoFisic)
      .subscribe({
        next: (response: IResponse<RecoleccionFisicosType>) => { },
        error: (err) => this.notifierService.warning(err?.error?.message),
      });
  }

  validacionesFormulario(frm: FormGroup): boolean {
    const validaciones = frm.controls;

    const comentarios = validaciones['comentarios'].value;
    if (comentarios.trim() === '') {
      this.notifierService.warning(
        'Debe ingresar un comentario para continuar.',
        'Advertencia'
      );
      return false;
    }

    if (!this.flagFile) {
      this.notifierService.warning('Subir archivo', 'Advertencia');
      return false;
    }

    return true;
  }

  setFormData(file: IFnzArchivo): FormData {
    const formData = new FormData();
    formData.append('file', file!.file);
    formData.append('aseguradora', file.aseguradora);
    formData.append('titular', file.titular);
    formData.append('documento', file.documento);
    formData.append('nombreOriginal', file.nombreOriginal);
    formData.append('nombreDocumento', file.nombreDocumento);
    return formData;
  }

  return(): void {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
