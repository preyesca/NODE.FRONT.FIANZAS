import { EProceso } from '../../enums/core/proceso.enum';

export interface IUserStorageUserDto {
  _id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correoElectronico: string;
  proyecto: IUserStorageProyectoDto;
}
export interface IUserStoragePaisDto {
  clave: number;
  descripcion: string;
  abreviatura: string;
  icon: string;
  zonaHoraria: string;
}

export interface IUserStorageRolDto {
  _id: string;
  clave: number;
  descripcion: string;
}

export interface IUserStorageProyectoDto {
  _id: string;
  codigo: string;
  proceso: EProceso;
  aseguradora: string;
  pais: IUserStoragePaisDto;
  rol: IUserStorageRolDto;
}

// export interface IUserStorageAseguradoraDto {
//   _id: string;
//   nombreComercial: string;
//   razonSocial: string;
// }
