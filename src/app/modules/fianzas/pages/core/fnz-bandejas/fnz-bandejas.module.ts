import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipeModule } from 'src/app/shared/helpers/pipes/pipe.module';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module';
import { ShareComponentsModule } from 'src/app/shared/views/components/share-components.module';
import { FnzBandejaEntradaComponent } from './fnz-bandeja-entrada/fnz-bandeja-entrada.component';
import { FnzBandejaProgramadaComponent } from './fnz-bandeja-programada/fnz-bandeja-programada.component';
import { FnzBandejaReprocesoComponent } from './fnz-bandeja-reproceso/fnz-bandeja-reproceso.component';
import { FnzBandejaSuspendidaComponent } from './fnz-bandeja-suspendida/fnz-bandeja-suspendida.component';
import { FnzBandejasRoutingModule } from './fnz-bandejas-routing.module';

@NgModule({
  declarations: [
    FnzBandejaEntradaComponent,
    FnzBandejaReprocesoComponent,
    FnzBandejaProgramadaComponent,
    FnzBandejaSuspendidaComponent
  ],
  imports: [
    CommonModule,
    FnzBandejasRoutingModule,
    AngularMaterialModule,
    ShareComponentsModule,
    PipeModule
  ]
})
export class FnzBandejasModule { }
