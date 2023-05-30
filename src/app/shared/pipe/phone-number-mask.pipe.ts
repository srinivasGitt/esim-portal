import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberMask'
})
export class PhoneNumberMaskPipe implements PipeTransform {

  transform(value: string): string {
    if(!value) {
      return ''
    }
    
    const maskedPhone = `${value.slice(0,3)}-${value.slice(3,7)}-${value.slice(7,10)}`
    return maskedPhone;
  }

}
