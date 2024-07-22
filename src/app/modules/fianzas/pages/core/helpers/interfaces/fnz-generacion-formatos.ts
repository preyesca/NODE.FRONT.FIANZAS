import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IFnzGeneracionFormato {
    _id?: ObjectId;
    folio?: ObjectId;
    archivoFic?: ObjectId;
    archivoAnexo?: ObjectId;
    estatusGeneracionFormato?: number;
}