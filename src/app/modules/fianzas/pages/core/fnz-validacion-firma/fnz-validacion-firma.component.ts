import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IConfiguracionDocumentalCatalogs } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { IFnzValidacionDigital } from 'src/app/modules/fianzas/pages/core/helpers/interfaces/fnz-validacion-documental';
import { IFnzWorklFlow } from 'src/app/modules/fianzas/pages/core/helpers/interfaces/fnz-workflow';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { FnzEstatusBitacoraConsts } from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import { EFnzActividad } from '../../../helpers/enums/fnz-actividad.enum';
import { EFnzEstatusActividad } from '../../../helpers/enums/fnz-estatus-actividad.enum';
import { FnzComentarioService } from '../../../services/fnz-comentario.service';
import { FnzExpedienteDigitalService } from '../../../services/fnz-expediente-digital.service';
import { FnzFirmaDocumentalService } from '../../../services/fnz-firma-documental.service';
import { FnzValidacionFirmasService } from '../../../services/fnz-validacion-firmas.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import { IFnzComentario } from '../helpers/interfaces/fnz-comentario';
import { ISaveComentario } from 'src/app/modules/administracion/helpers/interfaces/core-comentario';
import { IValidacionFirmasArchivos } from '../helpers/interfaces/fnz-validacion-firmas';

@Component({
  selector: 'app-fnz-validacion-firma',
  templateUrl: './fnz-validacion-firma.component.html',
  styleUrls: ['./fnz-validacion-firma.component.scss'],
})
export class FnzValidacionFirmaComponent {
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
  currentActividad!: EFnzActividad;
  currenActividadEstatus!: EFnzEstatusActividad;
  motivos: Array<ICatalogo> = [];
  firmaDocumental: IFnzValidacionDigital = {};
  existeCotejo = false;
  currentId: string = '';
  pageSize: number = 5;
  pageIndex: number = 0;
  listArchivosValidacion: Array<IValidacionFirmasArchivos> = [];
  paginateParams: IPaginateParams = {
    pageSize: this.pageSize,
    pageIndex: this.pageIndex,
    order: 'rowIndex',
    sort: 'asc',
    search: '',
  };

  constructor(
    private swalService: SwalService,
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private workflowService: FnzWorkFlowService,
    private expedienteService: FnzExpedienteDigitalService,
    private validacionService: FnzValidacionFirmasService,
    private comentarioService: FnzComentarioService,
    private utilsService: UtilsService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private ConfiguracionDocumentalService: AdmConfiguracionDocumentalService,
    private firmaDocumentalService: FnzFirmaDocumentalService,
    private router: Router,
    public _utils: UtilsService,
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    const folio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;
    const actividadCodigo = EFnzActividad.VALIDACION_FIRMAS;

    if (!folio || !actividadCodigo) {
      this.cancelar();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, actividadCodigo)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.currentActividad = response.data.actividadCodigo;
            this.currenActividadEstatus = response.data.estatusActividad;
            this.setComentario();
            this.getMotivosRechazo();
            this.getComentarios(true);
            this.getArchivos();
          } else {
            console.error(response.message);
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
                (element) => element.clave === 6 || element.clave === 8
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
    }

