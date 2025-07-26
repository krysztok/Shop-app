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

    async getAllProducts(){
      const data = await this.http.get<Product[]>('http://localhost:8080/getAllProducts').toPromise();
      return data;
    }

      async createProduct(name: string, description: string, price: number, categoryId: string, params: Map<string, any>) {
        let product: Product = {
          _id: '',
          name: name == null? "" : name,
          description: description == null? "" : description,
          price: price,
          categoryId: categoryId == null? "" : categoryId,
          active: false,
          ratingValue: 0,
          params: params
        }

        console.log(product)
    
        let a = this.http.post('http://localhost:8080/createProduct', product, { observe: 'response' }).subscribe((data) => {
          console.log(data.status)
          console.log(data.body)
        }, (error) => {
          let message: string = error.error.message;
          message = message.split("problem: ")[1]
          console.log(message)
        })

        return;
      }

}
