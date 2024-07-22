import { Pipe, PipeTransform, inject } from '@angular/core';
import * as moment from 'moment-timezone';
import { AppConsts } from '../../AppConsts';
import { UserStorageService } from '../../services/storage/user-storage.service';

/*************************************************************************************************
  PARAMS: value: Date
  NOTE: El pipe recibe un valor de tipo Date y le aplica el formato de fechaHora prestablecido.
*************************************************************************************************/
@Pipe({ name: 'pipeDatetimeFormat' })
export class PipeDatetimeFormat implements PipeTransform {
  private storage = inject(UserStorageService);
  transform(value: moment.MomentInput) {
    const tz = this.storage.getCurrentUserInfo().proyecto.pais.zonaHoraria;
    return value
      ? moment(value).clone().tz(tz).format(AppConsts.FORMAT.DATETIME)
      : '--';
  }
}
