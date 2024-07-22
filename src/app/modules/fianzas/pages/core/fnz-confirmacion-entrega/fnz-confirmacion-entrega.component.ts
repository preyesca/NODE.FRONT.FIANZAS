import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, lastValueFrom } from 'rxjs';

import { IConfiguracionDocumental } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { IFnzWorklFlow } from 'src/app/modules/fianzas/pages/core/helpers/interfaces/fnz-workflow';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { FnzEstatusBitacoraConsts } from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import { EFnzActividad } from '../../../helpers/enums/fnz-actividad.enum';
import { FnzComentarioService } from '../../../services/fnz-comentario.service';
import { ConfirmacionEntregaService } from '../../../services/fnz-confirmacion-entrega.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import {
  IFnzArchivo,
  IFnzCargaDocumentalMasivaCatalogs,
} from '../helpers/interfaces/fnz-carga-documental';
import { IFnzComentario } from '../helpers/interfaces/fnz-comentario';
import { IFnzConfirmacionEntrega } from '../helpers/interfaces/fnz-confirmacion-entrega';
import { ISaveComentario } from 'src/app/modules/administracion/helpers/interfaces/core-comentario';
import { AdmDocumentoService } from 'src/app/modules/administracion/services/adm-documento.service';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';

@Component({
  selector: 'app-fnz-confirmacion-entrega',
  templateUrl: './fnz-confirmacion-entrega.component.html',
  styleUrls: ['./fnz-confirmacion-entrega.component.scss'],
})
export class FnzConfirmacionEntregaComponent {
  breadcrumbs: string[] = ['Fianzas', 'Confirmacion de entrega'];
  frmConfirmacionEntrega!: FormGroup;
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

