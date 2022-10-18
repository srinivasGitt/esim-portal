import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  activeUrl = 'dashboard';
  constructor(private router:Router) { 
    router.events.subscribe(
      (data: any) => {
        this.activeUrl = this.router.url;
      }
    )
  }
 

  ngOnInit(): void {
  }

}
