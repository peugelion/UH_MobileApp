import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
//import { Constants } from '../../providers/constants/constants';
import * as Constants from '../../providers/constants/constants';

/**
 * Generated class for the DateTimeFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateTimeFormatPipe',
})
//export class DateTimeFormatPipe implements PipeTransform {
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
  /**
   * Takes a DATE_TIME_FMT value and make it default date format.
   */
  transform(value: any, args?: any): any {
    return super.transform(value, Constants.DATE_TIME_FMT);
  }
}