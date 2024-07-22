import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IActividad {
    _id?: ObjectId;
    proyecto: string;
    folioMultisistema: number;
    actividad: number;
    estatus: number;
    usuario: number;
    rol: number;
}

export interface IWorlFlow {
    folio: string;
    actividadInicial: number;
    actividadFinal: number;
    actividad:string;
    notificacion?:number
    idDocumento?:string;
    reproceso?:boolean;
    comentarios?:string;
    documentos?:string[]
}

