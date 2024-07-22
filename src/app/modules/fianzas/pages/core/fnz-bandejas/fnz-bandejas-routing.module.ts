import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/app/shared/guards/authorize.guard';
import { FnzConsts } from '../../../helpers/consts/fnz.consts';
import { FnzBandejaEntradaComponent } from './fnz-bandeja-entrada/fnz-bandeja-entrada.component';
import { FnzBandejaProgramadaComponent } from './fnz-bandeja-programada/fnz-bandeja-programada.component';
import { FnzBandejaReprocesoComponent } from './fnz-bandeja-reproceso/fnz-bandeja-reproceso.component';
import { FnzBandejaSuspendidaComponent } from './fnz-bandeja-suspendida/fnz-bandeja-suspendida.component';

const routes: Routes = [
  {
    path: 'entradas',
    component: FnzBandejaEntradaComponent,
    canActivate: [AuthorizeGuard],
    data: {
      permiso: FnzConsts.PERMISSIONS.bandeja_entradas,
    },
  },
  {
    path: 'reprocesos',
    component: FnzBandejaReprocesoComponent,
    canActivate: [AuthorizeGuard],
    data: {
      permiso: FnzConsts.PERMISSIONS.bandeja_reprocesos,
    },
  },
  {
    path: 'suspendidas',
    component: FnzBandejaSuspendidaComponent,
    canActivate: [AuthorizeGuard],
    data: {
      permiso: FnzConsts.PERMISSIONS.bandeja_suspendidas,
    },
  },
  {
    path: 'programadas',
    component: FnzBandejaProgramadaComponent,
    canActivate: [AuthorizeGuard],
    data: {
      permiso: FnzConsts.PERMISSIONS.bandeja_programadas,
    },
  },
  {
    path: '',
    redirectTo: 'entradas',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FnzBandejasRoutingModule {}
