import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ShareComponentsModule } from 'src/app/shared/views/components/share-components.module';
import { FnzRoutingModule } from './fianzas-routing.module';
import { FnzBandejasModule } from './pages/core/fnz-bandejas/fnz-bandejas.module';
import { FnzBusquedaComponent } from './pages/core/fnz-busqueda/fnz-busqueda.component';
import { FnzCargaDocumentalComponent } from './pages/core/fnz-carga-documental/fnz-carga-documental.component';
import { FnzConfirmacionEntregaComponent } from './pages/core/fnz-confirmacion-entrega/fnz-confirmacion-entrega.component';
import { FnzContactoAseguradoraComponent } from './pages/core/fnz-contacto-aseguradora/fnz-contacto-aseguradora.component';
import { FnzContactoTelefonicoComponent } from './pages/core/fnz-contacto-telefonico/fnz-contacto-telefonico.component';
import { FnzHistorialContactoTelefonicoComponent } from './pages/core/fnz-contacto-telefonico/fnz-historial-contacto-telefonico/fnz-historial-contacto-telefonico.component';
import { FnzFirmaDocumentalComponent } from './pages/core/fnz-firma-documental/fnz-firma-documental.component';
import { FnzFolioEstatusDetailsComponent } from './pages/core/fnz-folio/fnz-folio-estatus-details/fnz-folio-estatus-details.component';
import { FnzFolioEstatusComponent } from './pages/core/fnz-folio/fnz-folio-estatus/fnz-folio-estatus.component';
import { FnzFolioComponent } from './pages/core/fnz-folio/fnz-folio.component';
import { FnzGeneracionFormatosComponent } from './pages/core/fnz-generacion-formatos/fnz-generacion-formatos.component';
import { FnzRecoleccionFisicosComponent } from './pages/core/fnz-recoleccion-fisicos/fnz-recoleccion-fisicos.component';
import { FnzSolicitudComponent } from './pages/core/fnz-solicitud/fnz-solicitud.component';
import { FnzValidacionAfianzadoraComponent } from './pages/core/fnz-validacion-afianzadora/fnz-validacion-afianzadora.component';
import { FnzValidacionDigitalComponent } from './pages/core/fnz-validacion-digital/fnz-validacion-digital.component';
import { FnzValidacionFirmaComponent } from './pages/core/fnz-validacion-firma/fnz-validacion-firma.component';
import { FnzValidacionOriginalesComponent } from './pages/core/fnz-validacion-originales/fnz-validacion-originales.component';
import { FnzDashboardStatusComponent } from './pages/fnz-dashboard/fnz-dashboard-status/fnz-dashboard-status.component';
import { FnzDashboardComponent } from './pages/fnz-dashboard/fnz-dashboard.component';
import { FnzEncabezadoDetalleComponent } from './pages/shared/fnz-encabezado/fnz-encabezado-detalle/fnz-encabezado-detalle.component';
import { FnzEncabezadoComponent } from './pages/shared/fnz-encabezado/fnz-encabezado.component';
import { FnzFlujoConsultaComponent } from './pages/shared/fnz-flujo-consulta/fnz-flujo-consulta.component';
import { FnzInfoTelefonoCorrespondenciaComponent } from './pages/shared/fnz-info-telefono-correspondencia/fnz-info-telefono-correspondencia.component';
import { FnzModalTelefonoCorrespondenciaComponent } from './pages/shared/fnz-modal-telefono-correspondencia/fnz-modal-telefono-correspondencia.component';
import { FnzSharedChecklistComponent } from './pages/shared/fnz-shared-checklist/fnz-shared-checklist.component';
import { FnzSharedUploadComponent } from './pages/shared/fnz-shared-upload/fnz-shared-upload.component';
import { FnzEncabezadoExpedienteComponent } from './pages/shared/fnz-encabezado/fnz-encabezado-detalle/fnz-encabezado-expediente/fnz-encabezado-expediente.component';
import { FnzEncabezadoBitacoraComponent } from './pages/shared/fnz-encabezado/fnz-encabezado-detalle/fnz-encabezado-bitacora/fnz-encabezado-bitacora.component';
import { FnzEncabezadoHistorialComponent } from './pages/shared/fnz-encabezado/fnz-encabezado-detalle/fnz-encabezado-historial/fnz-encabezado-historial.component';
import { FnzCargaDocumentalMasivaComponent } from './pages/core/fnz-carga-documental-masiva/fnz-carga-documental-masiva.component';
import { FnzEncabezadoCotejoComponent } from './pages/shared/fnz-encabezado/fnz-encabezado-detalle/fnz-encabezado-cotejo/fnz-encabezado-cotejo.component';
import { FnzEstatusDocumentosComponent } from './pages/shared/fnz-status-documentos/fnz-status-documentos.component';

@NgModule({
  declarations: [
    FnzDashboardComponent,
    FnzDashboardStatusComponent,
    FnzFolioComponent,
    FnzEncabezadoComponent,
    FnzEncabezadoDetalleComponent,
    FnzFolioEstatusDetailsComponent,
    FnzFolioEstatusComponent,
    FnzValidacionDigitalComponent,
    FnzSharedChecklistComponent,
    FnzSharedUploadComponent,
    FnzFlujoConsultaComponent,
    FnzSolicitudComponent,
    FnzFirmaDocumentalComponent,
    FnzValidacionAfianzadoraComponent,
    FnzGeneracionFormatosComponent,
    FnzContactoTelefonicoComponent,
    FnzContactoAseguradoraComponent,
    FnzInfoTelefonoCorrespondenciaComponent,
    FnzModalTelefonoCorrespondenciaComponent,
    FnzHistorialContactoTelefonicoComponent,
    FnzBusquedaComponent,
    FnzRecoleccionFisicosComponent,
    FnzValidacionOriginalesComponent,
    FnzCargaDocumentalComponent,
    FnzValidacionFirmaComponent,
    FnzConfirmacionEntregaComponent,
    FnzEncabezadoExpedienteComponent,
    FnzEncabezadoBitacoraComponent,
    FnzEncabezadoHistorialComponent,
    FnzCargaDocumentalMasivaComponent,
    FnzEncabezadoCotejoComponent,
    FnzEstatusDocumentosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FnzRoutingModule,
    AngularMaterialModule,
    ShareComponentsModule,
    SharedModule,
    FnzBandejasModule,
  ],
})
export class FianzasModule {}
