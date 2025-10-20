import { ClientData } from "../account/clientData";
import { OrderStatus } from "../order-status/orderStatus";
import { StatusHistory } from "../order-status/statusHistory";
import { OrderProductData } from "./orderProductData";
import { OrderTransportData } from "./transport-options/orderTransportData";

export interface Order {
    _id: string;
    clientData: ClientData;
    products: OrderProductData[];
    productsTotalValue: number;
    orderTransportData: OrderTransportData;
    paymentOption: string;
    totalValue: number;
    orderStatus: OrderStatus;
    date: Date | undefined;
    statusHistory: StatusHistory[];
}