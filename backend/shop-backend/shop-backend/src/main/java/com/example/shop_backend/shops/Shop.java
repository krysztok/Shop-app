package com.example.shop_backend.shops;

import com.example.shop_backend.Address;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Shops")
public class Shop {

    @Id
    @Indexed(unique=true)
    private String _id;
    private String name;
    private Address address;
    private Coords coords;
    private String email;
    private String phoneNumber;
    private ShopHours[] shopHours;
    private boolean active;

    public Shop(String name, Address address, Coords coords, String email, String phoneNumber, ShopHours[] shopHours) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty!");
        }
        else if (name.length() > 40) {
            throw new IllegalArgumentException("Name is too long!");
        }
        else if (!name.matches("^[0-9a-zA-Z ]+$")){
            throw new IllegalArgumentException("Name contains illegal characters!");
        }

        String emailRegexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"; //https://www.baeldung.com/java-email-validation-regex

        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty!");
        }
        else if (email.length() > 60) {
            throw new IllegalArgumentException("Email is too long!");
        }
        else if (!email.matches(emailRegexPattern)){
            throw new IllegalArgumentException("Email contains illegal characters!");
        }

        if (phoneNumber == null || phoneNumber.isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty!");
        }
        else if (phoneNumber.length() > 40) {
            throw new IllegalArgumentException("Phone number is too long!");
        }
        else if (!phoneNumber.matches("^(\\+)?[0-9 \\-]+$")){
            throw new IllegalArgumentException("Phone number contains illegal characters!");
        }

        this.name = name;
        this.address = address;
        this.coords = coords;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.shopHours = shopHours;
        this.active = true;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Coords getCoords() {
        return coords;
    }

    public void setCoords(Coords coords) {
        this.coords = coords;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public ShopHours[] getShopHours() {
        return shopHours;
    }

    public void setShopHours(ShopHours[] shopHours) {
        this.shopHours = shopHours;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isActive() {
        return active;
    }
}
