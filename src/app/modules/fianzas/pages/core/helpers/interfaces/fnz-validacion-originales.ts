import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IValidacionOriginalesArchivos {
  expediente?: ObjectId;
  documento: ObjectId;
  motivo?: number;
  correcto?: boolean;
}

