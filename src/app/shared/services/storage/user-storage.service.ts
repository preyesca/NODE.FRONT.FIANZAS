import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ILoginMultipleDto,
  ILoginProyectoDto,
  ILoginResponseDto,
  ILoginRolDto,
  ILoginSingleDto,
  IMultipleUserDto,
  ISelectProjectDto,
  ISingleUserDto,
} from 'src/app/modules/authentication/helpers/interfaces/login.interface';
import { IUserStorageUserDto } from '../../helpers/interfaces/storage/user-storage.interface';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private readonly _sessionUserKey = 'MRSH.keyUSER.inf0_';
  private readonly _folioInfoKey = 'MRSH.keyFOLIO.inf0_';
  private readonly _defaultPathKey = 'MRSH.keyDEFAULT_PATH.inf0_';

  private readonly _TEMPUserKey = 'MRSH.keyUSER.temp_';
  private readonly _TEMPProjectKey = 'MRSH.keyUSER_PROJECT.temp_';

  private proyectos: Array<ILoginProyectoDto> = [];
  private roles: Array<ILoginRolDto> = [];

  constructor(
    private router: Router,
    private authStorageService: AuthStorageService
  ) {}

  init(loginResponse: ILoginResponseDto): void {
    const multipleData = <ILoginMultipleDto>loginResponse.data;

    this.setDefaultPath(loginResponse.path);

    sessionStorage.setItem(
      this._TEMPUserKey,
      JSON.stringify({
        ...multipleData.usuario,
        proyectos: multipleData.proyectos,
      })
    );

    if (loginResponse.needToChoose) {
      //this.roles = multipleData.roles;
      this.proyectos = multipleData.proyectos;

      sessionStorage.setItem(
        this._TEMPProjectKey,
        JSON.stringify(multipleData)
      );
      this.router.navigateByUrl(loginResponse.path);
      return;
    }

    const loginSingle = <ILoginSingleDto>loginResponse.data;
    this.authStorageService.saveTokenAndRefreshToken(
      loginSingle.token,
      loginSingle.refreshToken
    );

    this.saveInfo(
      loginSingle.token,
      loginSingle.refreshToken,
      {
        _id: multipleData.proyectos && multipleData.proyectos[0]._id,
        codigo: multipleData.proyectos && multipleData.proyectos[0].codigo,
        pais: multipleData.proyectos && multipleData.proyectos[0].pais,
        rol: multipleData.proyectos && multipleData.proyectos[0].roles[0],
        proceso: multipleData.proyectos && multipleData.proyectos[0].proceso,
      },
      loginResponse.path
    );
  }

  getInfoSelectProject(): ILoginMultipleDto {
    const tempUser = sessionStorage.getItem(this._TEMPUserKey);

    if (tempUser === null) {
      this.authStorageService.logout();
      throw new Error(
        'Es necesario esta logueado en el sistema para obtener esta información.'
      );
    }

    const loginInfo = <ILoginMultipleDto>{
      proyectos: JSON.parse(sessionStorage.getItem(this._TEMPProjectKey)!)
        .proyectos,
      roles: JSON.parse(sessionStorage.getItem(this._TEMPProjectKey)!).roles,
      usuario: <IMultipleUserDto>JSON.parse(tempUser),
    };

    if (loginInfo.proyectos.length === 0) {
      this.authStorageService.logout();
      throw new Error('No se encontró el proyecto del usuario.');
    }

    if (!loginInfo.usuario) {
      this.authStorageService.logout();
      throw new Error('No se encontró información del usurio para mostrar.');
    }

    return loginInfo;
  }

  saveUserInfo(user: ISingleUserDto): void {
    sessionStorage.setItem(this._sessionUserKey, JSON.stringify(user));
  }

  saveInfo(
    token: string,
    refreshToken: string,
    selectedProject: ISelectProjectDto,
    path: string
  ): void {
    const tempUser = sessionStorage.getItem(this._TEMPUserKey);
    if (tempUser === null) {
      this.authStorageService.logout();
      return;
    }

    const userMultiple = <IMultipleUserDto>JSON.parse(tempUser);

    const user: ISingleUserDto = {
      _id: userMultiple._id,
      nombre: userMultiple.nombre,
      primerApellido: userMultiple.primerApellido,
      segundoApellido: userMultiple.segundoApellido,
      correoElectronico: userMultiple.correoElectronico,
      proyecto: selectedProject,

      // proyecto:
      // pais: project.pais,
      // // proyecto: project._id,
      // // cod_proyecto: project.codigo,
      //rol: project.rol,
    };

    sessionStorage.clear();

    this.setDefaultPath(path);
    this.authStorageService.saveTokenAndRefreshToken(token, refreshToken);
    this.saveUserInfo(user);
    this.router.navigateByUrl(path);
  }

  getCurrentUserInfo(): IUserStorageUserDto {
    const info = sessionStorage.getItem(this._sessionUserKey);

    if (info === null) {
      this.authStorageService.logout();
      throw new Error(
        'Es necesario esta logueado en el sistema para obtener esta información.'
      );
    }

    return <IUserStorageUserDto>JSON.parse(info!);
  }

  saveFolioInfo<T>(folio: T): void {
    sessionStorage.setItem(this._folioInfoKey, JSON.stringify(folio));
  }

  getFolioInfo<T>(): T | undefined {
    const info = sessionStorage.getItem(this._folioInfoKey);
    if (info === null) return;
    return <T>JSON.parse(info!);
  }

  //#region Initial Path

  setDefaultPath(value: string): void {
    sessionStorage.setItem(this._defaultPathKey, value);
  }

  getDefaultPath(): string {
    return sessionStorage.getItem(this._defaultPathKey) ?? '/busquedas';
  }

  //#endregion
}
