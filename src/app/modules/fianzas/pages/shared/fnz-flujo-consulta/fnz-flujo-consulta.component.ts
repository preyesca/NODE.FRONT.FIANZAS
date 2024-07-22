import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EFnzActividad } from '../../../helpers/enums/fnz-actividad.enum';
import { EFnzEstatusActividad } from '../../../helpers/enums/fnz-estatus-actividad.enum';
import { IFnzEncabezado } from '../helpers/interfaces/fnz-encabezado';
import {
  IFnzFlujoConsulta,
  IFnzFlujoConsultaViewer,
  IFnzInfoByActividadToClick,
  IFnzInfoByActividadToView,
} from '../helpers/interfaces/fnz-flujo-consulta';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IFnzWorkflowDetalle } from '../../core/helpers/interfaces/fnz-workflow';

@Component({
  selector: 'app-fnz-flujo-consulta',
  templateUrl: './fnz-flujo-consulta.component.html',
  styleUrls: ['./fnz-flujo-consulta.component.scss'],
})
export class FnzFlujoConsultaComponent implements OnInit {
  @Input()
  public flujoConsulta!: IFnzFlujoConsulta;

  header: IFnzEncabezado = <IFnzEncabezado>{};
  mostrarDetalle: boolean = false;

  flujos: Array<IFnzFlujoConsultaViewer> = [];
  flujoContactoTelefonico: IFnzFlujoConsultaViewer = <
    IFnzFlujoConsultaViewer
  >{};
  flujoContactoAseguradora: IFnzFlujoConsultaViewer = <
    IFnzFlujoConsultaViewer
  >{};

  constructor(
    private router: Router,
    private notifierService: NotifierService,
    private workFlowActividadService: FnzWorkFlowActividadService,
    private userStorageService: UserStorageService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createFlujoActividad();
  }

  async createFlujoActividad(){
    if (this.flujoConsulta.ultimaActividadActual === 0) {
      this.flujoConsulta.ultimaActividadActual =
        EFnzActividad.CONFIRMACION_ENTREGA;
      this.flujoConsulta.ultimaActividadEstatus =
        EFnzEstatusActividad.FINALIZADA;
    }

    const actividades = this.getInfoActividades();
    const actividadesFlujo: Array<IFnzFlujoConsultaViewer> = [];

    const iconosAmarillos: Array<EFnzEstatusActividad> = [
      EFnzEstatusActividad.NUEVA,
      EFnzEstatusActividad.EN_PROGRESO,
      EFnzEstatusActividad.SUSPENDIDA,
      EFnzEstatusActividad.EN_REPROCESO,
      EFnzEstatusActividad.PROGRAMADA,
    ];

    const iconosVerdes: Array<EFnzEstatusActividad> = [
      EFnzEstatusActividad.COMPLETADA,
      EFnzEstatusActividad.FINALIZADA,
      EFnzEstatusActividad.CANCELADA,
    ];

    const orderUltimaActividadActual = actividades.find(
      (a) => a.actividad === this.flujoConsulta.ultimaActividadActual
    )!.order;

    for (let a = 0; a < actividades.length; a++) {
      const act = actividades[a];
      const observable = this.validateExistenceActivity(act.actividad);
      const actividadExiste = await firstValueFrom(observable);
      
      let estatus = act.order < orderUltimaActividadActual
      ? 'completed'
      : act.order === orderUltimaActividadActual
      ? iconosVerdes.includes(this.flujoConsulta.ultimaActividadEstatus)
        ? 'completed'
        : iconosAmarillos.includes(
            this.flujoConsulta.ultimaActividadEstatus
          )
        ? 'inprogress'
        : 'notstarted'
      : 'notstarted';

      if (!actividadExiste && act.actividad == EFnzActividad.CARGA_DOCUMENTAL ) {        
        estatus = 'notstarted';
      }
    
      const wkfFind = {
        ...act,
        estatus,
      };
    
      actividadesFlujo.push(wkfFind);
    }

    //Actividades opcionales
    const contactoTelefonico = {
      actividad: EFnzActividad.CONTACTO_TELEFONICO,
      filename: 'contacto_telefonico',
      nombre: 'Contacto telefónico',
      estatus: this.flujoConsulta.actividadContactoTelefonicoEstatus
        ? iconosVerdes.includes(
            this.flujoConsulta.actividadContactoTelefonicoEstatus
          )
          ? 'completed'
          : 'inprogress'
        : 'notstarted',
    };

    const contactoAseguradora = {
      actividad: EFnzActividad.CONTACTO_ASEGURADORA,
      filename: 'contacto_aseguradora',
      nombre: 'Contacto aseguradora',
      estatus: this.flujoConsulta.actividadContactoAseguradoraEstatus
        ? iconosVerdes.includes(
            this.flujoConsulta.actividadContactoAseguradoraEstatus
          )
          ? 'completed'
          : 'inprogress'
        : 'notstarted',
    };

    this.flujos = actividadesFlujo;
    this.flujoContactoTelefonico = contactoTelefonico;
    this.flujoContactoAseguradora = contactoAseguradora;
  }

