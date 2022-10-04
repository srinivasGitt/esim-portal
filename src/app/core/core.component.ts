import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
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
