import { OrderStatus } from "./orderStatus";

export interface StatusHistory {
    status: OrderStatus;
    date: Date;
}