import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shop } from './shop';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor(private http: HttpClient) { }

  async getShops() {
    const data = await this.http.get<Shop[]>('http://localhost:8080/shops/p/getShops').toPromise();
    return data;
  }

  async createShop(shop: Shop) {
    console.log(shop)

    let res = this.http.post('http://localhost:8080/shops/a/createShop', shop, { observe: 'response' }).toPromise();
    return res;
  }

  async editShop(shop: Shop) {
    console.log(shop)

    let res = await this.http.put('http://localhost:8080/shops/a/updateShop', shop, { observe: 'response' }).toPromise();
    return res
  }

  async deactivateShop(id: string) {
    let res = this.http.delete('http://localhost:8080/shops/a/deactivateShop/' + id, { observe: 'response' }).toPromise()
    return res;
  }

  async deleteShop(id: string) {
    let res = this.http.delete('http://localhost:8080/shops/a/deleteShop/' + id, { observe: 'response' }).toPromise()
    return res;
  }

  async activateShop(id: string) {
    let res = this.http.put('http://localhost:8080/shops/a/activateShop/' + id, {}, { observe: 'response' }).toPromise();
    return res;
  }
}
