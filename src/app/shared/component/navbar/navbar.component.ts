import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isDarkTheme = false;
  screenMode:any;

  constructor() { }

  ngOnInit(): void {
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    $('#body').toggleClass('lightMode');
  }
 
}
