import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ToggleService } from '../services/layout/toggle.service';
import { NotifierService } from '../services/notification/notifier.service';
import { AuthStorageService } from '../services/storage/auth-storage.service';
import { UserStorageService } from '../services/storage/user-storage.service';

export const AuthorizeGuard: CanActivateFn = async (route, state) => {
  const authStorageService = inject(AuthStorageService);
  const router = inject(Router);
  const permisoService = inject(ToggleService);
  const notifierService = inject(NotifierService);
  const userStorageService = inject(UserStorageService);

  if (!authStorageService.isLoggedIn()) {
    router.navigateByUrl('/authentication/login');
    notifierService.error('No tiene una sesión activa, ingrese al sistema');
    return false;
  }

  const permiso = route.data['permiso'];

  if (!permiso) {
    router.navigateByUrl(userStorageService.getDefaultPath());
    notifierService.error(
      'No tiene permisos al módulo que intenta ingresar, consulte al administrador'
    );

    return false;
  }

  const checkPermiso: any = await lastValueFrom(
    permisoService.checkPermiso(route.data['permiso'])
  );

  if (!checkPermiso.success) {
    router.navigateByUrl(userStorageService.getDefaultPath());
    notifierService.error(checkPermiso.message);
    return false;
  }

  return true;
};
