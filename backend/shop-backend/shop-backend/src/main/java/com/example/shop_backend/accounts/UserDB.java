package com.example.shop_backend.accounts;
import com.example.shop_backend.auth.Roles;
import jakarta.persistence.*;

@Entity
@Table(name = "Users")
public class UserDB {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String password;
    private String role;
    private String name;
    private String surname;
    @Column(name = "phonenumber")
    private String phoneNumber;
    private String city;
    private String street;
    private String number;
    private boolean active;

    public UserDB(){

    }

    public UserDB(String password, String email, String name, String phoneNumber, String city, String street, String number, String surname) {
        this.password = password;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.city = city;
        this.street = street;
        this.number = number;
        this.surname = surname;
        this.active = true;
    }

    public UserDB(ClientCreateDTO clientCreateDTO) {
        this.password = clientCreateDTO.getPassword();
        ClientData clientData = clientCreateDTO.getClientData();
        this.email = clientData.getEmail();
        this.name = clientData.getName();
        this.surname = clientData.getSurname();
        this.phoneNumber = clientData.getPhoneNumber();
        Address address = clientData.getAddress();
        this.city = address.getCity();
        this.street = address.getStreet();
        this.number = address.getNumber();
        this.active = true;
        this.role = Roles.CLIENT;
    }

    public void setAddress(Address address) {
        this.city = address.getCity();
        this.street = address.getStreet();
        this.number = address.getNumber();
    }

    public void updateClientData(ClientUpdateDTO clientUpdateDTO) {
        this.email = clientUpdateDTO.getEmail();
        this.name = clientUpdateDTO.getName();
        this.surname = clientUpdateDTO.getSurname();
        this.phoneNumber = clientUpdateDTO.getPhoneNumber();
    }

    public int getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getRole() {
        return role;
    }
}
