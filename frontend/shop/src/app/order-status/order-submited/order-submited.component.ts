import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-order-submited',
  templateUrl: './order-submited.component.html',
  styleUrl: './order-submited.component.css'
})
export class OrderSubmitedComponent {

  id: string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.id = params['id']);
  }

}
