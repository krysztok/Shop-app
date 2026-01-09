import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-main-tab',
  templateUrl: './admin-main-tab.component.html',
  styleUrl: './admin-main-tab.component.css'
})
export class AdminMainTabComponent {
  @Input() name!: string;
  @Input() routerLink!: string;

}
