import { Pipe, PipeTransform } from '@angular/core';

/*************************************************************************************************
  PARAMS: value: Number
  NOTE: El pipe recibe un valor de tipo Number que representa los bytes del archivo y lo expresa en
        su tamaño en disco.
*************************************************************************************************/
@Pipe({
  name: 'pipeFileSizeFormat',
})
export class PipeFileSizeFormat implements PipeTransform {
  transform(value: number): string {
    if (value === 0) return '0 Bytes';
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
