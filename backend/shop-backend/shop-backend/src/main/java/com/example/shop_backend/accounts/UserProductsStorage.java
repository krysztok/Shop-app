package com.example.shop_backend.accounts;

import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "UserProductsStorage")
public class UserProductsStorage {
    @Id
    @Indexed(unique=true)
    String _id;
    int userId;
    CartDTO cart;
    String[] wishList;

    @JsonCreator
    @PersistenceCreator
    public UserProductsStorage(String[] wishList, CartDTO cart, int userId, String _id) {
        this.wishList = wishList;
        this.cart = cart;
        this.userId = userId;
        this._id = _id;
    }

    public UserProductsStorage(int userId) {
        this.userId = userId;
        this.cart = new CartDTO(new String[0], new int[0]);
        this.wishList = new String[0];
    }

    public String[] getWishList() {
        return wishList;
    }

    public void setWishList(String[] wishList) {
        this.wishList = wishList;
    }

    public CartDTO getCart() {
        return cart;
    }

    public void setCart(CartDTO cart) {
        this.cart = cart;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String get_id() {
        return _id;
    }
}
