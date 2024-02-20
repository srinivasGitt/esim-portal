import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleCheck'
})
export class RoleCheckPipe implements PipeTransform {

  transform(items: any[], userRole: string): any[] {
    console.log(items);
    console.log(userRole);
    if (!items || !userRole) {
      return [];
    }
    return items.filter(item => item.accessRole === userRole);
  }

}
