import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { AppConsts } from '../../AppConsts';

/*************************************************************************************************
  PARAMS: value: Date
  NOTE: El pipe recibe un valor de tipo Date y le aplica el formato de fecha prestablecido.
*************************************************************************************************/
@Pipe({ name: 'pipeDateFormat' })
export class PipeDateFormat implements PipeTransform {
  transform(value: moment.MomentInput) {
    return value ? moment.utc(value).format(AppConsts.FORMAT.DATE) : '';
  }
}
