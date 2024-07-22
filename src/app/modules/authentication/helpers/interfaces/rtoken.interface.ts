import { ERefreshTokenStatus } from "../enums/rtoken-estatus.enum";

export interface IResponseRefreshToken{
    status: ERefreshTokenStatus;
    token?: string;
}