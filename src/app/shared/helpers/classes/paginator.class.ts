import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class TablePaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  constructor(private readonly translateService: TranslateService) {}
  firstPageLabel = this.translateService.instant('general.table.firstPage');
  itemsPerPageLabel = this.translateService.instant(
    'general.table.recordsPerPage'
  );
  lastPageLabel = this.translateService.instant('general.table.lastPage');
  nextPageLabel = this.translateService.instant('general.table.nextPage');
  previousPageLabel = this.translateService.instant(
    'general.table.previousPage'
  );
  getRangeLabel(page: number, pageSize: number, length: number): string {
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    const of = this.translateService.instant('general.table.pageOf');
    return $localize`${startIndex + 1} - ${endIndex} ${of} ${length}`;
  }
}
