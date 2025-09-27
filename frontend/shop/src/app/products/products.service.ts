import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { Rating } from './rating/rating';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {  }

  async getProductsByCategoryLabel(categoryLabel: string) {
    const data = await this.http.get<Product[]>('http://localhost:8080/getProducts/' + categoryLabel).toPromise();
    data?.forEach((product) => product.params = new Map(Object.entries(product.params)));
    return data;
  }

  async getProductsWithSubCategoriesByCategoryLabel(categoryLabel: string) { //gets products of category and its subcategories
    const data = await this.http.get<Product[]>('http://localhost:8080/getProductsWithSubCategories/' + categoryLabel).toPromise();
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

  async getAllProducts() {
    const data = await this.http.get<Product[]>('http://localhost:8080/getAllProducts').toPromise();
    return data;
  }

  async createProduct(name: string, description: string, price: number, categoryId: string, params: Map<string, any>) {
    let product: Product = {
      _id: '',
      name: name == null ? "" : name,
      description: description == null ? "" : description,
      price: price,
      categoryId: categoryId == null ? "" : categoryId,
      active: false,
      ratingValue: 0,
      params: params,
      ratings: []
    }

    /*
    let res = this.http.post('http://localhost:8080/createProduct', product, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.post('http://localhost:8080/createProduct', product, { observe: 'response' }).toPromise();

    return res;
  }

  async editProduct(name: string, _id: string, description: string, price: number, categoryId: string, params: Map<string, any>) {
    let product: Product = {
      _id: _id,
      name: name == null ? "" : name,
      description: description == null ? "" : description,
      price: price,
      categoryId: categoryId == null ? "" : categoryId,
      active: false,
      ratingValue: 0,
      params: params,
      ratings: []
    }
    /*
        let res = await this.http.put('http://localhost:8080/updateProduct', product, { observe: 'response' }).subscribe((data) => {
          console.log(data.status)
          console.log(data.body)
        }, (error) => {
          let message: string = error.error.message;
          if (message.includes("problem: ")) {
            message = message.split("problem: ")[1]
          }
          console.log(message)
        })*/

    let res = await this.http.put('http://localhost:8080/updateProduct', product, { observe: 'response' }).toPromise();
    return res
  }

  async deactivateProduct(id: string) {
    /*let res = this.http.delete('http://localhost:8080/deactivateProduct/' + id, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.delete('http://localhost:8080/deactivateProduct/' + id, { observe: 'response' }).toPromise()
    return res;
  }

  async deleteProduct(id: string) {
    /*let res = this.http.delete('http://localhost:8080/deleteProduct/' + id, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.delete('http://localhost:8080/deleteProduct/' + id, { observe: 'response' }).toPromise()
    return res;
  }

  async activateProduct(id: string) {
    /*let res = this.http.put('http://localhost:8080/activateProduct/' + id, {}, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.put('http://localhost:8080/activateProduct/' + id, {}, { observe: 'response' }).toPromise();
    return res;
  }

  async rateProduct(productId: string, rating: Rating) {
    let res = this.http.put('http://localhost:8080/rateProduct/' + productId, rating, { observe: 'response' }).toPromise();

    return res;
  }

  async deleteRating(productId: string, commentId: string) {
    let res = this.http.delete('http://localhost:8080/deleteRating/' + productId + '/' + commentId, { observe: 'response' }).toPromise()
    return res;
  }

  async getProductsByIds(productIds: string[]) {
    let params = new HttpParams();
    params = params.append('ids', productIds.join(', '));
    const data = await this.http.get<Product[]>('http://localhost:8080/getProductsByIds', { params }).toPromise();
    return data;
  }

}
