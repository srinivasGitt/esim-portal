import { getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyToDisplay',
})
export class KeyToDisplayPipe implements PipeTransform {
  transform(key: any): string {
    switch (key) {
      case 'total_profile_sale':
        return 'Total Profiles Sales';
      case 'total_subscriber':
        return 'Total Subscribers';
      case 'total_active_customer':
        return 'Total Active Customers';
      case 'total_sales_of_trs':
        return 'Total Sales of TRS';
      case 'total_sales_of_webapp':
        return 'Total Sales of Web App';
      case 'total_sales_of_mobileapp':
        return 'Total Sales of Mobile App';
      default:
        return '';
    }
  }
}

@Pipe({
  name: 'currencyByMatchingkey',
})
export class CurrencyByMatchingkeyPipe implements PipeTransform {
  // transform(value: any, key: any): any {
  //   switch (key) {
  //     case 'total_profile_sale':
  //       return '$ ' + value.toFixed(2);
  //     case 'total_subscriber':
  //       return value;
  //     case 'total_active_customer':
  //       return value;
  //     case 'total_sales_of_trs':
  //       return '$ ' + value.toFixed(2);
  //     case 'total_sales_of_webapp':
  //       return '$ ' + value.toFixed(2);
  //     case 'total_sales_of_mobileapp':
  //       return '$ ' + value.toFixed(2);
  //     default:
  //       return '';
  //   }
  transform(value: any, obj: any): any {
    if (!obj.hasOwnProperty('value')) {
      return obj;
    }

    if (obj.hasOwnProperty('value')) {
      console.log(`${getCurrencySymbol(obj.currency, 'wide')} ${obj.value.toFixed(2)}`)
      return `${getCurrencySymbol(obj.currency, 'wide')} ${obj.value.toFixed(2)}`;
    }
  }
}
