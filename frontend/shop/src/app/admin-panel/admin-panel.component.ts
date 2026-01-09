import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

  items: { name: string, routerLink: string }[] = []

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.items = [
      {
        name: 'Categories',
        routerLink: "categories"
      },
      {
        name: 'Products',
        routerLink: "products"
      },
      {
        name: 'Filters',
        routerLink: "filters"
      },
      {
        name: 'Orders',
        routerLink: "orders"
      },
      {
        name: 'Shops',
        routerLink: "shops"
      },
      {
        name: 'Clients',
        routerLink: "clients"
      }]
  }

}
