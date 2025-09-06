import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FiltersService } from '../../../products/filters/filters.service';

@Component({
  selector: 'app-admin-filter-delete',
  templateUrl: './admin-filter-delete.component.html',
  styleUrl: './admin-filter-delete.component.css'
})
export class AdminFilterDeleteComponent {

  @ViewChild('afd') dialog!: ElementRef;
  filterId!: string;
  filterIndex!: number;
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();

  constructor(private filterService: FiltersService) { }

  show(filterId: string, filterIndex: number) {
    this.filterId = filterId;
    this.filterIndex = filterIndex;

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

  delete() {
    this.filterService.deleteFilter(this.filterId, this.filterIndex).then(data => {
      this.refreshList.emit("refresh")
      this.close()
    }).catch((error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }


}
