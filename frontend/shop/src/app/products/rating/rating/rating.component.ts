import { Component,  Input } from '@angular/core';
import { Rating } from '../rating';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  @Input() rating!: Rating



}
