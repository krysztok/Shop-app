import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { Category } from './category';
import { from, Observable } from 'rxjs';
import { CategoryNavDTO } from './categoryNavDTO';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  categories: MegaMenuItem[] = []

  async getAllCategories() {
    const data = await this.http.get<Category[]>('http://localhost:8080/categories/p/getAllCategories').toPromise();
    return data
  }


  //rename?
  async getCategories() {
    if (this.categories.length == 0) {
      const data = await this.http.get<JSON>('http://localhost:8080/categories/p/getAllCategoriesJson').toPromise();
      const categoriesJson: any[] = Array.of(data);
      categoriesJson[0].forEach((a: any) => this.categories.push(a))
    }

    return this.categories
  }

  async getSubCategories(categoryId: string) {
    let para = new HttpParams().set('categoryId', categoryId);
    const data = await this.http.get<Category[]>('http://localhost:8080/categories/p/getSubcategories/', { params: para }).toPromise();
    return data;
  }

  async getSubCategoriesByLabel(label: string) {
    const data = await this.http.get<Category[]>('http://localhost:8080/categories/p/getSubcategoriesByLabel/' + label).toPromise();
    return data;
  }

  async getCategoryNav(label: string) {
    const data = await this.http.get<CategoryNavDTO>('http://localhost:8080/categories/p/getCategoryNav/' + label).toPromise();
    return data
  }


  async getCategoryById(categoryId: string) {
    const data = await this.http.get<Category>('http://localhost:8080/categories/p/getCategory/' + categoryId).toPromise();
    return data
  }

  async getCategoryByLabel(label: string) {
    const data = await this.http.get<Category>('http://localhost:8080/categories/p/getCategoryByLabel/' + label).toPromise();
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

    /*let res = this.http.post('http://localhost:8080/createCategory', category, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.post('http://localhost:8080/categories/a/createCategory', category, { observe: 'response' }).toPromise();
    return res;
  }


  async editCategory(id: string, label: string, type: string, items: string[]) {
    let category: Category = {
      label: label == null ? "" : label,
      type: type == null ? "" : type,
      parentId: '',
      _id: id,
      routerLink: '',
      items: items
    }
    console.log(category)

    /*let res = this.http.put('http://localhost:8080/updateCategory', category, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.put('http://localhost:8080/categories/a/updateCategory', category, { observe: 'response' }).toPromise();
    return res;
  }

  async deleteCategory(id: string) {
    /*let res = this.http.delete('http://localhost:8080/deleteCategory/' + id, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.delete('http://localhost:8080/categories/a/deleteCategory/' + id, { observe: 'response' }).toPromise()
    return res;
  }

  async getCategoriesByIds(categoriesIds: string[]) {
    let params = new HttpParams();
    params = params.append('ids', categoriesIds.join(', '));
    const data = await this.http.get<Category[]>('http://localhost:8080/categories/p/getCategoriesByIds', { params }).toPromise();
    return data;
  }

  async uploadFiles(file: FormData, categoryId: string) {
    const data = await this.http.post("http://localhost:8080/categoriesImages/a/saveImage/" + categoryId, file).toPromise();
    return data;
  }

  async deleteFile(categoryId: string) {
    let res = this.http.delete('http://localhost:8080/categoriesImages/a/deleteImage/' + categoryId, { observe: 'response' }).toPromise()
    return res;
  }

  async getFile(categoryId: string) {
    const data = await this.http.get("http://localhost:8080/categoriesImages/p/getImage/" + categoryId, { responseType: 'blob' }).toPromise();
    return data;
  }

}
