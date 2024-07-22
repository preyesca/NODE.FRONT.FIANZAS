import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FnzSearchDataService {
  private searchSource = new BehaviorSubject<string>('');

  constructor() {}

  changeMessage(message: string) {
    this.searchSource.next(message);
  }

  setValueSearch(value: string) {
    this.searchSource.next(value);
  }

  getValueSearch() {
    return this.searchSource.asObservable();
  }
}
