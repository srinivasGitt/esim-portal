import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listFilter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args: any) {
    if(!value?.length) return value;
    if(value?.length > 0){
      return value.filter(
        (obj : any) => {
          let isSearchFound = true;
          let isFilteredFound = true;
          if(args?.searchTerm?.length && args.searchKey != ''){
            let tempString = obj[args.searchKey] || '';
            isSearchFound = (tempString?.toLowerCase()).includes((args?.searchTerm?.toLowerCase()));
          }

          if(args?.filterBy?.key != '' && args?.filterBy?.type != '' && args?.filterBy?.value){
            if(args?.filterBy?.type == 'date'){
              let tempDate : any = new Date(obj[args.filterBy.key]);
              if(tempDate != 'Invalid Date'){
                isFilteredFound = tempDate.getMonth() == args?.filterBy.value.month && tempDate.getFullYear() == args?.filterBy.value.year;
              }
            } else if(args?.filterBy?.type == 'string'){
              isFilteredFound = obj[args.filterBy.key] == args?.filterBy.value;
            }
          }
          return isSearchFound && isFilteredFound;
        }
      );
    }
  }

}
