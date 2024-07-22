import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export class IFnzCotejo {
    id: ObjectId = "";
    idUsuario: ObjectId = "";
    numeroCliente: string = "";
    pathFirma: string = "";
    documentos: Array<Documentos> = []
}

export class Documentos {
    id: ObjectId = "";
    filename: string = "";
    cotejar: boolean = false;
}

export interface IFnzArchivoCotejo {
    id: ObjectId;
    documento: string;
    url: string;
    nombreCorto: string;
    fechaAlta: string;
    archivoSize: number;
    changeCotejado: boolean;
    cotejado: Cotejado | undefined
}

export interface Cotejado {
    usuario: ObjectId;
    path: string;
    fechaCreacion: string;
}
