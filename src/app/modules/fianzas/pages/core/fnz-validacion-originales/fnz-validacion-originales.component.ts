import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IFnzValidacionDigital } from 'src/app/modules/fianzas/pages/core/helpers/interfaces/fnz-validacion-documental';
import { IFnzWorklFlow } from 'src/app/modules/fianzas/pages/core/helpers/interfaces/fnz-workflow';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { EFnzActividad } from '../../../helpers/enums/fnz-actividad.enum';
import { EFnzEstatusActividad } from '../../../helpers/enums/fnz-estatus-actividad.enum';
import { FnzComentarioService } from '../../../services/fnz-comentario.service';
import { FnzExpedienteDigitalService } from '../../../services/fnz-expediente-digital.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';

import { IConfiguracionDocumentalCatalogs } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { FnzEstatusBitacoraConsts } from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import { FnzValidacionOriginalesService } from '../../../services/fnz-validacion-originales.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import { IFnzComentario } from '../helpers/interfaces/fnz-comentario';
import { ISaveComentario } from 'src/app/modules/administracion/helpers/interfaces/core-comentario';
import { IValidacionOriginalesArchivos } from '../helpers/interfaces/fnz-validacion-originales';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IFnzArchivo } from '../helpers/interfaces/fnz-carga-documental';
import { ConfirmacionEntregaService } from '../../../services/fnz-confirmacion-entrega.service';
import { IFnzConfirmacionEntrega } from '../helpers/interfaces/fnz-confirmacion-entrega';
import { AdmDocumentoService } from 'src/app/modules/administracion/services/adm-documento.service';

@Component({
  selector: 'app-fnz-validacion-originales',
  templateUrl: './fnz-validacion-originales.component.html',
  styleUrls: ['./fnz-validacion-originales.component.scss'],
})
export class FnzValidacionOriginalesComponent {
  userSession!: IUserStorageUserDto;
  folio!: IFnzBandejaPaginate;
  validacion: IFnzValidacionDigital = {};
  @ViewChild('formArchivo', { read: NgForm }) formComentario: any;

  breadcrumbs: string[] = ['Fianzas', 'Validación de firmas'];
  displayedColumns: string[] = ['document', 'archive', 'check', 'status'];
  idFolio: number = 0;
  lstTodosDocumentos: Array<any> = [];
  ultimoEstatus?: string;
  comentarioRequiere: boolean = true;
  documentosValidacion: Array<any> = [];
  documentosFIC: Array<any> = [];
  currentValidacionId: string = '';
  comentario!: IFnzComentario;
  IDCOMENTARIO: string | undefined = undefined;
  readonlyModule: boolean = false;
  currentActividad: EFnzActividad = EFnzActividad.VALIDACION_DE_ORIGINALES;
  currenActividadEstatus!: EFnzEstatusActividad;
  motivos: Array<ICatalogo> = [];
  listArchivosValidacion: Array<IValidacionOriginalesArchivos> = [];

  extension_valid: string = AppConsts.FILE.EXTENSION_VALID_CONFIRM_SEND;
  archivo!: any;
  documentoId = '';
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
  fileName: string = '';
  isUploading: Boolean = false;
  uploadProgress: number = 0;

