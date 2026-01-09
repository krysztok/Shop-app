package com.example.shop_backend.accounts;

public class ClientCreateDTO {
    ClientData clientData;
    String password;

    public ClientCreateDTO(ClientData clientData, String password) {
        this.clientData = clientData;
        this.password = password;
    }

    public ClientData getClientData() {
        return clientData;
    }

    public void setClientData(ClientData clientData) {
        this.clientData = clientData;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
