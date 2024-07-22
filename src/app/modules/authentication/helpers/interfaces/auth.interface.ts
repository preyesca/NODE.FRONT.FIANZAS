import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface ISessionToken{
  usuario: ObjectId;
  proyecto: ObjectId;
  rol: ObjectId;
}