  constructor(
    private router: Router,
    private swalService: SwalService,
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private workflowService: FnzWorkFlowService,
    private expedienteService: FnzExpedienteDigitalService,
    private validacionService: FnzValidacionOriginalesService,
    public _utils: UtilsService,
    private comentarioService: FnzComentarioService,
    private utilsService: UtilsService,
    private readonly route: ActivatedRoute,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private ConfiguracionDocumentalService: AdmConfiguracionDocumentalService,
    private confirmacionEntregaService: ConfirmacionEntregaService,
    private admDocumentoService: AdmDocumentoService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    const folio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;

    if (!folio) {
      this.cancelar();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(
        folio,
        EFnzActividad.VALIDACION_DE_ORIGINALES
      )
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.currentActividad = response.data.actividadCodigo;
            this.currenActividadEstatus = response.data.estatusActividad;
            this.setComentario();
            this.getComentarios(true);
            this.getArchivos();
            this.getMotivosRechazo();
            this.getDocumento();
          } else {
            this.cancelar();
          }
        },
        error: (err) => {
          this.notifierService.warning(err?.error?.message);
          this.cancelar();
        },
      });
  }

  setComentario() {
    let comentarios: IFnzComentario = {
      folio: this.folio.folio,
      actividades: {
        actividad: this.folio.actividadCodigo,
        comentarios: '',
      },
    };
    this.comentario = comentarios;
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
        this.formComentario.form.controls['comentarios']?.setValue(
          response.data[0].actividades.comentarios
        );
      this.IDCOMENTARIO = response.data[0]._id;
    }
  }

  async getArchivos() {
    const responseArchivos = await lastValueFrom(
      this.expedienteService.find_by_Titular(
        this.folio.pais,
        this.folio.aseguradoraId,
        this.folio.proyecto,
        this.folio.titular
      )
    );
    if (responseArchivos.success) {
      this.documentosValidacion = [
        ...new Set(
          responseArchivos.data.filter(
            (element: any) =>
              element.categoria === 3 &&
              element.clave !== EDocumento.CONFIRMACION_ENTREGA
          )
        ),
      ];

      this.documentosValidacion.forEach((element: any) => {
        if (element.clave == EDocumento.FIC) {
          this.listArchivosValidacion.push({ documento: element.documento_id });
        }

        if (element.clave == EDocumento.ANEXO) {
          this.listArchivosValidacion.push({ documento: element.documento_id });
        }

      })
    }

    this.validacionService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            this.currentValidacionId = response.data._id;
            this.documentosValidacion = [
              ...new Set(
                responseArchivos.data.filter(
                  (element: any) =>
                    element.categoria === 3 &&
                    element.clave !== EDocumento.CONFIRMACION_ENTREGA
                )
              ),
            ];

            response.data.archivos.forEach((element: any) => {

              this.listArchivosValidacion.map(x => {
                if (x.documento === element.documento) {
                  x.motivo = element.motivo
                  x.correcto = element.correcto
                }
              })

              const archivos = this.documentosValidacion.find(
                (j) => j.documento_id === element.documento
              );

              this.documentosValidacion = this.documentosValidacion.map(
                (x) =>
                  x.documento_id === archivos.documento_id
                    ? { ...x, correcto: element.correcto, idMotivo: element.motivo }
                    : x
              );
            });
          }
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
  }

  onChangeMotivo(index: number, value: number, event: any) {
    if (event.isUserInput) {
      this.listArchivosValidacion[index].motivo = value;
      this.documentosValidacion[index].idMotivo = value;
    }
  }

  getMotivosRechazo() {
    this.ConfiguracionDocumentalService.getCatalogs().subscribe({
      next: (response: IResponse<IConfiguracionDocumentalCatalogs>) => {
        if (response.success) {
          this.motivos = [
            ...new Set(
              response.data.motivo.filter(
                (element) =>
                  element.clave === 2 ||
                  element.clave === 3 ||
                  element.clave === 4
              )
            ),
          ];
        } else console.error(response.message);
      },
      error: (err) => {
        this.cancelar();
        this.notifierService.error(err?.error?.message, 'Error');
      },
    });
  }

  async click_guardar(docsForm: NgForm) {
    this.documentosValidacion.forEach((element, index) => {
      if (!element.correcto && element.idMotivo == 0) {
        docsForm.form.controls['motivo' + index].setErrors({ incorrect: true });
      }
    });

    if (!docsForm.valid) {
      this.swalService.info({
        html: 'Debe completar los campos requeridos.',
      });
      return;
    }

    this.listArchivosValidacion.map((x) => {
      const filter = this.documentosValidacion.filter(
        (j) => x.documento === j.documento_id
      );
      x.expediente = filter[0].id;
    });


    this.validacion.folio = this.folio.folio;
    this.validacion.archivos = this.listArchivosValidacion;
    if (this.currentValidacionId === '') {
      this.validacion.folio = this.folio.folio;
      this.validacionService
        .create(this.validacion)
        .subscribe((response) => { });
    } else {
      this.validacionService
        .update(this.currentValidacionId, this.validacion)
        .subscribe((response) => { });
    }


    const dataForComentary: ISaveComentario = {
      folio: this.folio.folio,
      comentarios: docsForm.control.get('comentarios')?.value,
      actividad: this.folio.actividadCodigo,
    };

    await this.getComentarios(false);

    if (this.IDCOMENTARIO == undefined) {
      this.comentarioService.create(dataForComentary).subscribe((response) => {
        const { _id } = response.data;
        this.IDCOMENTARIO = _id;
      });
    } else {
      this.comentario.actividades.comentarios = docsForm.control.get('comentarios')?.value;
      this.comentarioService
        .update(`${this.IDCOMENTARIO}`, this.comentario)
        .subscribe((response) => { });
    }

    if (this.documentosValidacion.filter((x) => !x.correcto).length > 0) {
      let workflow: IFnzWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: EFnzActividad.RECOLECCION_DE_FISICOS,
        actividad: FnzEstatusBitacoraConsts.RECOLECCION_DE_FISICOS,
        notificacion: EFnzNotificacion.REVISION_DOCUMENTACION_FISICA,
        reproceso: true,
        comentarios: this.formComentario.form.controls['comentarios']?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: `Información almacenada correctamente, se reprocesa la actividad a <b>Recolección de físicos</b>.`,
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    } else {
      let workflow: IFnzWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: EFnzActividad.CONFIRMACION_ENTREGA,
        actividad: FnzEstatusBitacoraConsts.FORMATOS_ENVIADOS_A_AFIANZADORA,
        notificacion: 0,
        comentarios: this.formComentario.form.controls['comentarios']?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: `Información almacenada correctamente, se reprocesa la actividad a <b>Confirmación de entrega</b>.`,
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    }
  }

  onChangeCheck(index: number, event: MatSlideToggleChange): void {
    if (event.checked) {
      this.documentosValidacion[index].correcto = true;
      this.documentosValidacion[index].idMotivo = 0;
      this.listArchivosValidacion[index].correcto = true;
      this.listArchivosValidacion[index].motivo = 0;
    } else {
      this.listArchivosValidacion[index].correcto = false;
      this.documentosValidacion[index].correcto = false;
    }
  }

  async mostrar(element: any) {
    let a = document.createElement('a');
    this.expedienteService.getByArchivo(element.id).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          let blobFile = this.utilsService.b64toBlob(
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

  cancelar() {
    this.router.navigate([
      `/${this.readonlyModule ? 'busquedas' : 'bandejas'}`,
    ]);
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
    this.confirmacionEntrega.archivos[0].fechaHoraAlta = resp.data.fechaHoraAlta;
    this.notifierService.success('El archivo se cargó correctamente');
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

  async getDocumento(): Promise<void> {
    const response = await lastValueFrom(
      this.admDocumentoService.getByClave(EDocumento.VALIDACION_DE_ORIGINALES)
    );
    this.documentoId = response.data._id;
  }
}
