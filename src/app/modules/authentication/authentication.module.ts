import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthActivateAccountComponent } from './pages/auth-activate-account/auth-activate-account.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { AuthSelectProjectComponent } from './pages/auth-select-project/auth-select-project.component';
import { AuthRecoverPasswordComponent } from './pages/auth-recover-password/auth-recover-password.component';


@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthSelectProjectComponent,
    AuthActivateAccountComponent,
    AuthRecoverPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class AuthenticationModule { }