  currentConfirmacionEntregaId: string = '';
  entregado: boolean = false;
  comentarioTemp: string = '';
  confirmacionEntrega: IFnzConfirmacionEntrega = {
    entregado: false,
    archivos: ([] = [
      {
        expediente: undefined,
        usuarioAlta: '',
        fechaHoraAlta: new Date(),
      },
    ]),
  };
  readonlyModule: boolean = false;
  loading: boolean = true;
  documentoId = '';


  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private notifierService: NotifierService,
    private swalService: SwalService,
    private router: Router,
    private userStorageService: UserStorageService,
    private http: HttpClient,
    private workflowService: FnzWorkFlowService,
    private comentarioService: FnzComentarioService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private confirmacionEntregaService: ConfirmacionEntregaService,
    private admDocumentoService: AdmDocumentoService
  ) { }

  ngOnInit(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    this.readonlyModule = history.state.readonlyModule || false;
    const folio = this.route.snapshot.paramMap.get('id') || undefined;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(
        folio,
        EFnzActividad.CONFIRMACION_ENTREGA
      )
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;

            this.loadForm(this.entregado);
            this.getComentarios();
            this.getConfirmacionEntrega();
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

  async getConfirmacionEntrega() {
    this.confirmacionEntregaService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            this.currentConfirmacionEntregaId = response.data._id;
            this.confirmacionEntrega = response.data;
            this.loadForm(this.confirmacionEntrega.entregado);
          }
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
  }

  async getComentarios() {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );
    if (response.success && response.data.length > 0) {
      this.comentarioTemp = response.data[0].actividades.comentarios;
      this.frmConfirmacionEntrega.patchValue({
        comentarios: response.data[0].actividades.comentarios,
      });
      this.IDCOMENTARIO = response.data[0]._id;
      this.loadForm(this.entregado);
    }
  }

  loadForm(entregado: boolean): void {
    this.frmConfirmacionEntrega = this.formBuilder.group({
      id: new FormControl(0, [Validators.required]),
      idFolio: new FormControl(this.idFolio, [Validators.required]),
      entregado: new FormControl(entregado, [Validators.required]),
      comentarios: new FormControl(this.comentarioTemp, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 áéíóúñÁÉÍÓÚÑ.,]+$/),
      ]),
    });

    if (this.readonlyModule) this.frmConfirmacionEntrega.disable();
  }

  ConfirmacionEntregaSubmit() {
    const validar = this.validacionesFormulario(this.frmConfirmacionEntrega);
    if (!validar) {
      return;
    }

    const comentario =
      this.frmConfirmacionEntrega.controls['comentarios'].value;
    let comentarios: IFnzComentario = {
      folio: this.folio.folio,
      actividades: {
        actividad: this.folio.actividadCodigo,
        comentarios: comentario,
      },
    };
    this.comentario = comentarios;

    this.swalService
      .question({
        text: 'Se finalizará el flujo, ¿Está de acuerdo?',
      })
      .then((result) => {
        if (result.value) {
          this.confirmacionEntrega.folio = this.folio.folio;
          if (this.currentConfirmacionEntregaId === '') {
            this.confirmacionEntrega.entregado =
              this.frmConfirmacionEntrega.controls['entregado'].value;
            this.confirmacionEntregaService
              .create(this.confirmacionEntrega)
              .subscribe((response) => { });
          } else {
            this.confirmacionEntregaService
              .update(
                this.currentConfirmacionEntregaId,
                this.confirmacionEntrega
              )
              .subscribe((response) => { });
          }

          const dataForComentary: ISaveComentario = {
            folio: this.folio.folio,
            comentarios: this.frmConfirmacionEntrega.get('comentarios')?.value,
            actividad: this.folio.actividadCodigo,
          };

          if (!this.IDCOMENTARIO) {
            this.comentarioService
              .create(dataForComentary)
              .subscribe((response) => {
                //TODO validar por que no se esta utilizando en alguna otra parte
                // const { _id } = response.data;
                // this.IDCOMENTARIO = _id;
              });
          }

          const workflow: IFnzWorklFlow = {
            folio: this.folio.folio,
            actividadInicial: this.folio.actividadCodigo,
            actividadFinal: EFnzActividad.FIN,
            actividad: FnzEstatusBitacoraConsts.GESTIONADO,
            notificacion: EFnzNotificacion.CONFIRMACION_ENTREGA,
            comentarios: this.frmConfirmacionEntrega.get('comentarios')?.value,
            idDocumento : this.documentoId
          };

          this.workflowService.avanzar(workflow).subscribe((response) => {
            this.swalService
              .success({
                text: 'Se finalizó correctamente la gestión del folio.',
              })
              .then(() => {
                this.router.navigate(['/bandejas/entradas']);
              });
          });
        }

        return;
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

  async subirCarga(): Promise<boolean> {
    if (!this.archivo) {
      this.notifierService.warning('No hay ningún archivo seleccionado.');
      return false;
    }
    let contador = 0;

    this.isUploading = false;
    this.uploadProgress = 0;
    contador += 1;
    this.archivo.documento = this.documentoId;


    const formData: FormData = this.setFormData(this.archivo);
    const resp = await lastValueFrom(
      this.confirmacionEntregaService.uploadFile(formData)
    );
    this.confirmacionEntrega.archivos[0].expediente = resp.data._id;
    this.confirmacionEntrega.archivos[0].usuarioAlta = resp.data.usuarioAlta;
    this.confirmacionEntrega.archivos[0].fechaHoraAlta =
      resp.data.fechaHoraAlta;
    this.notifierService.success('El archivo se cargó correctamente');
    return true;
  }

  validacionesFormulario(frm: FormGroup): boolean {
    const validaciones = frm.controls;

    if (!validaciones['entregado'].value) {
      this.notifierService.warning(
        'Debe estar activa la opción "Entregado" para continuar.',
        'Advertencia'
      );
      return false;
    }

    const comentarios = validaciones['comentarios'].value;
    if (comentarios.trim() === '') {
      this.notifierService.warning(
        'Debe ingresar un comentario para continuar.',
        'Advertencia'
      );
      return false;
    }

    return true;
  }

  upload_file_masivo(contador: number, request: any) {
    return new Promise((resolve: any, reject) => {
      this.http
        .request<[]>(request)
        .pipe(
          finalize(() => {
            this.isUploading = false;
            /* Limpiar el file */
            this.fileName = '';
            this.archivo = null;
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
              this.notifierService.success(
                'Los archivos se cargaron correctamente'
              );
            }
          },
          (error) => {
            this.notifierService.warning(
              'Información',
              'Sucedió un error al cargar los archivos'
            );
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
    formData.append('nombreDocumento', file.nombreDocumento);
    return formData;
  }

  return(): void {
    this.router.navigate([
      `/${this.readonlyModule ? 'busquedas' : 'bandejas'}`,
    ]);
  }

  async getDocumento(): Promise<void> {
    const response = await lastValueFrom(
      this.admDocumentoService.getByClave(EDocumento.CONFIRMACION_ENTREGA)
    );
    this.documentoId = response.data._id;
  }
}
