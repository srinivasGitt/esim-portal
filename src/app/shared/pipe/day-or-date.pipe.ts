import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dayOrDate',
})
export class DayOrDatePipe implements PipeTransform {
  transform(value: Date): string {
    // Using moment.js to handle the dates properly
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    const inputDate = moment(value).startOf('day');

    let result: string;

    switch (true) {
      // For Today, it display the result like (18:18, Today)
      case inputDate.isSame(today, 'day'):
        result = this.formatTime(value) + ', Today';
        break;
      // For Tomorrow, it display the result like (18:18, Tomorrow)
      case inputDate.isSame(tomorrow, 'day'):
        result = this.formatTime(value) + ', Tomorrow';
        break;
      // For Yesterday, it display the result like (18:18, Yesterday)
      case inputDate.isSame(yesterday, 'day'):
        result = this.formatTime(value) + ', Yesterday';
        break;
      // If date is in the same week, returns the result as (12:45, Sunday)
      case inputDate.isSame(today, 'week'):
        result = this.formatTime(value) + ', ' + inputDate.format('dddd');
        break;
      // If date is beyond the current week, it display the result like (18:18, 20 Feb 24)
      default:
        result = this.formatTime(value) + ', ' + inputDate.format('D MMM YY');
        break;
    }

    return result;
  }

  // extracting the time and formatting it to display like (20:45)
  private formatTime(date: Date): string {
    return moment(date).format('HH:mm');
  }
}
