import { NgModule } from '@angular/core';
import { PipeDateFormat } from './date.pipe';
import { PipeDatetimeFormat } from './datetime.pipe';
import { PipeFileSizeFormat } from './fileSize.pipe';

@NgModule({
  declarations: [PipeDateFormat, PipeDatetimeFormat, PipeFileSizeFormat],
  exports: [PipeDateFormat, PipeDatetimeFormat, PipeFileSizeFormat],
})
export class PipeModule {}
