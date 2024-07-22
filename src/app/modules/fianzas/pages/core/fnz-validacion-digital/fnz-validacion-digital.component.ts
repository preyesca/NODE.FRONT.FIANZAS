import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IConfiguracionDocumental } from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import { IWorlFlow } from 'src/app/modules/administracion/helpers/interfaces/core-workflow';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { EFnzActividad } from 'src/app/modules/fianzas/helpers/enums/fnz-actividad.enum';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { FnzEstatusBitacoraConsts } from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import { FnzComentarioService } from '../../../services/fnz-comentario.service';
import { FnzExpedienteDigitalService } from '../../../services/fnz-expediente-digital.service';
import { FnzValidacionService } from '../../../services/fnz-validacion-documental.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import {
  IFnzArchivo,
  IFnzCargaDocumentalMasivaCatalogs,
} from '../helpers/interfaces/fnz-carga-documental';
import { IFnzComentario } from '../helpers/interfaces/fnz-comentario';
import {
  IFnzArchivoValidacion,
  IFnzValidacionArchivos,
  IFnzValidacionDigital,
} from '../helpers/interfaces/fnz-validacion-documental';
import { IFnzWorkflowDetalle } from '../helpers/interfaces/fnz-workflow';
import { ISaveComentario } from 'src/app/modules/administracion/helpers/interfaces/core-comentario';

@Component({
  selector: 'app-fnz-validacion-digital',
  templateUrl: './fnz-validacion-digital.component.html',
  styleUrls: ['./fnz-validacion-digital.component.scss'],
})
export class FnzValidacionDigitalComponent {
  breadcrumbs: string[] = ['Fianzas', 'Validacion digital'];
  action!: EFormAction;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator =
    {} as MatPaginator;

  userSession!: IUserStorageUserDto;
  displayedColumns: string[] = [
    'documento',
    'url',
    'correcto',
    'idMotivo',
    'fechaVigencia',
  ];
  @ViewChild('formArchivo', { read: NgForm }) formComentario: any;
  dataArchivos: IFnzArchivo[] = [];
  catalogos: IFnzCargaDocumentalMasivaCatalogs = {};
  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IFnzBandejaPaginate;
  documentosValidacion: IFnzArchivoValidacion[] = [];
  validacion: IFnzValidacionDigital = {};
  comentario!: IFnzComentario;
  currentValidacionId: string = '';
  readonlyModule: boolean = false;
  documentosBodega: boolean = false;
  listArchivosValidacion: Array<IFnzValidacionArchivos> = [];


  constructor(
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private formBuilder: FormBuilder,
    private workflowService: FnzWorkFlowService,
    private comentarioService: FnzComentarioService,
    private expedienteService: FnzExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private validacionService: FnzValidacionService,
    private swalService: SwalService,
    private router: Router,
    private utilsService: UtilsService,
    private readonly route: ActivatedRoute
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
    const actividadCodigo = EFnzActividad.VALIDACION_DIGITAL;

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

            this.frmComentario.patchValue({
              folio: this.folio.folio,
              actividad: this.folio.actividadCodigo,
              titular: this.folio.titular,
              comentarios: '',
            });
            this.setComentario();
            this.getComentarios(true);
            this.getArchivosTitular();
            this.getCatalogs();
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
      this.documentosValidacion = [
        ...new Set(
          responseArchivos.data.filter(
            (element) => element.categoria != 3 && element.categoria != 4
          )
        ),
      ];

      if (this.listArchivosValidacion.length <= 0) {
        this.documentosValidacion.forEach((x) => {
          this.listArchivosValidacion.push({ documento: x.documento_id });
        });
      }

      this.configuracionDocumentalService
        .getConfiguracionDocumentalByProyecto(
          this.folio.proyecto,
          this.folio.aseguradoraId,
          this.folio.titular
        )
        .subscribe({
          next: (response: IResponse<IConfiguracionDocumental>) => {
            if (response.success) {
              this.documentosValidacion = this.documentosValidacion.map(
                (x: any) => {
                  response.data.documento.filter((d: any) => {
                    if (x.documento_id == d.documento) {
                      x.vigencia = d.vigencia;
                    }
                  });
                  return x;
                }
              );
            } else console.error(response.message);
          },
          error: (err) =>
            this.notifierService.error(err?.error?.message, 'Error'),
        });
    }