  onClickActividad(flujo: IFnzFlujoConsultaViewer): void {
    const actividades = this.getInfoActividadesToClick();
    const goActividad = actividades.find(
      (p) => p.actividad === flujo.actividad
    );

    if (goActividad && ['completed', 'inprogress'].includes(flujo.estatus))
      this.router.navigate(
        [`/${goActividad.path}/${this.flujoConsulta.folio}`],
        {
          state: { readonlyModule: true },
        }
      );

    if(flujo.actividad == EFnzActividad.CARGA_DOCUMENTAL && flujo.estatus == "notstarted"){
      this.notifierService.info("Documentación cargada vía Carga documental masiva");
    }
  }

  getInfoActividades(): Array<IFnzInfoByActividadToView> {
    return [
      {
        actividad: EFnzActividad.SOLICITUD,
        filename: 'solicitud',
        nombre: 'Solicitud',
        order: 1,
      },
      {
        actividad: EFnzActividad.CARGA_DOCUMENTAL,
        filename: 'carga_documental',
        nombre: 'Carga documental',
        order: 2,
      },
      {
        actividad: EFnzActividad.VALIDACION_DIGITAL,
        filename: 'validacion_digital',
        nombre: 'Validación digital',
        order: 3,
      },
      {
        actividad: EFnzActividad.FIRMA_DOCUMENTAL,
        filename: 'firma_cliente',
        nombre: 'Firma documental',
        order: 5,
      },
      {
        actividad: EFnzActividad.VALIDACION_FIRMAS,
        filename: 'validacion_firmas',
        nombre: 'Validación de firmas',
        order: 6,
      },
      {
        actividad: EFnzActividad.VALIDACION_AFIANZADORA,
        filename: 'validacion_afianzadora',
        nombre: 'Validación afianzadora',
        order: 7,
      },
      {
        actividad: EFnzActividad.RECOLECCION_DE_FISICOS,
        filename: 'recoleccion_fisicos',
        nombre: 'Recolección de físicos',
        order: 8,
      },
      {
        actividad: EFnzActividad.VALIDACION_DE_ORIGINALES,
        filename: 'validacion_originales',
        nombre: 'Validación de originales',
        order: 9,
      },
      {
        actividad: EFnzActividad.CONFIRMACION_ENTREGA,
        filename: 'confirmacion_entrega',
        nombre: 'Confirmación de entrega',
        order: 10,
      },
    ];
  }

  getInfoActividadesToClick(): Array<IFnzInfoByActividadToClick> {
    return [
      { actividad: EFnzActividad.SOLICITUD, path: 'solicitud' },
      { actividad: EFnzActividad.CARGA_DOCUMENTAL, path: 'carga-documental' },
      {
        actividad: EFnzActividad.VALIDACION_DIGITAL,
        path: 'validacion-digital',
      },
      { actividad: EFnzActividad.FIRMA_DOCUMENTAL, path: 'firma-documental' },
      { actividad: EFnzActividad.VALIDACION_FIRMAS, path: 'validacion-firma' },
      {
        actividad: EFnzActividad.VALIDACION_AFIANZADORA,
        path: 'validacion-afianzadora',
      },
      {
        actividad: EFnzActividad.RECOLECCION_DE_FISICOS,
        path: 'recoleccion-fisicos',
      },
      {
        actividad: EFnzActividad.VALIDACION_DE_ORIGINALES,
        path: 'validacion-originales',
      },
      {
        actividad: EFnzActividad.CONFIRMACION_ENTREGA,
        path: 'confirmacion-entrega',
      },
      {
        actividad: EFnzActividad.CONTACTO_TELEFONICO,
        path: 'contacto-telefonico',
      },
      {
        actividad: EFnzActividad.CONTACTO_ASEGURADORA,
        path: 'contacto-aseguradora',
      },
    ];
  }

  validateExistenceActivity(actividadCodigo: number): Observable<boolean> {
    const idFolio = this.route.snapshot.paramMap.get('id') || undefined;
    if (!idFolio) return of(false);
  
    return this.workFlowActividadService
      .getActividadByFolioAndActividad(idFolio, actividadCodigo)
      .pipe(
        map((response: IResponse<IFnzWorkflowDetalle>) => {
          if (response.success && !Array.isArray(response.data)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
