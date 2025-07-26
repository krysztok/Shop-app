import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { FilterData } from '../filterData';

@Component({
  selector: 'app-admin-filter-view',
  templateUrl: './admin-filter-view.component.html',
  styleUrl: './admin-filter-view.component.css'
})
export class AdminFilterViewComponent {

  @ViewChild('afv') dialog!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  filter!: FilterData
  categoryName: string = ""

  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor() { }

  show(filter: FilterData, categoryName: string) {
    this.filter = filter;
    this.categoryName = categoryName;

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

}
