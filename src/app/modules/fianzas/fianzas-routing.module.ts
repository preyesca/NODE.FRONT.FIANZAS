import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/app/shared/guards/authorize.guard';
import { FnzConsts } from './helpers/consts/fnz.consts';
import { FnzBusquedaComponent } from './pages/core/fnz-busqueda/fnz-busqueda.component';
import { FnzCargaDocumentalMasivaComponent } from './pages/core/fnz-carga-documental-masiva/fnz-carga-documental-masiva.component';
import { FnzCargaDocumentalComponent } from './pages/core/fnz-carga-documental/fnz-carga-documental.component';
import { FnzConfirmacionEntregaComponent } from './pages/core/fnz-confirmacion-entrega/fnz-confirmacion-entrega.component';
import { FnzContactoAseguradoraComponent } from './pages/core/fnz-contacto-aseguradora/fnz-contacto-aseguradora.component';
import { FnzContactoTelefonicoComponent } from './pages/core/fnz-contacto-telefonico/fnz-contacto-telefonico.component';
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

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: FnzDashboardComponent,
  //   canActivate: [AuthorizeGuard],
  //   data: { permiso: FnzConsts.PERMISSIONS.dashboard },
  // },
  {
    path: 'busquedas',
    component: FnzBusquedaComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.busquedas },
  },
  {
    path: 'folio/nuevo',
    component: FnzFolioComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.nuevo_folio },
  },
  {
    path: 'folio/estatus-carga',
    component: FnzFolioEstatusComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.nuevo_folio },
  },
  {
    path: 'folio/estatus-carga/:header',
    component: FnzFolioEstatusDetailsComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.nuevo_folio },
  },
  {
    path: 'folio/carga-documental-masiva',
    component: FnzCargaDocumentalMasivaComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.carga_documental_masiva },
  },
  {
    path: 'solicitud/:id',
    component: FnzSolicitudComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.solicitud },
  },
  {
    path: 'carga-documental/:id',
    component: FnzCargaDocumentalComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.carga_documental },
  },
  {
    path: 'validacion-digital/:id',
    component: FnzValidacionDigitalComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.validacion_digital },
  },

  {
    path: 'firma-documental/:id',
    component: FnzFirmaDocumentalComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.firma_documental },
  },
  {
    path: 'validacion-firma/:id',
    component: FnzValidacionFirmaComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.validacion_firma },
  },
  {
    path: 'validacion-afianzadora/:id',
    component: FnzValidacionAfianzadoraComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.validacion_afianzadora },
  },
  {
    path: 'firma-documental',
    component: FnzFirmaDocumentalComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.firma_documental },
  },
  {
    path: 'validacion-afianzadora',
    component: FnzValidacionAfianzadoraComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.validacion_afianzadora },
  },
  {
    path: 'recoleccion-fisicos/:id',
    component: FnzRecoleccionFisicosComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.recoleccion_fisicos },
  },
  {
    path: 'validacion-originales/:id',
    component: FnzValidacionOriginalesComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.validacion_originales },
  },
  {
    path: 'confirmacion-entrega/:id',
    component: FnzConfirmacionEntregaComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.confirmacion_entrega },
  },
  {
    path: 'contacto-telefonico/:id',
    component: FnzContactoTelefonicoComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.contacto_telefonico },
  },
  {
    path: 'contacto-aseguradora/:id',
    component: FnzContactoAseguradoraComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: FnzConsts.PERMISSIONS.contacto_aseguradora },
  },
  {
    path: 'bandejas',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/core/fnz-bandejas/fnz-bandejas.module').then(
            (m) => m.FnzBandejasModule
          ),
      },
    ],
  },

  { path: '', redirectTo: 'busquedas', pathMatch: 'full' },
  { path: '**', redirectTo: 'busquedas' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FnzRoutingModule {}
