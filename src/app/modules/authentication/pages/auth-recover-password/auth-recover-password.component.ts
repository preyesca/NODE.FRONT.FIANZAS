import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './auth-recover-password.component.html',
  styleUrls: ['./auth-recover-password.component.scss']
})
export class AuthRecoverPasswordComponent implements OnInit {
  form: FormGroup = <FormGroup>{};

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService,
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/
          ),
        ],
      ],
    });
  }

  submit(): void {
    const body = this.form.value;
    this.authService.recoverPassword(body).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          this.notifierService.success(response.message);
          this.router.navigateByUrl("/authentication/login");
        }
        else this.notifierService.warning(response.message);
      },
      error: (error) => this.notifierService.warning(error.error.message),
    });
  }

}
