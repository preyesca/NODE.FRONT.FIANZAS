import { EProceso } from 'src/app/shared/helpers/enums/core/proceso.enum';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface ILoginDto {
  correoElectronico: string;
  password: string;
}

export interface ILoginResponseDto {
  path: string;
  needToChoose: boolean;
  data: any;
}

export interface ILoginPaisDto {
  clave: number;
  descripcion: string;
  abreviatura: string;
  icon: string;
}

export interface ILoginRolDto {
  _id: ObjectId;
  clave: number;
  descripcion: string;
}

export interface ILoginProyectoDto {
  _id: ObjectId;
  pais: ILoginPaisDto;
  aseguradora: ObjectId;
  codigo: string;
  roles: Array<ILoginRolDto>;
  proceso: EProceso;
}

/***** Single Project and Role */

export interface ILoginSingleDto {
  token: string;
  refreshToken: string;
  usuario: ISingleUserDto;
  proyectos: Array<ILoginProyectoDto>;
}

export interface ISingleUserDto {
  _id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correoElectronico: string;
  proyecto: ISelectProjectDto;
}

/***** Multiple Project and Role */

export interface ILoginMultipleDto {
  usuario: IMultipleUserDto;
  proyectos: Array<ILoginProyectoDto>;
  //roles: Array<ILoginRolDto>;
}

export interface IMultipleUserDto {
  _id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  //pais: ILoginPaisDto;
  proyectos: Array<ILoginProyectoDto>;
}

export interface ISelectProjectDto {
  _id: string;
  codigo: string;
  pais: ILoginPaisDto;
  rol: ILoginRolDto;
  proceso: EProceso;
}
