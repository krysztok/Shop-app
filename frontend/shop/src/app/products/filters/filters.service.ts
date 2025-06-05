import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customFilters } from './customFilter';
import { Filters } from './filters';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor(private http: HttpClient) { }

      async getFiltersByCategoryLabel(categoryLabel: string) {
        const data = await this.http.get<customFilters[]>('http://localhost:8080/getFiltersByCategoryLabel/' + categoryLabel).toPromise();
        return data;
      }

      async getAllFilters(){
                const data = await this.http.get<Filters[]>('http://localhost:8080/getAllFilters').toPromise();
        return data;
      }
}
