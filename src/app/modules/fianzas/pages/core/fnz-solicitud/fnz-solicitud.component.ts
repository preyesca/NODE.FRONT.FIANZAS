import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ICargaDocumentalMasivaCatalogs } from 'src/app/modules/administracion/helpers/interfaces/core-carga-documental';
import { AdmConfiguracionDocumentalService } from 'src/app/modules/administracion/services/adm-configuracion-documental.service';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { FnzEstatusBitacoraConsts } from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import { EFnzActividad } from '../../../helpers/enums/fnz-actividad.enum';
import { FnzComentarioService } from '../../../services/fnz-comentario.service';
import { FnzExpedienteDigitalService } from '../../../services/fnz-expediente-digital.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import {
  IFnzWorkflowDetalle,
  IFnzWorklFlow,
} from '../helpers/interfaces/fnz-workflow';

@Component({
  selector: 'app-fnz-solicitud',
  templateUrl: './fnz-solicitud.component.html',
  styleUrls: ['./fnz-solicitud.component.scss'],
})
export class FnzSolicitudComponent implements OnInit {
  breadcrumbs: string[] = ['Fianzas', 'Solicitud'];

  frmComentario = {} as FormGroup;
  IDCOMENTARIO: string | undefined = undefined;
  userSession!: IUserStorageUserDto;
  folio!: IFnzBandejaPaginate;
  catalogos: ICargaDocumentalMasivaCatalogs = {};

  readonlyModule: boolean = false;
  loading: boolean = true;

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private comentarioService: FnzComentarioService,
    private workflowService: FnzWorkFlowService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private userStorageService: UserStorageService,
    private expedienteService: FnzExpedienteDigitalService,
    private configuracionDocumentalService: AdmConfiguracionDocumentalService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private readonly route: ActivatedRoute
  ) {}

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
    this.readonlyModule = history.state.readonlyModule || false;
    const folio = this.route.snapshot.paramMap.get('id') || undefined;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, EFnzActividad.SOLICITUD)
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

            this.getComentarios();
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

  async verificaConfiguracion() {
    const response = await lastValueFrom(
      this.configuracionDocumentalService.getConfiguracionDocumentalByProyecto(
        this.folio.proyecto,
        this.folio.aseguradoraId,
        this.folio.titular
      )
    );
    return response.data ? true : false;
  }

  async getComentarios() {
    const response = await lastValueFrom(
      this.comentarioService.find(
        this.folio.folio,
        this.folio.actividadCodigo.toString()
      )
    );

    if (response.success && response.data[0]) {
      this.frmComentario.patchValue(response.data[0].actividades);
      this.IDCOMENTARIO = response.data[0]._id;
    }

    if (this.readonlyModule) this.frmComentario.disable();
    this.loading = false;
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

      const configuracion = await this.verificaConfiguracion();
      if (!configuracion) {
        this.notifierService.warning(
          'Configuración documental no existe, favor de completar.'
        );
        return;
      }

      const responses = await lastValueFrom(
        this.expedienteService.check_by_titular(
          this.folio.pais,
          this.folio.aseguradoraId,
          this.folio.proyecto,
          this.folio.titular
        )
      );

      const documentos_pendientes = responses.data.filter(
        (element: any) =>
          element.clave !== EDocumento.FIC &&
          element.clave !== EDocumento.ANEXO &&
          element.clave !== EDocumento.ACUSE_ENVIO && element.obligatorio
       );

      if (documentos_pendientes.length > 0) {
        const mensaje = this.generarMensajeHtml(documentos_pendientes);
        this.swalService
          .question({
            html: `Se solicitarán los documentos obligatorios ${mensaje} ¿Está de acuerdo?`,
          })
          .then((result) => {
            if (result.isConfirmed) {
              const workflow: IFnzWorklFlow = {
                folio: this.folio.folio,
                actividadInicial: this.folio.actividadCodigo,
                actividadFinal: EFnzActividad.CARGA_DOCUMENTAL,
                actividad: FnzEstatusBitacoraConsts.PENDIENTE_DE_DOCUMENTACION,
                notificacion: EFnzNotificacion.SOLICITUD,
                comentarios: this.frmComentario.get('comentarios')?.value,
              };
              this.workflowService.avanzar(workflow).subscribe((response) => {
                this.swalService
                  .success({
                    html: 'Información almacenada correctamente, se avanzó la actividad a <b>Carga Documental</b>',
                  })
                  .then(() => {
                    this.router.navigate(['/bandejas']);
                  });
              });
            }
          });
      } else {
        const workflow: IFnzWorklFlow = {
          folio: this.folio.folio,
          actividadInicial: this.folio.actividadCodigo,
          actividadFinal: EFnzActividad.VALIDACION_DIGITAL,
          actividad: FnzEstatusBitacoraConsts.EN_PROCESO_DE_GESTION,
          notificacion: 0,
          comentarios: this.frmComentario.get('comentarios')?.value,
        };

        this.workflowService.avanzar(workflow).subscribe((response) => {
          this.swalService
            .success({
              html: 'Información almacenada correctamente, se avanzó la actividad a <b>Validación Digital</b>',
            })
            .then(() => {
              this.router.navigate(['/bandejas']);
            });
        });
      }
      // todo: contacto telefonico
    }
  }

  generarMensajeHtml(documentos: Array<string>): string {
    let mensaje = '';
    mensaje += "<div style='text-align: left'> </br>";
    mensaje += '<ul>';
    documentos.forEach((element: any) => {
      if (
        element.clave !== EDocumento.FIC &&
        element.clave !== EDocumento.ANEXO &&
        element.obligatorio == true
      ) {
        mensaje += '<li>';
        mensaje += element.nombre;
        mensaje += '</li>';
      }
    });
    mensaje += '</ul>';
    mensaje += '</div> </br>';
    return mensaje;
  }

  return(): void {
    this.frmComentario.patchValue({});
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
