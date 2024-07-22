import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

 
export interface ITitular {
    _id: ObjectId;
    proyecto: ObjectId;
    numeroCliente: string;
    nombre?: string;
    primerApellido: string;
    segundoApellido: string;
    tipoPersona: ObjectId;
}
