import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) { }

    async getProductsByCategoryLabel(categoryLabel: string) {
      const data = await this.http.get<Product[]>('http://localhost:8080/getProducts/' + categoryLabel).toPromise();
      data?.forEach((product) => product.params = new Map(Object.entries(product.params)));
      return data;
    }

    async getProductById(productId: string) {
      const data = await this.http.get<Product>('http://localhost:8080/getProduct/' + productId).toPromise();
      return data;
    }

    async getProductByName(productName: string) {
      const data = await this.http.get<Product>('http://localhost:8080/getProductByName/' + productName).toPromise();
      return data;
    }

}
