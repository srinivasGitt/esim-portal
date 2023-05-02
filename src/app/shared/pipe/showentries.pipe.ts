import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showentries'
})
export class ShowentriesPipe implements PipeTransform {

  transform(currentPage: number, totalEntries: number, itemsPerPage: number, entriesPerPage: number){
    
    let count: number = 0
    
    if(itemsPerPage - entriesPerPage == 0) {
      count = itemsPerPage * (currentPage+1)
    }
    
    if(itemsPerPage - entriesPerPage > 0) {
      count = totalEntries
    }
    
    return `Showing ${count} of ${totalEntries} entries`;
  
  }
}
