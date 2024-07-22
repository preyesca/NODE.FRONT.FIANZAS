import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';
import { IProyectoCodigo } from './adm-proyecto';

export interface IUsuario {
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correoElectronico: string;
  //pais: number;
  //proyecto: ObjectId;
  //perfil: number;
  proyectos: Array<IUsuarioProject>;
  estatus: number;
  intentos?: number;
}

export interface IUsuarioProject {
  proyecto: string;
  pais: number;
  perfiles: number[];
}

export interface IUsuarioEdit {
  usuario: IUsuario;
  catalogos: IUsuarioGetCatalogs;
  proyectos: Array<IProyectoCodigo>;
}

export interface IUsuarioPaginate {
  _id: ObjectId;
  paisIcon: string;
  paisDescripcion: string;
  nombreCompleto: string;
  correoElectronico: string;
  estatus: string;
  rol: number;
  nombreRol: string;
  sesionAbierta: boolean;
  activo: boolean;
}

export interface IUsuarioGetCatalogs {
  paises: Array<ICatalogoPais>;
  estatus: Array<ICatalogo>;
  perfiles: Array<ICatalogo>;
  proyectos: Array<IProyectoCodigo>;
  proyectosByPais: Array<IProyectoCodigo>;
}
