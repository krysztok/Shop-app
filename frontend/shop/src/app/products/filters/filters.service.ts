import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customFilters } from './customFilter';
import { Filters } from './filters';
import { FilterCreateDTO } from '../../admin-panel/admin-filter/admin-filter-add/filterCreateDTO';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor(private http: HttpClient) { }

  async getFiltersByCategoryLabel(categoryLabel: string) {
    const data = await this.http.get<customFilters[]>('http://localhost:8080/filters/p/getFiltersByCategoryLabel/' + categoryLabel).toPromise();
    return data;
  }

  async getAllFilters() {
    const data = await this.http.get<Filters[]>('http://localhost:8080/filters/a/getAllFilters').toPromise();
    return data;
  }

  async createFilter(cFilterDTO: FilterCreateDTO) {
    /*let res = this.http.post('http://localhost:8080/createFilter', cFilterDTO, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.post('http://localhost:8080/filters/a/createFilter', cFilterDTO, { observe: 'response' }).toPromise();
    return res;
  }

  async deleteFilter(id: string, index: number) {
    /*let res = this.http.delete('http://localhost:8080/deleteFilter/' + id + '/' + index, { observe: 'response' }).subscribe((data) => {
      console.log(data.status)
      console.log(data.body)
    }, (error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
    })*/

    let res = this.http.delete('http://localhost:8080/filters/a/deleteFilter/' + id + '/' + index, { observe: 'response' }).toPromise();
    return res;
  }


}