    this.firmaDocumentalService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            this.currentId = response.data._id;
            this.firmaDocumental = response.data;
            this.validacion = response.data;
            this.documentosValidacion.forEach((element: any) => {
              if (
                this.validacion!.archivoFic != undefined &&
                element.clave == EDocumento.FIC
              ) {
                this.listArchivosValidacion.push({ documento: element.documento_id });
              }

              if (
                this.validacion!.archivoAnexo != undefined &&
                element.clave == EDocumento.ANEXO
              ) {
                this.listArchivosValidacion.push({ documento: element.documento_id });
              }

            })

          }
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });


    this.validacionService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            debugger
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

    if (!this.IDCOMENTARIO) {
      this.comentarioService.create(dataForComentary).subscribe((response) => {
        const { _id } = response.data;
        this.IDCOMENTARIO = _id;
      });
    } else {
      this.comentario.actividades.comentarios = dataForComentary.comentarios;
      this.comentarioService
        .update(`${this.folio.folio}`, this.comentario)
        .subscribe((response) => { });
    }

    if (this.documentosValidacion.filter((x) => !x.correcto).length > 0) {
      let workflow: IFnzWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: EFnzActividad.FIRMA_DOCUMENTAL,
        actividad: '',
        notificacion: EFnzNotificacion.SOLICITUD_FIRMA_ASEGURADO,
        reproceso: true,
        comentarios: this.formComentario.form.controls['comentarios']?.value,
      };

      if (this.documentosValidacion.length == 1) {
        const idMotivo = docsForm.control.get(
          `motivo${this.documentosValidacion.length - 1}`
        )?.value;
        const { statusBitacora } = this.getProcesoYStatusBitacora(idMotivo);
        workflow.actividad = statusBitacora;
      }

      if (this.documentosValidacion.length > 1) {
        const { statusBitacora } = this.getProcesoYStatusBitacora(0);
        workflow.actividad = statusBitacora;
      }

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: `Información almacenada correctamente, se reprocesa la actividad a <b>Firma Documental</b>.`,
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    } else {
      const isCotejado = await this.validarDocumentosCotejados();
      if(!isCotejado) {
        this.swalService.warning({
          text: 'Debe cotejar al menos 1 documento para avanzar a validación afianzadora',
        });
        return;
      }

      let workflow: IFnzWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: EFnzActividad.VALIDACION_AFIANZADORA,
        actividad: FnzEstatusBitacoraConsts.FORMATOS_ENVIADOS_A_AFIANZADORA,
        notificacion: EFnzNotificacion.FORMATOS_FIRMADOS,
        comentarios: this.formComentario.form.controls['comentarios']?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: `Información almacenada correctamente, se avanzó la actividad a <b>Validación Afianzadora</b>.`,
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    }
  }

  getProcesoYStatusBitacora(idMotivo: number) {
    let existMotivoFormatoIncorrecto = false;

    const MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD: any = {
      6: EFnzActividad.FIRMA_DOCUMENTAL,
      8: EFnzActividad.FIRMA_DOCUMENTAL,
    };

    const MOTIVOS_RECHAZO_STATUS_BITACORA: any = {
      6: FnzEstatusBitacoraConsts.EN_ESPERA_DE_FIRMA_ASEGURADO,
      8: FnzEstatusBitacoraConsts.CORRECION_DE_FORMATOS,
    };
    let statusBitacora = '';
    let idActividad = 0;
    let idMotivoOutput = 0;

    if (this.documentosValidacion.length == 1) {
      statusBitacora = MOTIVOS_RECHAZO_STATUS_BITACORA[idMotivo];
      idActividad = MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[idMotivo];
    }

    if (this.documentosValidacion.length > 1) {
      if (this.documentosValidacion.filter((x) => !x.correcto).length > 1) {
        existMotivoFormatoIncorrecto =
          this.documentosValidacion.filter((x) => x.idMotivo == 8).length > 0;
        idActividad =
          MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[
          existMotivoFormatoIncorrecto ? 6 : 6
          ];
        statusBitacora =
          MOTIVOS_RECHAZO_STATUS_BITACORA[existMotivoFormatoIncorrecto ? 8 : 6];
      } else {
        let idMotivo = this.documentosValidacion
          .filter((x) => !x.correcto)
          .map((x) => x.idMotivo)[0];
        idActividad = MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[idMotivo];
        statusBitacora = MOTIVOS_RECHAZO_STATUS_BITACORA[idMotivo];
      }

      idMotivoOutput = Number(
        Object.keys(MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD).find((key) => {
          return MOTIVOS_RECHAZO_REPROCESO_ACTIVIDAD[key] == idActividad;
        })
      );
    }

    return { statusBitacora, idActividad, idMotivoOutput };
  }

  onChangeCheck(index: number, event: MatSlideToggleChange): void {
    debugger
    if (event.checked) {
      this.documentosValidacion[index].correcto = true;
      this.documentosValidacion[index].idMotivo = 0;
      this.listArchivosValidacion[index].correcto = true;
      this.listArchivosValidacion[index].motivo = 0;
    } else {
      this.listArchivosValidacion[index].correcto = false;
      this.documentosValidacion[index].correcto = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  mostrar(row: string) {
    const idArchivo =
      row == EDocumento.FIC
        ? this.firmaDocumental.archivoFic
        : this.firmaDocumental.archivoAnexo;
    this.expedienteService.getByArchivo(idArchivo!).subscribe({
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

  async validarDocumentosCotejados() {
    try {
      const response = await lastValueFrom(
        this.expedienteService.find_by_titular_cotejo_paginate(
          this.folio.pais,
          this.folio.aseguradoraId,
          this.folio.proyecto,
          this.folio.titular,
          this.paginateParams
        )
      );

      const validarDocumentosCotejados = response.data.docs.filter(
        (file: any) => file.cotejado != null
      );

      if (validarDocumentosCotejados.length > 0) this.existeCotejo = true;
      else this.existeCotejo = false;

      return this.existeCotejo;
    } catch (error) {
      return false;
    }
  }

  cancelar() {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
