import { ICatalogo } from "./catalogo";

export interface ICatalogoPais extends ICatalogo {
    abreviatura: string;
    icon?: string;
}