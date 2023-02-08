import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UsersService } from '../shared/service';
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  
  constructor(private userService: UsersService) {
    this.userService.getUserDetails().subscribe(
      (result) => this.userService.setCurrentUser(result)
    );
  }
  ngOnInit(): void {
  }
}
