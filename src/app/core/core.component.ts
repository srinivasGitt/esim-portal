import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/service';
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent implements OnInit {
  constructor(public userService: UsersService) {
    userService.getUserDetails().subscribe((result) => userService.setCurrentUser(result));
  }
  ngOnInit(): void {}
}
