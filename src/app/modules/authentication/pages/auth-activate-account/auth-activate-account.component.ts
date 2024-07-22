import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IResponse} from 'src/app/shared/helpers/interfaces/response';
import {NotifierService} from 'src/app/shared/services/notification/notifier.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-auth-activate-account',
  templateUrl: './auth-activate-account.component.html',
  styleUrls: ['./auth-activate-account.component.scss'],
})
export class AuthActivateAccountComponent implements OnInit {
  frmActivateAccount: FormGroup = <FormGroup>{};
  hide = true;
  hideRepeat = true;
  idUsuario: string = '';
  nombreUsuario: string = '';

  constructor(
    private router: Router,
    private routeActivated: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
    this.idUsuario = this.routeActivated.snapshot.params['id'] || '';
  }

  ngOnInit(): void {
    this.frmActivateAccount = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%\^&\*])(?=.{8,})/), Validators.minLength(8),]],
      newPasswordConfirm: ['', [Validators.required]],
    }, {
      validators: [this.validatorPasswordsEquals()]
    });

    /* this.frmActivateAccount.controls['newPasswordConfirm'].setValidators([
      Validators.required,
      this.validatorPasswordsEquals.bind(this.frmActivateAccount),
    ]); */

    this.onLoad();
  }

  onLoad(): void {
    this.authService.getNameUser(this.idUsuario).subscribe({
      next: (response: IResponse) => {
        if (response.success) {
          if (response.data.estatus !== "Registrado") {
            this.router.navigateByUrl('/authentication/login')
            return;
          }
          this.nombreUsuario = response.data.nombre;
        } else this.notifierService.warning(response.message);
      },
      error: (error) => this.notifierService.error(error.error.message),
    });
  }

  changeNewPassword(): void {

    if (this.frmActivateAccount.controls['newPassword'].value.trim() == '' && this.frmActivateAccount.controls['newPasswordConfirm'].value.trim() == '') {
      this.notifierService.warning('Complete los campos requeridos')
      return
    }

    if (!this.frmActivateAccount.valid) {
      if (this.frmActivateAccount.get('newPassword')?.hasError('pattern')) {
        return;
      }
      this.notifierService.warning('La contraseña debe coincidir')
      return
    }

    const {newPassword} = this.frmActivateAccount.value

    this.authService
      .activateAccount(this.idUsuario, {
        contrasena: (newPassword as string).trim(),
      })
      .subscribe({
        next: (response: IResponse<any>) => {
          response.success
            ? this.notifierService.success(response.message)
            : this.notifierService.warning(response.message);
          this.router.navigateByUrl('/');
        },
        error: (error) => this.notifierService.warning(error.error.message),
      });
  }

  checkField(field: string, error: string): boolean {
    return this.frmActivateAccount.controls[field].hasError(error) && (this.frmActivateAccount.controls[field].touched || this.frmActivateAccount.controls[field].dirty);
  }

  validatorPasswordsEquals() {
    return (form: FormGroup): ValidationErrors | null => {
      const password = form.get('newPassword')?.value || '';
      const checkPassword = form.get('newPasswordConfirm')?.value || '';

      if(password !== checkPassword) {
        form.get('newPasswordConfirm')?.setErrors({ passwordnoequal: true });
        return { passwordnoequal: true }
      };

      form.get('newPasswordConfirm')?.setErrors(null);
      return null;
    };
  }

  /* validatorPasswordsEquals(
    control: UntypedFormControl
  ): { [s: string]: boolean } | null {
    let formActivateAccount: any = this;
    if (control.value !== formActivateAccount.controls['newPassword'].value)
      return { passwordnoequal: true };
    return null;
  } */
}
