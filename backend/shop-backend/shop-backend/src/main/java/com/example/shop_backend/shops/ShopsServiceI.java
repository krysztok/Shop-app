package com.example.shop_backend.shops;

import java.util.List;

public interface ShopsServiceI {
    Shop getShopById(String id);
    List<Shop> getShops();
    void createShop(Shop shop);
    void updateShop(Shop shop);
    void deactivateShop(String id);
    void deleteShop(String id);
    void activateShop(String id);
}
