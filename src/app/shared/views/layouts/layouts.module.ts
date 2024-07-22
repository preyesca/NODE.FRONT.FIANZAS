import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { NavbarComponent } from './private-layout/navbar/navbar.component';
import { PrivateLayoutComponent } from './private-layout/private-layout.component';
import { SidebarComponent } from './private-layout/sidebar/sidebar.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { CountdownModule } from 'ngx-countdown';


@NgModule({
  declarations: [
    PrivateLayoutComponent,
    PublicLayoutComponent,
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    AngularMaterialModule,
    NgScrollbarModule,
    TranslateModule,
    CountdownModule
  ],
  providers: [
    DatePipe,
    DecimalPipe
],
})
export class LayoutsModule { }
