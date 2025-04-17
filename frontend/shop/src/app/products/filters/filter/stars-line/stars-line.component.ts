import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stars-line',
  templateUrl: './stars-line.component.html',
  styleUrl: './stars-line.component.css'
})
export class StarsLineComponent {

  starFull: string = "★"
  starEmpty: string = "✰"
  starsNumber: number = 5;

  @Input() stars!: number;
  line: string = '';


  ngOnInit() {

    this.stars = Math.floor(this.stars)

    for (let i = 0; i < this.stars; i++) {
      this.line += this.starFull;
    }

    for (let i = 0; i < this.starsNumber - this.stars; i++) {
      this.line += this.starEmpty;
    }

  }

}
