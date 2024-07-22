import * as moment from 'moment';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IFnzFolioEstatusPaginate {
  _id: ObjectId;
  filename: string;
  archivoSize: number;
  totalRows: number;
  fechaInicioCarga: moment.Moment;
  fechaFinCarga: Date;
  correcto: boolean;
  procesado: boolean;
}

export interface IFnzFolioLayoutDetailColumn {
  rowIndex: number;
  columnName: string;
  message: string;
}

export interface IFnzFolioLayoutDetail {
  _id: string;
  block: number;
  rowIndex: number;
  success: boolean;
  message: string;
  columns: Array<IFnzFolioLayoutDetailColumn>;
}

export interface IFnzFolioLayoutHeader {
  _id: ObjectId;
  filename: string;
  correcto: boolean;
  archivoSize: number;
  totalRows: number;
  fechaInicioCarga: Date;
  fechaFinCarga: Date;
}

export interface IFnzFolioLayout {
  header: IFnzFolioLayoutHeader;
  details: IPaginate<IFnzFolioLayoutDetail>;
}
