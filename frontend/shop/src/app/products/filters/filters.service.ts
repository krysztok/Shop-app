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
    const data = await this.http.get<customFilters[]>('http://localhost:8080/getFiltersByCategoryLabel/' + categoryLabel).toPromise();
    return data;
  }

  async getAllFilters() {
    const data = await this.http.get<Filters[]>('http://localhost:8080/getAllFilters').toPromise();
    return data;
  }

  async createFilter(cFilterDTO: FilterCreateDTO) {

    let a = this.http.post('http://localhost:8080/createFilter', cFilterDTO, { observe: 'response' }).subscribe((data) => {
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
