import { ClientData } from "../clientData";

export interface ClientCreateDTO { 
    clientData: ClientData;
    password: string;
}