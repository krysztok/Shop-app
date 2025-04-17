import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-grid',
  templateUrl: './select-grid.component.html',
  styleUrl: './select-grid.component.css'
})
export class SelectGridComponent {

  @Input() columns: number = 3;
  @Input() width: number = 1400;
  @Input() options: string[] = [];
  selectedIndex: number | null = null;
  @Input() optionsAdditionalParams: any[] | null = null;

  @Output() selectedIndexEmitter: EventEmitter<number | null> = new EventEmitter<number | null>();
  
  selectedIndexChange(){
    this.selectedIndexEmitter.emit(this.selectedIndex);
  }

}
