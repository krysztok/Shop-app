package com.example.shop_backend.accounts;

import java.util.List;

public interface ClientsServiceI {
    List<ClientData> getAllClients();
    ClientData getClient(int id);
    ClientData getClientByEmail(String email);
    UserDB getClientDB(int id);
    CartDTO getCartByClientEmail(String email);
    String[] getWishListByClientEmail(String email);
    void createClient(ClientCreateDTO ClientCreateDTO);
    void changePassword(String email, ChangePasswordDTO changePasswordDTO);
    void updateClientData(String email, ClientUpdateDTO clientData);
    void updateClientAddress(String email,Address address);
    void deleteClient(int id);
    void deactivateClient(int id);
    void activateClient(int id);
    boolean checkPassword(String password);
    void saveClientCart(String email,CartDTO cartDTO);
    void saveClientWishList(String email,String[] wishList);
}
