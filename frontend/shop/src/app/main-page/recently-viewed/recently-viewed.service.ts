import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../../products/product';
import { ProductsService } from '../../products/products.service';

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  lastSeenListIds: string[] = []; //in reverse order
  lastSeenListSubject = new Subject<string[]>;

  constructor(private productsService: ProductsService) {
    this.getFromLocalStorage();
    this.lastSeenListSubject.next(this.lastSeenListIds);
  }


  addToLastSeen(productId: string) {
    let limit: number = 20; //limit 20 products
    for (let i = 0; i < this.lastSeenListIds.length; i++) {
      if (this.lastSeenListIds[i] == productId) {
        this.lastSeenListIds.splice(i, 1);
        break;
      }
    }

    if (this.lastSeenListIds.length >= limit) {
      this.lastSeenListIds.splice(0, 1);
    }

    this.lastSeenListIds.push(productId);
    this.addToLocalStorage();
    this.lastSeenListSubject.next(this.lastSeenListIds);
  }

  addToLocalStorage() {
    localStorage.setItem("lastSeenListIds", JSON.stringify(this.lastSeenListIds));
  }

  getFromLocalStorage() {
    let p = JSON.parse(localStorage.getItem('lastSeenListIds')!)
    if (p != null) {
      this.lastSeenListIds = p;
    }
  }

  async getProducts() {
    const data = await this.productsService.getProductsByIds(this.lastSeenListIds);
    return data;
  }

  getProductsIds(){
    return this.lastSeenListIds;
  }

}
