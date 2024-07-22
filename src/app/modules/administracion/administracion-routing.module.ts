import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/app/shared/guards/authorize.guard';
import { AdmAseguradoraActualizarComponent } from './pages/adm-aseguradora/adm-aseguradora-actualizar/adm-aseguradora-actualizar.component';
import { AdmAseguradoraCrearComponent } from './pages/adm-aseguradora/adm-aseguradora-crear/adm-aseguradora-crear.component';
import { AdmAseguradoraVerComponent } from './pages/adm-aseguradora/adm-aseguradora-ver/adm-aseguradora-ver.component';
import { AdmAseguradoraComponent } from './pages/adm-aseguradora/adm-aseguradora.component';
import { AdmConfiguracionAseguradoraFormComponent } from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora-form/adm-configuracion-aseguradora-form.component';
import { AdmConfiguracionAseguradoraComponent } from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora.component';
import { AdmConfiguracionDocumentalFormComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental-form/adm-configuracion-documental-form.component';
import { AdmConfiguracionDocumentalComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental.component';
import { AdmConfiguracionFirmaCotejoFormComponent } from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo-form/adm-configuracion-firma-cotejo-form.component';
import { AdmConfiguracionFirmaCotejoComponent } from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo.component';
import { AdmDocumentoActualizarComponent } from './pages/adm-documento/adm-documento-actualizar/adm-documento-actualizar.component';
import { AdmDocumentoCrearComponent } from './pages/adm-documento/adm-documento-crear/adm-documento-crear.component';
import { AdmDocumentoVerComponent } from './pages/adm-documento/adm-documento-ver/adm-documento-ver.component';
import { AdmDocumentoComponent } from './pages/adm-documento/adm-documento.component';
import { AdmPerfilComponent } from './pages/adm-perfil/adm-perfil.component';
import { AdmProyectoFormComponent } from './pages/adm-proyecto/adm-proyecto-form/adm-proyecto-form.component';
import { AdmProyectoComponent } from './pages/adm-proyecto/adm-proyecto.component';
import { AdmUsuarioFormComponent } from './pages/adm-usuario/adm-usuario-form/adm-usuario-form.component';
import { AdmUsuarioComponent } from './pages/adm-usuario/adm-usuario.component';
import {AdmReporteSeguimientoComponent} from "./pages/adm-reporte-seguimiento/adm-reporte-seguimiento.component";

const routes: Routes = [
  {
    path: 'aseguradoras',
    component: AdmAseguradoraComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-aseguradoras' },
  },
  {
    path: 'aseguradoras/crear',
    component: AdmAseguradoraCrearComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-aseguradoras' },
  },
  {
    path: 'aseguradoras/actualizar/:id',
    component: AdmAseguradoraActualizarComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-aseguradoras' },
  },
  {
    path: 'aseguradoras/ver/:id',
    component: AdmAseguradoraVerComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-aseguradoras' },
  },
  {
    path: 'proyectos',
    component: AdmProyectoComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-proyectos' },
  },
  {
    path: 'proyectos/crear',
    component: AdmProyectoFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-proyectos' },
  },
  {
    path: 'reportes',
    title: 'Reportes',
    component: AdmReporteSeguimientoComponent
  },
  {
    path: 'proyectos/actualizar/:id',
    component: AdmProyectoFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-proyectos' },
  },
  {
    path: 'proyectos/ver/:id',
    component: AdmProyectoFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-proyectos' },
  },
  {
    path: 'usuarios',
    component: AdmUsuarioComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-usuarios' },
  },
  {
    path: 'usuarios/crear',
    component: AdmUsuarioFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-usuarios' },
  },
  {
    path: 'usuarios/actualizar/:id',
    component: AdmUsuarioFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-usuarios' },
  },
  {
    path: 'usuarios/ver/:id',
    component: AdmUsuarioFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-usuarios' },
  },
  {
    path: 'documentos',
    component: AdmDocumentoComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-documentos' },
  },
  {
    path: 'documentos/crear',
    component: AdmDocumentoCrearComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-documentos' },
  },
  {
    path: 'documentos/actualizar/:id',
    component: AdmDocumentoActualizarComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-documentos' },
  },
  {
    path: 'documentos/ver/:id',
    component: AdmDocumentoVerComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-documentos' },
  },
  {
    path: 'configuracion-documental',
    component: AdmConfiguracionDocumentalComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-documental' },
  },
  {
    path: 'configuracion-documental/crear',
    component: AdmConfiguracionDocumentalFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-documental' },
  },
  {
    path: 'configuracion-documental/actualizar/:id',
    component: AdmConfiguracionDocumentalFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-documental' },
  },
  {
    path: 'configuracion-documental/ver/:id',
    component: AdmConfiguracionDocumentalFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-documental' },
  },
  {
    path: 'configuracion-aseguradora',
    component: AdmConfiguracionAseguradoraComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-aseguradora' },
  },
  {
    path: 'configuracion-aseguradora/crear',
    component: AdmConfiguracionAseguradoraFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-aseguradora' },
  },
  {
    path: 'configuracion-aseguradora/actualizar/:id',
    component: AdmConfiguracionAseguradoraFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-aseguradora' },
  },
  {
    path: 'configuracion-aseguradora/ver/:id',
    component: AdmConfiguracionAseguradoraFormComponent,
    canActivate: [AuthorizeGuard],
    data: { permiso: 'adm-configuracion-aseguradora' },
  },
  {
    path: 'configurador-firma-contejo',
    component: AdmConfiguracionFirmaCotejoComponent,
    data: { permiso: 'adm-configuracion-firma-cotejo' },
  },
  {
    path: 'configurador-firma-contejo/crear',
    component: AdmConfiguracionFirmaCotejoFormComponent,
    data: { permiso: 'adm-configuracion-firma-cotejo' },
  },
  {
    path: 'configurador-firma-contejo/:id/:operation',
    component: AdmConfiguracionFirmaCotejoFormComponent,
    data: { permiso: 'adm-configuracion-firma-cotejo' },
  },
  {
    path: 'perfil',
    component: AdmPerfilComponent,
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}
