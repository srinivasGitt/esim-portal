import { Component, OnInit } from '@angular/core';
import { SubscriptionComponent } from 'src/app/shared/dialog/subscription/subscription.component';
import { DialogService } from 'src/app/shared/service/dialog';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
    // this.dialogService.openModal(SubscriptionComponent, { cssClass: 'modal-lg', context: 'Hi I am modal' })
    //   .instance.close.subscribe((data: any) => {
    //     console.log(data);
    //     })
  }

}
