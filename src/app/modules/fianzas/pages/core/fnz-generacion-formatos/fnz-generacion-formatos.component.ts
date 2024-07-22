import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {
  IConfiguracionDocumental,
  IConfiguracionDocumentalDocumentos,
} from 'src/app/modules/administracion/helpers/interfaces/adm-configuracion-documental';
import {
  IArchivo,
  ICargaDocumentalMasivaCatalogs,
} from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
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
import { FnzGeneracionFormatoService } from '../../../services/fnz-generacion-formato.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import { IFnzGeneracionFormato } from '../helpers/interfaces/fnz-generacion-formatos';
import {
  IFnzWorkflowDetalle,
  IFnzWorklFlow,
} from '../helpers/interfaces/fnz-workflow';

@Component({
  selector: 'app-fnz-generacion-formatos',
  templateUrl: './fnz-generacion-formatos.component.html',
  styleUrls: ['./fnz-generacion-formatos.component.scss'],
})
export class FnzGeneracionFormatosComponent {
  breadcrumbs: string[] = ['Fianzas', 'Generacion de Formatos'];

  dataArchivos: IArchivo[] = [];
  catalogos: ICargaDocumentalMasivaCatalogs = {};
  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  folio!: IFnzBandejaPaginate;
  currentValidacionId: string = '';
  readonlyModule: boolean = false;
  estatus: Array<ICatalogo> = [];
  currentActividad!: EFnzActividad;
  currenActividadEstatus!: EFnzEstatusActividad;
  loading: boolean = true;
  userSession!: IUserStorageUserDto;
  documentosTitular: Array<any> = [];
  documentosFIC: Array<any> = [];
  displayedColumnsFIC: string[] = ['documento', 'url'];
  model = signal<IFnzGeneracionFormato>({});

  constructor(
    private notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private formBuilder: FormBuilder,
    private workflowService: FnzWorkFlowService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private comentarioService: FnzComentarioService,
    private expedienteService: FnzExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private generacionFormatosService: FnzGeneracionFormatoService,
    private swalService: SwalService,
    private router: Router,
    private utilsService: UtilsService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.frmComentario = this.formBuilder.group({
      folio: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      titular: ['', [Validators.required]],
      estatus: ['', [Validators.required]],
      comentarios: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.init();
  }

  init(): void {
    this.userSession = this.userStorageService.getCurrentUserInfo();
    const idFolio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;
    const actividadCodigo = EFnzActividad.GENERACION_FORMATOS;
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
            this.getComentarios();
            this.getCatalogs();
            this.getEstatusCatalogo();
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

  async getComentarios() {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );
    if (response.success) {
      this.frmComentario.patchValue(response.data[0].actividades);
      this.IDCOMENTARIO = response.data[0]._id;
    }
    if (this.readonlyModule) this.frmComentario.disable();
    this.loading = false;
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
                    element.categoria == 3 &&
                    (element.nombre == 'FIC' || element.nombre == 'Anexo FIC')
                )
              ),
            ];
          } else console.error(response.message);
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
  }

  getEstatusCatalogo() {
    this.generacionFormatosService.getCatalogoEstatus().subscribe({
      next: (response: IResponse<ICatalogo[]>) => {
        if (response.success) {
          this.estatus = response.data;
        }
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
      this.documentosTitular = responseArchivos.data;
    }

    this.generacionFormatosService
      .getByIdAndGetCatalogosToEdit(this.folio.folio)
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            if (response.data !== null) {
              this.model.mutate((value) => (value._id = response.data._id));
              this.model.mutate(
                (value) => (value.archivoAnexo = response.data.archivoAnexo)
              );
              this.model.mutate(
                (value) => (value.archivoFic = response.data.archivoFic)
              );
              this.frmComentario
                .get('estatus')
                ?.setValue(response.data.estatusGeneracionFormato);

              this.documentosFIC = [];
              if (this.model()!.archivoFic) {
                let documento = this.documentosTitular.find(
                  (element: any) => element.clave == EDocumento.FIC
                );
                documento.id = this.model()!.archivoFic;
                this.documentosFIC.push(documento);
              }
              if (this.model()!.archivoAnexo) {
                let documento = this.documentosTitular.find(
                  (element: any) => element.clave == EDocumento.ANEXO
                );
                documento.id = this.model()!.archivoAnexo;
                this.documentosFIC.push(documento);
              }
            } else {
              this.generacionFormatosService
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
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
  }

  download(element: any) {
    let a = document.createElement('a');
    this.expedienteService.getByArchivo(element.id).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          let blobFile = this.utilsService.b64toBlob(
            response.data.fileBase64,
            response.data.type,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          a.href = urlBlobFile;
          a.target = '_blank';
          a.download = element.documento;
          a.click();
          URL.revokeObjectURL(urlBlobFile);
        }
      },
    });
  }
  async saveData() {
    if (this.frmComentario.valid) {
      if (!this.IDCOMENTARIO) {
        this.comentarioService
          .create(this.frmComentario.value)
          .subscribe((response) => {
            const { _id } = response.data;
            this.IDCOMENTARIO = _id;
          });
      }

      const estatus = this.frmComentario.get('estatus')?.value;
      this.model.mutate((value) => (value.estatusGeneracionFormato = estatus));
      if (estatus == 1) {
        if (
          this.documentosFIC.filter((x) => x.clave === EDocumento.FIC).length ==
          0
        ) {
          this.notifierService.warning('El formato Fic es obligatorio');
          return;
        }
      }

      this.generacionFormatosService
        .update(this.model()._id || '', this.model())
        .subscribe((response) => {});

      const workflow: IFnzWorklFlow = {
        folio: this.folio.folio,
        actividadInicial: this.folio.actividadCodigo,
        actividadFinal:
          estatus == 2
            ? EFnzActividad.VALIDACION_DIGITAL
            : EFnzActividad.FIRMA_DOCUMENTAL,
        actividad:
          estatus == 2
            ? FnzEstatusBitacoraConsts.EN_PROCESO_DE_GESTION
            : FnzEstatusBitacoraConsts.FORMATOS_GENERADOS,
        notificacion: estatus == 1 ? EFnzNotificacion.FIRMA_DOCUMENTOS : 0,
        reproceso: estatus == 1 ? false : true,
        comentarios: this.frmComentario.get('comentarios')?.value,
      };

      const mensaje = estatus == 2 ? 'se reprocesa' : 'se avanzó';
      const mensajeActividad =
        estatus == 2 ? 'Validación Documental' : 'Firma Documental';

      this.workflowService.avanzar(workflow).subscribe((response) => {
        this.swalService
          .success({
            html: `Información almacenada correctamente, ${mensaje} la actividad a <b>${mensajeActividad}</b>`,
          })
          .then(() => {
            this.router.navigate(['/bandejas']);
          });
      });
    }
  }

  updateEventUploadFile(file: any) {
    // this.getArchivosTitular(true);
  }

  updateEventResponseFile(file: any) {
    if (file.clave == EDocumento.FIC) {
      this.model.mutate((value) => (value.archivoFic = file._id));
    }
    if (file.clave == EDocumento.ANEXO) {
      this.model.mutate((value) => (value.archivoAnexo = file._id));
    }

    this.generacionFormatosService
      .update(this.model()._id || '', this.model())
      .subscribe((response) => {
        this.getArchivosTitular();
      });
  }

  onDragover(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDragout(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
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
    this.frmComentario.patchValue({});
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
