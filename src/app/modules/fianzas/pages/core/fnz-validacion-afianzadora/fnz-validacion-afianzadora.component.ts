import { Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {
  IConfiguracionDocumental,
  IConfiguracionDocumentalCatalogs,
  IConfiguracionDocumentalDocumentos,
} from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import {
  IArchivo,
  ICargaDocumentalMasivaCatalogs,
} from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
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
import { FnzValidacionAfianzadoraService } from '../../../services/fnz-validacion-afianzadora.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import { IFnzValidacionDigital } from '../helpers/interfaces/fnz-validacion-documental';
import {
  IFnzWorkflowDetalle,
  IFnzWorklFlow,
} from '../helpers/interfaces/fnz-workflow';
import { IValidacionDigitalArchivos } from 'src/app/modules/administracion/helpers/interfaces/core-validacion-documental';
import { FnzFirmaDocumentalService } from '../../../services/fnz-firma-documental.service';

@Component({
  selector: 'app-fnz-validacion-afianzadora',
  templateUrl: './fnz-validacion-afianzadora.component.html',
  styleUrls: ['./fnz-validacion-afianzadora.component.scss'],
})
export class FnzValidacionAfianzadoraComponent {
  breadcrumbs: string[] = ['Fianzas', 'Firma documental'];

  action!: EFormAction;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;

  userSession!: IUserStorageUserDto;
  displayedColumns: string[] = ['documento', 'url', 'correcto', 'idMotivo'];

  dataArchivos: IArchivo[] = [];
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IFnzBandejaPaginate;
  documentosValidacion: Array<any> = [];
  displayedColumnsFIC: string[] = ['documento', 'url'];
  documentosFIC: Array<any> = [];
  validacion: IFnzValidacionDigital = {};
  currentValidacionId: string = '';
  readonlyModule: boolean = false;
  motivos: Array<ICatalogo> = [];

  currentActividad!: EFnzActividad;
  currenActividadEstatus!: EFnzEstatusActividad;
  loading: boolean = true;

  listValidacion: Array<IValidacionDigitalArchivos> = [];
  model = signal<IFnzValidacionDigital>({});
  documentosTitular: Array<any> = [];

  constructor(
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private formBuilder: FormBuilder,
    private workflowService: FnzWorkFlowService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private comentarioService: FnzComentarioService,
    private expedienteService: FnzExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private firmaService: FnzFirmaDocumentalService,
    private validacionService: FnzValidacionAfianzadoraService,
    private swalService: SwalService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private utilsService: UtilsService,
    private ConfiguracionDocumentalService: AdmConfiguracionDocumentalService
  ) { }

  ngOnInit(): void {
    this.frmComentario = this.formBuilder.group({
      folio: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      titular: ['', [Validators.required]],
      comentarios: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.init();
  }

  init(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    const idFolio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;
    const actividadCodigo = EFnzActividad.VALIDACION_AFIANZADORA;

    if (!idFolio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(idFolio, actividadCodigo)
      .subscribe({
        next: (response: IResponse<IFnzWorkflowDetalle>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.currentActividad = response.data.actividadCodigo;
            this.currenActividadEstatus = response.data.estatusActividad;
            this.model.mutate((value) => (value.folio = this.folio.folio));
            this.getComentarios(true);
            this.getCatalogs();
            this.getArchivosTitular();

            this.frmComentario.patchValue({
              folio: this.folio.folio,
              actividad: this.folio.actividadCodigo,
              titular: this.folio.titular,
              comentarios: '',
            });
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

  async getArchivosTitular() {
    const responseArchivos = await lastValueFrom(
      this.expedienteService.find_by_Titular(
        this.folio.pais,
        this.folio.aseguradoraId,
        this.folio.proyecto,
        this.folio.titular
      )
    );
    if (responseArchivos.success) {
      this.documentosTitular = [
        ...new Set(
          responseArchivos.data.filter(
            (element: any) =>
              element.clave === EDocumento.FIC ||
              element.clave === EDocumento.ANEXO
          )
        ),
      ];
      this.documentosFIC = [
        ...new Set(
          responseArchivos.data.filter(
            (element: any) =>
              element.categoria === 3 &&
              element.clave !== EDocumento.CONFIRMACION_ENTREGA
          )
        ),
      ];
    }

    const firmaService = await lastValueFrom(
      this.firmaService.getByIdAndGetCatalogosToEdit(this.folio.folio)
    );

    if (firmaService.success) {
      this.validacion = firmaService.data;

      this.documentosValidacion = [];
      if (firmaService.data != null) {
        this.documentosTitular.forEach((element: any) => {
          let newElement = element;
          if (
            this.validacion!.archivoFic != undefined &&
            element.clave == EDocumento.FIC
          ) {
            newElement.id = this.validacion!.archivoFic;
            newElement.correcto = false;
            this.documentosValidacion.push(newElement);
          }
          if (
            this.validacion!.archivoAnexo != undefined &&
            element.clave == EDocumento.ANEXO
          ) {
            newElement.id = this.validacion!.archivoAnexo;
            newElement.correcto = false;
            this.documentosValidacion.push(newElement);
          }
        });

        this.listValidacion = [];
        this.documentosValidacion.forEach((x) => {
          this.listValidacion.push({ documento: x.documento_id, expediente: x.id });
        });
      }
    }

    this.validacionService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            if (response.data !== null) {
              this.model.mutate((value) => (value._id = response.data._id));
              this.model.mutate((value) => (value.archivos = response.data.archivos));
              if (response.data.archivos.length > 0) {
                response.data.archivos.forEach((element: any) => {
                  const archivos = this.documentosValidacion.filter(
                    (x) => x.documento_id === element.documento
                  );
                  if (archivos.length > 0) {
                    this.documentosValidacion = this.documentosValidacion.map(
                      (x) =>
                        x.clave === archivos[0].clave
                          ? { ...x, correcto: element.correcto }
                          : x
                    );
                  }
                });
              }
            } else {
              this.validacionService
                .create(this.model())
                .subscribe((response: any) => {
                  if (response.success) {
                    this.model.mutate(
                      (value) => (value._id = response.data._id)
                    );
                    this.getArchivosTitular();
                  }
                });
            }
          }
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }


  getCatalogs() {
    this.configuracionDocumentalService
      .getConfiguracionDocumentalByProyecto(
        this.folio.proyecto,
        this.folio.aseguradoraId,
        this.folio.titular
      )
      .subscribe({
        next: (response: IResponse<IConfiguracionDocumental>) => {
          if (response.success) {
            this.catalogos.documento = [
              ...new Set(
                response.data.documento.filter(
                  (element: IConfiguracionDocumentalDocumentos) =>
                    element.categoria === 3 &&
                    element.clave !== EDocumento.CONFIRMACION_ENTREGA
                )
              ),
            ];
          } else console.error(response.message);
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });

    this.ConfiguracionDocumentalService.getCatalogs().subscribe({
      next: (response: IResponse<IConfiguracionDocumentalCatalogs>) => {
        if (response.success) {
          this.motivos = [
            ...new Set(
              response.data.motivo.filter(
                (element) => element.clave === 5 || element.clave === 6
              )
            ),
          ];
        } else console.error(response.message);
      },
      error: (err) => {
        this.return();
        this.notifierService.error(err?.error?.message, 'Error');
      },
    });
  }

  changeCorrecto(index: number, event: any) {
    if (event.checked) {
      this.listValidacion[index].correcto = true;
      this.listValidacion[index].motivo = 0;
    } else {
      this.listValidacion[index].correcto = false;
    }
  }

  onChangeMotivo(index: number, value: number) {
    this.listValidacion[index].motivo = value;
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
        this.frmComentario.patchValue(response.data[0].actividades);
      this.IDCOMENTARIO = response.data[0]._id;
    }
    if (this.readonlyModule) this.frmComentario.disable();
    this.loading = false;
  }

  onDragover(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDragout(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDrop(event: DragEvent) { }

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
  }

  // onChangeFechaVigencia(index: number, value: Date) {
  //   this.dataArchivos[index].fechaVigencia = value;
  // }

  getFilenameFromContentDisposition(res: any) {
    let filename = null;

    const disposition = res.headers.get('content-disposition');

    if (disposition?.includes('attachment')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches?.[1]) {
        filename = matches[1].replace(/['"]/g, '');
        filename = decodeURIComponent(filename);
        filename = filename.replace(/^UTF-8/i, '').trim();
      }
    }

    return filename;
  }

  async showFile(element: any) {
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

  return(): void {
    this.frmComentario.patchValue({});
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }

  async saveData() {

    this.model.mutate((value) => (value.archivos = this.listValidacion));

    if (this.model()._id === '') {
      this.validacionService
        .create(this.model())
        .subscribe((response) => { });
    } else {
      this.validacionService
      this.validacionService
        .update(this.model()._id || '', this.model())
        .subscribe((response) => { });
    }

    await this.getComentarios(false);

    if (this.frmComentario.valid) {
      if (this.IDCOMENTARIO == undefined) {
        this.comentarioService
          .create(this.frmComentario.value)
          .subscribe((response) => {
            const { _id } = response.data;
            this.IDCOMENTARIO = _id;
          });
      } else {
        this.comentarioService
          .update(`${this.IDCOMENTARIO}`, this.frmComentario.value)
          .subscribe((response) => { });
      }

      const documentosIncorrectos = this.listValidacion.filter(
        (element) =>
          element.correcto == false ||
          element.correcto == undefined ||
          element.motivo != 0
      );

      if (documentosIncorrectos.length > 0) {
        const faltanMotivos = documentosIncorrectos.filter(
          (element) => element.motivo === 0 || !element.motivo
        );
        if (faltanMotivos.length > 0) {
          this.swalService.info({
            text: 'Motivos de rechazo son requerido para avanzar la actividad',
          });
          return;
        }

        const motivo = documentosIncorrectos[0].motivo;
        const actividadFinal =
          motivo === 5
            ? EFnzActividad.VALIDACION_DIGITAL
            : EFnzActividad.FIRMA_DOCUMENTAL;
        const strActividad =
          motivo === 5 ? 'Validación Documental' : 'Firma Documental';
        const notificacion =
          motivo === 5 ? 0 : EFnzNotificacion.SOLICITUD_FIRMA_ASEGURADO;

        const workflow: IFnzWorklFlow = {
          folio: this.folio.folio,
          actividadInicial: this.folio.actividadCodigo,
          actividadFinal: actividadFinal,
          actividad: FnzEstatusBitacoraConsts.EN_PROCESO_DE_GESTION,
          notificacion: notificacion,
          reproceso: true,
          comentarios: this.frmComentario.get('comentarios')?.value,
        };

        this.workflowService.avanzar(workflow).subscribe((response) => {
          this.swalService
            .success({
              html: `Información almacenada correctamente, se reprocesa la actividad a <b>${strActividad}</b>`,
            })
            .then(() => {
              this.router.navigate(['/bandejas']);
            });
        });
      } else {
        const workflow: IFnzWorklFlow = {
          folio: this.folio.folio,
          actividadInicial: this.folio.actividadCodigo,
          actividadFinal: EFnzActividad.RECOLECCION_DE_FISICOS,
          actividad: FnzEstatusBitacoraConsts.RECOLECCION_DE_FISICOS,
          notificacion: EFnzNotificacion.RECOLECCION_FISICOS,
          comentarios: this.frmComentario.get('comentarios')?.value,
        };

        this.workflowService.avanzar(workflow).subscribe((response) => {
          this.swalService
            .success({
              html: 'Información almacenada correctamente, se avanzó la actividad a <b>Recolección de fisícos</b>',
            })
            .then(() => {
              this.router.navigate(['/bandejas']);
            });
        });
      }
    }
  }

  click_reenviarDocumentos() {
    const workflow: IFnzWorklFlow = {
      folio: this.folio.folio,
      actividadInicial: 0,
      actividadFinal: 0,
      actividad: '',
      notificacion: EFnzNotificacion.FORMATOS_FIRMADOS,
    };

    this.workflowService.reenviarFormatosFirmadosSolicitud(workflow).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          this.notifierService.success(
            response.message,
            'Reenvío de Formatos Firmados'
          );
        }
      },
      error: (err) => {
        this.notifierService.warning(err?.error?.message);
      },
    });
  }

  updateValidacionEvent() { }

  updateEventUploadFile() {
    this.getArchivosTitular();
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
