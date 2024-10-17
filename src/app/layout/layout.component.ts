import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  showHeader: boolean;

  constructor(private router: Router) {
    this.showHeader = !this.router.url.startsWith('/login');
  }
}
