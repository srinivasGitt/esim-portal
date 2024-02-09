import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(
    value: Array<any> | undefined,
    searchTerm = '',
    keyIndex: any = undefined
  ): Array<any> | null {
    if (!value) return null;
    if (!searchTerm) return value;
    return value?.filter((item: any) => {
      const searchValue = keyIndex ? item[keyIndex] : item;
      return JSON.stringify(searchValue)
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase());
    });
  }
}
