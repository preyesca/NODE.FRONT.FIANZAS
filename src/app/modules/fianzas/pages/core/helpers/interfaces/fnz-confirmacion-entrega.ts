import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IFnzConfirmacionEntrega {
  folio?: ObjectId;
  entregado: boolean;
  archivos: IFnzCFArchivos[];
}

export interface IFnzCFArchivos {
  expediente: ObjectId | undefined;
  correcto?: boolean;
  motivo?: ObjectId;
  usuarioAlta: ObjectId;
  fechaHoraAlta: Date;
}

export interface IFnzConfirmacionEntregaNotify {
  mailOptions: IFnzMailOptions;
  numeroIdentificador: string;
  afianzadora: string;
  asegurado: string;
  folioTramite: number;
  analista: string;
}
export interface IFnzMailOptions {
  to?: string[];
  cc?: string[];
  attachments?: FnzMailOptionsAttachment[];
}
export interface FnzMailOptionsAttachment {
  filename?: string;
  url?: string;
  contentType?: string;
}
