import { Address } from "./address";

export interface ClientData {
    idC: number;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    address: Address;
    active: boolean;
}