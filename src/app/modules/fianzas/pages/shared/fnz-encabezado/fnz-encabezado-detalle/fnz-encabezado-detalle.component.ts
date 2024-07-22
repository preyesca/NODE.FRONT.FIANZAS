import { Component, OnInit, inject } from '@angular/core';
import { EPerfil } from 'src/app/shared/helpers/enums/core/perfil.enum';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { AuthStorageService } from 'src/app/shared/services/storage/auth-storage.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';

@Component({
  selector: 'app-fnz-encabezado-detalle',
  templateUrl: './fnz-encabezado-detalle.component.html',
  styleUrls: ['./fnz-encabezado-detalle.component.scss'],
})
export class FnzEncabezadoDetalleComponent implements OnInit {
  readonly #userStorageService = inject(UserStorageService);
  readonly #authStorageService = inject(AuthStorageService);

  panelOpenState = false;
  userSession!: IUserStorageUserDto;
  showComponentCotejo: boolean = false;

  ngOnInit(): void {
    const userSession = this.#userStorageService.getCurrentUserInfo();
    if (!userSession) {
      this.#authStorageService.logout();
      return;
    }

    this.userSession = userSession!;
    this.showComponentCotejo =
      userSession.proyecto.rol.clave === EPerfil.SUPERVISOR_MESA ||
      userSession.proyecto.rol.clave === EPerfil.EJECUTIVO_MESA;
  }
}
