import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IProyecto {
  pais: number;
  estatus: number;
  aseguradora: ObjectId;
  proceso: number;
  negocio: number;
  ramo: number;
  ceco: string;
  codigo: string;
  portal: string;
  nombreCliente?: string;
  nombreComercial?: string;
}

export interface IProyectoEdit{
  proyecto: IProyecto;
  catalogos: IProyectoCatalogs;
}

export interface IProyectoPaginate {
  _id: ObjectId;
  pais: IPais;
  ramo: ICommon;
  proceso: ICommon;
  negocio: ICommon;
  estatus: ICommon;
  aseguradora: IAseguradora;
  ceco: string;
}

export interface IPais {
  _id: ObjectId;
  clave: number;
  descripcion: string;
  abreviatura: string;
  icon: string;
  activo: boolean;
}

export interface ICommon {
  _id: ObjectId;
  clave: number;
  descripcion: string;
  activo: boolean;
}
export interface IAseguradora {
  _id: ObjectId;
  razonSocial: string;
  nombreComercial: string;
  pais: number;
  estatus: number;
  altaProyecto: boolean;
  documentos: boolean;
}

export interface IProyectoCodigo {
  _id: ObjectId;
  codigo: string;
  pais: number;
}

export interface IProyectoCatalogs {
  paises: Array<ICatalogoPais>;
  aseguradora: Array<IAseguradora>;
  ramo: Array<ICatalogo>;
  proceso: Array<ICatalogo>;
  negocio: Array<ICatalogo>;
  estatus: Array<ICatalogo>;
}
