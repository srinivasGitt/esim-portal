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
