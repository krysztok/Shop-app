import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientData } from './clientData';
import { ClientCreateDTO } from './register/clientCreateDTO';
import { ClientUpdateDTO } from './change-data/clientUpdateDTO';
import { Address } from './address';
import { ChangePasswordDTO } from './change-password/changePasswordDTO';
import { cartDTO } from '../cart/cartDTO';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  authenticated = false; //?? wywalić??

  constructor(private http: HttpClient) {
  }

  async getClient(id: number) {
    const data = await this.http.get<ClientData>('http://localhost:8080/clients/a/getClient/' + id).toPromise();
    return data;
  }

  async getMyData() {
    const data = await this.http.get<ClientData>('http://localhost:8080/clients/c/getMyData').toPromise();
    return data;
  }

  async updateMyData(clientData: ClientUpdateDTO) {
    let data = await this.http.put('http://localhost:8080/clients/c/updateMyData', clientData, { observe: 'response' }).toPromise();
    return data;
  }

  async updateMyAddress(address: Address) {
    let data = await this.http.put('http://localhost:8080/clients/c/updateMyAddress', address, { observe: 'response' }).toPromise();
    return data;
  }

  async changeMyPassword(ChangePasswordDTO: ChangePasswordDTO) {
    let data = await this.http.put('http://localhost:8080/clients/c/changeMyPassword', ChangePasswordDTO, { observe: 'response' }).toPromise();
    return data;
  }

  async getAllClients() {
    const data = await this.http.get<ClientData[]>('http://localhost:8080/clients/a/getAllClients').toPromise();
    return data;
  }

  async createClient(client: ClientCreateDTO) {
    let res = this.http.post('http://localhost:8080/clients/p/createClient', client, { observe: 'response' }).toPromise();
    return res;
  }

  async deactivateClient(id: number) {
    let res = this.http.delete('http://localhost:8080/clients/a/deactivateClient/' + id, { observe: 'response' }).toPromise()
    return res;
  }

  async deleteClient(id: number) {
    let res = this.http.delete('http://localhost:8080/clients/a/deleteClient/' + id, { observe: 'response' }).toPromise()
    return res;
  }

  async activateClient(id: number) {
    let res = this.http.put('http://localhost:8080/clients/a/activateClient/' + id, {}, { observe: 'response' }).toPromise();
    return res;
  }

  async getMyCart() {
    const data = await this.http.get<cartDTO>('http://localhost:8080/clients/c/getMyCart').toPromise();
    return data;
  }

  async getMyWishList() {
    const data = await this.http.get<string[]>('http://localhost:8080/clients/c/getMyWishList').toPromise();
    return data;
  }

  async saveMyCart(cart: cartDTO) {
    let data = await this.http.put('http://localhost:8080/clients/c/saveMyCart', cart, { observe: 'response' }).toPromise();
    return data;
  }

  async saveMyWishList(wishList: string[]) {
    let data = await this.http.put('http://localhost:8080/clients/c/saveMyWishList', wishList, { observe: 'response' }).toPromise();
    return data;
  }

}
