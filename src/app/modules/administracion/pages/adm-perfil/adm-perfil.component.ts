import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppConsts } from 'src/app/shared/AppConsts';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IUsuario, IUsuarioEdit } from '../../helpers/interfaces/adm-usuario';
import { AdmUsuarioService } from '../../services/adm-usuario.service';

@Component({
  selector: 'app-adm-perfil',
  templateUrl: './adm-perfil.component.html',
  styleUrls: ['./adm-perfil.component.scss'],
})
export class AdmPerfilComponent implements OnInit {
  frmUsuario: FormGroup = <FormGroup>{};
  frmUsuarioPassword: FormGroup = <FormGroup>{};

  breadcrumbs: string[] = [
    'administracion.title',
    'administracion.usuario.perfil',
  ];

  hide: boolean = true;
  hideNew: boolean = true;
  hideConfirm: boolean = true;

  userInfo!: IUserStorageUserDto;
  user!: IUsuario;

  constructor(
    private readonly notifierService: NotifierService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userStorageService: UserStorageService,
    private usuarioService: AdmUsuarioService,
    private location: Location
  ) {
    this.userInfo = this.userStorageService.getCurrentUserInfo();
  }
  

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frmUsuario = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(AppConsts.PATTERN.ONLY_LETTERS_WITH_SPACES),
        ],
      ],
      primerApellido: [
        '',
        [
          Validators.required,
          Validators.pattern(AppConsts.PATTERN.ONLY_LETTERS_WITH_SPACES),
        ],
      ],
      segundoApellido: [
        '',
        [Validators.pattern(AppConsts.PATTERN.ONLY_LETTERS_WITH_SPACES)],
      ],
      correoElectronico: [{ value: '', disabled: true }],
    });

    this.frmUsuarioPassword = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%\^&\*])(?=.{8,})/
            ),
            Validators.minLength(8),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.validatorPasswordsEquals()],
      }
    );

    this.usuarioService
      .getByIdAndGetCatalogosToEdit(this.userInfo._id)
      .subscribe({
        next: (response: IResponse<IUsuarioEdit>) => {
          if (response.success) {
            const { usuario, catalogos } = response.data;

            this.frmUsuario.reset(usuario);
            this.user = usuario;
          } else this.notifierService.error(response.message, 'Error');
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message);
        },
      });
  }

  checkField(field: string, error: string): boolean {
    return (
      this.frmUsuarioPassword.controls[field].hasError(error) &&
      (this.frmUsuarioPassword.controls[field].touched ||
        this.frmUsuarioPassword.controls[field].dirty)
    );
  }

  validatorPasswordsEquals() {
    return (form: FormGroup): ValidationErrors | null => {
      const password = form.get('newPassword')?.value || '';
      const checkPassword = form.get('confirmPassword')?.value || '';

      if (password !== checkPassword) {
        form.get('confirmPassword')?.setErrors({ passwordnoequal: true });
        return { passwordnoequal: true };
      }

      form.get('confirmPassword')?.setErrors(null);
      return null;
    };
  }

  submitGeneralInfo(): void {
    if (this.frmUsuario.invalid) {
      this.frmUsuario.markAllAsTouched();
      return;
    }

    const user: IUsuario = {
      ...this.user,
      ...this.frmUsuario.value,
    };

    this.usuarioService.update(this.userInfo._id, user).subscribe({
      next: (response: IResponse<IUsuario>) => {
        if (response.success) {
          this.return();
          this.notifierService.success(response.message);
        } else this.notifierService.error(response.message, 'Error');
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    });
  }

  return(): void {
    this.location.back();
  }

  submitChangePassword(): void {
    if (this.frmUsuarioPassword.invalid) {
      this.frmUsuarioPassword.markAllAsTouched();
      return;
    }

    const { password, newPassword } = this.frmUsuarioPassword.value;

    this.usuarioService
      .updateClave(this.userInfo._id, {
        correoElectronico: this.user.correoElectronico,
        currentPassword: password,
        newPassword,
      })
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success) {
            this.return();
            this.notifierService.success(response.message);
          } else this.notifierService.error(response.message, 'Error');
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }
}
