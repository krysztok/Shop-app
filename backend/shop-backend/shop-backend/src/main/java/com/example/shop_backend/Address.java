package com.example.shop_backend;

import java.util.Objects;

public class Address {
    private String city;
    private String street;
    private String number;

    public Address(String city, String street, String number) {
        if (city == null || city.isEmpty()) {
            throw new IllegalArgumentException("City cannot be empty!");
        }
        else if (city.length() > 40) {
            throw new IllegalArgumentException("City is too long!");
        }
        else if (!city.matches("^[a-zA-Z \\-]+$")){
            throw new IllegalArgumentException("City contains illegal characters!");
        }

        if (street == null || street.isEmpty()) {
            throw new IllegalArgumentException("Street cannot be empty!");
        }
        else if (street.length() > 60) {
            throw new IllegalArgumentException("Street is too long!");
        }
        else if (!street.matches("^[a-zA-Z \\-]+$")){
            throw new IllegalArgumentException("Street contains illegal characters!");
        }

        if (number == null || number.isEmpty()) {
            throw new IllegalArgumentException("Number cannot be empty!");
        }
        else if (number.length() > 10) {
            throw new IllegalArgumentException("Number is too long!");
        }
        else if (!number.matches("^[0-9a-zA-Z \\-\\\\/]+$")){
            throw new IllegalArgumentException("Number contains illegal characters!");
        }

        this.city = city;
        this.street = street;
        this.number = number;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (obj.getClass() != this.getClass()) {
            return false;
        }

        final Address other = (Address) obj;

        if (!Objects.equals(this.city, other.getCity())) {
            return false;
        }

        if (!Objects.equals(this.street, other.getStreet())) {
            return false;
        }

        if (!Objects.equals(this.number, other.getNumber())) {
            return false;
        }

        return true;
    }

}
