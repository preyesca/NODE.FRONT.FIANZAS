import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IInfoUser } from '../../helpers/interfaces/info-user.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoUserState {
  private _infoUser$ = new BehaviorSubject<IInfoUser>({} as IInfoUser);
  infoUser$ = this._infoUser$.asObservable();
  
  setInfoUser(info: IInfoUser): void {
    this._infoUser$.next(info);
  }
}
