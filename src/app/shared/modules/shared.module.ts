import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../helpers/pipes/pipe.module';

@NgModule({
  imports: [TranslateModule, PipeModule],
  exports: [TranslateModule, PipeModule],
})
export class SharedModule {}
