import { Address } from "../account/address";
import { Coords } from "./coords";
import { ShopHours } from "./shopHours";

export interface Shop {
    _id: string;
    name: string;
    address: Address;
    coords: Coords;
    email: string;
    phoneNumber: string;
    shopHours: ShopHours[];
}