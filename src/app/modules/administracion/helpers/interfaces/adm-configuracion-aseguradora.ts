import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ICatalogoPais } from "src/app/modules/catalogos/helpers/interfaces/catalogo-pais";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";


export interface IConfiguracionAseguradoraPaginate {
  _id: ObjectId;
  pais: IPais;
  proyecto: IProyecto;
  aseguradora: IAseguradora;
  correos: Array<string>;
}

export interface IPais {
  _id: ObjectId;
  clave: number;
  descripcion: string;
  abreviatura: string;
  icon: string;
  activo: boolean;
}

export interface IProyecto {
  pais: number;
  estatus: number;
  aseguradora: ObjectId;
  proceso: number;
  negocio: number;
  ramo: number;
  ceco: string;
  codigo: string;
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

export interface IConfiguracionAseguradora {
  pais: number;
  aseguradora: ObjectId;
  proyecto: ObjectId;
  oficinas: Array<IOficinaCorreo>
}

export interface IOficinaCorreo {
  oficina?: number;
  correos: Array<string>;
  descripcion:string;
}


export interface IConfiguracionAseguradoraEdit {
  configuracionAseguradora: IConfiguracionAseguradora;
  catalogos: IConfiguracionAseguradoraCatalogs;
}


export interface IConfiguracionAseguradoraCatalogs {
  paises: Array<ICatalogoPais>;
  aseguradora: Array<IAseguradoraCatalog>;
  proyecto: Array<IProyectoCatalog>;
  correos: Array<string>;
  oficinas: Array<ICatalogo>;
}

export interface IAseguradoraCatalog {
  _id: ObjectId;
  razonSocial: string;
  nombreComercial: string;
  pais: number;
  estatus: number;
  altaConfiguracionDocumental: boolean;
  documentos: boolean;
}

export interface IProyectoCatalog {
  _id: ObjectId;
  pais: number;
  estatus: number;
  aseguradora: ObjectId;
  proceso: number;
  negocio: number;
  ramo: number;
  ceco: string;
  codigo: string;
}