    this.validacionService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success && response.data !== null) {
            this.currentValidacionId = response.data._id;
            this.validacion = response.data;
            this.documentosValidacion.map(
              (x: any) => {
                response.data.archivos.filter((a: any) => {
                  if (x.documento_id == a.documento) {
                    (x.correcto = a.correcto),
                      (x.fechaVigencia = a.fechaVigencia);
                    (x.idMotivo = a.motivo)
                  }
                });
              }
            );

            this.documentosValidacion.forEach((x: any) => {
              const foundIndex = this.listArchivosValidacion.findIndex(
                (i) => i.documento === x.documento_id
              );
              if (foundIndex >= 0) {
                this.listArchivosValidacion[foundIndex].vigencia =
                  x.vigencia;
                this.listArchivosValidacion[foundIndex].correcto =
                  x.correcto;
                this.listArchivosValidacion[foundIndex].fechaVigencia =
                  x.fechaVigencia;
                this.listArchivosValidacion[foundIndex].motivo =
                  x.idMotivo;
              }
            });
          }
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
  }

  async getCatalogs() {
    this.configuracionDocumentalService
      .getConfiguracionDocumentalByProyecto(
        this.folio.proyecto,
        this.folio.aseguradoraId,
        this.folio.titular
      )
      .subscribe({
        next: (response: IResponse<IConfiguracionDocumental>) => {
          if (response.success) {
            this.documentosValidacion = this.documentosValidacion.map(
              (x: any) => {
                response.data.documento.filter((d: any) => {
                  if (x.documento_id == d.documento) {
                    x.vigencia = d.vigencia;
                  }
                });
                return x;
              }
            );
          } else console.error(response.message);
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
  }

  changeCorrecto(index: number, event: any) {

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
    if (this.readonlyModule) this.frmComentario.disable();
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

  onChangeFechaVigencia(index: number, value: Date) {
    this.dataArchivos[index].fechaVigencia = value;
  }

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

  return(): void {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }

  async saveData(docsForm: NgForm) {
    if (!docsForm.valid) {
      this.swalService.info({
        html: 'Debe completar los campos requeridos.',
      });
      return;
    }


    this.listArchivosValidacion.map((x: any) => {
      const filter = this.documentosValidacion.filter(
        (j) => x.documento === j.documento_id
      );
      x.fechaVigencia = filter[0].fechaVigencia;
      x.expediente = filter[0].id;
    });

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

    const documentosCorrectos = [
      ...new Set(
        this.documentosValidacion.filter(
          (element) => element.categoria != 3 && element.correcto
        )
      ),
    ];


    if (documentosCorrectos.length === this.documentosValidacion.length) {
      const documentosSeleccionados = await this.validarDocumentosBodega();

      if (documentosSeleccionados.length == 0) {
        this.swalService.warning({
          html: 'Debe seleccionar al menos 1 documento de <b>Expediente digital</b> para avanzar a firma de documentos',
        });
        return;
      }

      const workflow: IWorlFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: EFnzActividad.FIRMA_DOCUMENTAL,
        actividad: FnzEstatusBitacoraConsts.FORMATOS_GENERADOS,
        notificacion: EFnzNotificacion.GENERACION_DE_FORMATOS,
        documentos: documentosSeleccionados,
        comentarios: this.frmComentario.get('comentarios')?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: 'Información almacenada correctamente, se avanzó la actividad a <b>Firma documental</b>',
          })
          .then(() => {
            documentosSeleccionados.forEach(async (element) => {
              await lastValueFrom(
                this.expedienteService.updateEnviado(element, true)
              );
            });
            this.router.navigate(['/bandejas']);
          });
      });
    } else {
      const workflow: IWorlFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal: EFnzActividad.CARGA_DOCUMENTAL,
        actividad: FnzEstatusBitacoraConsts.FALTA_DE_INFORMACION,
        reproceso: true,
        notificacion: EFnzNotificacion.REVISION_DOCUMENTAL,
        comentarios: this.frmComentario.get('comentarios')?.value,
      };

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: 'Información almacenada correctamente, se reprocesa la actividad a <b>Carga Documental</b>',
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    }
  }

  async validarDocumentosBodega() {
    try {
      const response = await lastValueFrom(
        this.expedienteService.getSeleccionados(
          this.folio.titular
        )
      );

      return response.data;
    } catch (error) {
      return [];
    }
  }

  onChangeMotivo(index: number, value: number, event: any) {
    if (event.isUserInput) {
      this.listArchivosValidacion[index].motivo = value;
    }
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
