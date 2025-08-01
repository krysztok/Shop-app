import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { Category } from './category';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  categories: MegaMenuItem[] = []

  async getAllCategories() {
    const data = await this.http.get<Category[]>('http://localhost:8080/getAllCategories').toPromise();
    return data
  }


  //rename?
  async getCategories() {
    if (this.categories.length == 0) {
      const data = await this.http.get<JSON>('http://localhost:8080/getAllCategoriesJson').toPromise();
      const categoriesJson: any[] = Array.of(data);
      categoriesJson[0].forEach((a: any) => this.categories.push(a))
    }

    return this.categories
  }

  async getSubCategories(categoryId: string) {
    let para = new HttpParams().set('categoryId', categoryId);
    const data = await this.http.get<Category[]>('http://localhost:8080/getSubcategories/', { params: para }).toPromise();
    return data;
  }

  async getCategoryById(categoryId: string) {
    const data = await this.http.get<Category>('http://localhost:8080/getCategory/' + categoryId).toPromise();
    return data
  }

  async getCategoryByLabel(label: string) {
    const data = await this.http.get<Category>('http://localhost:8080/getCategoryByLabel/' + label).toPromise();
    return data
  }

  async createCategory(label: string, type: string, parentId: string) {
    let category: Category = {
      label: label == null ? "" : label,
      type: type == null ? "" : type,
      parentId: parentId,
      _id: '',
      routerLink: '',
      items: []
    }
    console.log(category)

    let a = this.http.post('http://localhost:8080/createCategory', category, { observe: 'response' }).subscribe((data) => {
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
