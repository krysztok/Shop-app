import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shop } from './shop';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor(private http: HttpClient) { }

  async getShops() {
    const data = await this.http.get<Shop[]>('http://localhost:8080/getShops').toPromise();
    return data;
  }

  async createShop(shop: Shop) {
    console.log(shop)
    
    let res = this.http.post('http://localhost:8080/createShop', shop, { observe: 'response' }).toPromise();
    return res;
  }

  async editShop(shop: Shop) {
    console.log(shop)

    let res = await this.http.put('http://localhost:8080/updateShop', shop, { observe: 'response' }).toPromise();
    return res
  }
}
