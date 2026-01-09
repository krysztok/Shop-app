package com.example.shop_backend.accounts;

import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.data.annotation.PersistenceCreator;

public class ClientData {
    private int idC;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private Address address;
    private boolean active;

    @JsonCreator
    @PersistenceCreator
    public ClientData(int idC, String name, String surname, String email, String phoneNumber, Address address, Boolean active) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty!");
        }
        else if (name.length() > 15) {
            throw new IllegalArgumentException("Name is too long!");
        }
        else if (!name.matches("^[a-zA-Z]+$")){
            throw new IllegalArgumentException("Name contains illegal characters!");
        }

        if (surname == null || surname.isEmpty()) {
            throw new IllegalArgumentException("Surname cannot be empty!");
        }
        else if (surname.length() > 40) {
            throw new IllegalArgumentException("Surname is too long!");
        }
        else if (!surname.matches("^[a-zA-Z \\-]+$")){
            throw new IllegalArgumentException("Surname contains illegal characters!");
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

        this.idC = idC;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.active = active;
    }
    

    public ClientData(UserDB userDB) {
        Address address = new Address(userDB.getCity(), userDB.getStreet(), userDB.getNumber());

        this.idC = userDB.getId();
        this.name = userDB.getName();
        this.surname = userDB.getSurname();
        this.email = userDB.getEmail();
        this.phoneNumber = userDB.getPhoneNumber();
        this.address = address;
        this.active = userDB.isActive();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
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

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public int getIdC() {
        return idC;
    }

    public void setIdC(int idC) {
        this.idC = idC;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
