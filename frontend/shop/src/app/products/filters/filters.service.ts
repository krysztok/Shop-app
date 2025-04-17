import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customFilters } from './customFilter';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor(private http: HttpClient) { }

      async getFiltersByCategoryLabel(categoryLabel: string) {
        const data = await this.http.get<customFilters[]>('http://localhost:8080/getFiltersByCategoryLabel/' + categoryLabel).toPromise();
        return data;
      }
}
