import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ShareComponentsModule } from 'src/app/shared/views/components/share-components.module';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdmAseguradoraActualizarComponent } from './pages/adm-aseguradora/adm-aseguradora-actualizar/adm-aseguradora-actualizar.component';
import { AdmAseguradoraCrearComponent } from './pages/adm-aseguradora/adm-aseguradora-crear/adm-aseguradora-crear.component';
import { AdmAseguradoraFormComponent } from './pages/adm-aseguradora/adm-aseguradora-form/adm-aseguradora-form.component';
import { AdmAseguradoraVerComponent } from './pages/adm-aseguradora/adm-aseguradora-ver/adm-aseguradora-ver.component';
import { AdmAseguradoraComponent } from './pages/adm-aseguradora/adm-aseguradora.component';
import { AdmConfiguracionAseguradoraFormComponent } from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora-form/adm-configuracion-aseguradora-form.component';
import { AdmConfiguracionAseguradoraComponent } from './pages/adm-configuracion-aseguradora/adm-configuracion-aseguradora.component';
import { AdmConfiguracionDocumentalFormComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental-form/adm-configuracion-documental-form.component';
import { AdmConfiguracionDocumentalTableComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental-form/adm-configuracion-documental-table/adm-configuracion-documental-table.component';
import { AdmConfiguracionDocumentalComponent } from './pages/adm-configuracion-documental/adm-configuracion-documental.component';
import { AdmConfiguracionFirmaCotejoFormComponent } from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo-form/adm-configuracion-firma-cotejo-form.component';
import { AdmConfiguracionFirmaCotejoComponent } from './pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo.component';
import { AdmDocumentoActualizarComponent } from './pages/adm-documento/adm-documento-actualizar/adm-documento-actualizar.component';
import { AdmDocumentoCrearComponent } from './pages/adm-documento/adm-documento-crear/adm-documento-crear.component';
import { AdmDocumentoFormComponent } from './pages/adm-documento/adm-documento-form/adm-documento-form.component';
import { AdmDocumentoVerComponent } from './pages/adm-documento/adm-documento-ver/adm-documento-ver.component';
import { AdmDocumentoComponent } from './pages/adm-documento/adm-documento.component';
import { AdmPerfilComponent } from './pages/adm-perfil/adm-perfil.component';
import { AdmProyectoFormComponent } from './pages/adm-proyecto/adm-proyecto-form/adm-proyecto-form.component';
import { AdmProyectoComponent } from './pages/adm-proyecto/adm-proyecto.component';
import { AdmUsuarioFormComponent } from './pages/adm-usuario/adm-usuario-form/adm-usuario-form.component';
import { AdmUsuarioComponent } from './pages/adm-usuario/adm-usuario.component';
import { AdmReporteSeguimientoComponent } from './pages/adm-reporte-seguimiento/adm-reporte-seguimiento.component';

@NgModule({
  declarations: [
    AdmAseguradoraComponent,
    AdmProyectoComponent,
    AdmUsuarioComponent,
    AdmDocumentoComponent,
    AdmConfiguracionDocumentalComponent,
    AdmConfiguracionDocumentalFormComponent,
    AdmConfiguracionDocumentalTableComponent,
    AdmUsuarioFormComponent,
    AdmProyectoFormComponent,
    AdmAseguradoraCrearComponent,
    AdmAseguradoraActualizarComponent,
    AdmAseguradoraVerComponent,
    AdmAseguradoraFormComponent,
    AdmDocumentoCrearComponent,
    AdmDocumentoActualizarComponent,
    AdmDocumentoVerComponent,
    AdmDocumentoFormComponent,
    AdmConfiguracionAseguradoraComponent,
    AdmConfiguracionAseguradoraFormComponent,
    AdmConfiguracionFirmaCotejoComponent,
    AdmConfiguracionFirmaCotejoFormComponent,
    AdmPerfilComponent,
    AdmReporteSeguimientoComponent,
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ShareComponentsModule,
    SharedModule,
    NgxGraphModule,
  ],
})
export class AdministracionModule {}
