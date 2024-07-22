import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ICatalogoOficina } from "src/app/modules/catalogos/helpers/interfaces/catalogo-oficina";
import { ICatalogoPais } from "src/app/modules/catalogos/helpers/interfaces/catalogo-pais";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IAseguradoraPaginate {
    _id: ObjectId;
    pais: string;
    nombreComercial: string;
    razonSocial: string;
    altaProyecto: string;
    altaProyectoShow: string;
    documentos: string;
    documentosShow: string;
    state: string;
    estadoFlag: boolean;
    icon:string;
    country:string;
}

export interface IAseguradoraGetCatalogs {

    paises: Array<ICatalogoPais>;
    estatus: Array<ICatalogo>;
    oficinas: Array<ICatalogoOficina>;
}

export interface IAseguradoraEdit {
    aseguradora: IAseguradora;
    catalagos: IAseguradoraGetCatalogs;

}

export interface IAseguradora {
    nombreComercial: string;
    razonSocial: string;
    pais: number;
    estatus: number;
    oficinas: Array<number>;
    altaProyecto: boolean;
    documentos: boolean;
}
