package com.example.shop_backend.shops;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ShopsService implements ShopsServiceI{
    @Autowired
    private ShopsRepository shopsRepository;

    @Override
    public Shop getShopById(String id) {
        return shopsRepository.findById(id).orElse(null);
    }

    @Override
    public List<Shop> getShops(){
        return shopsRepository.findAll();
    }

    @Override
    public void createShop(Shop shop) {
        if (shop.getShopHours().length != 7){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop hours length must be 7!");
        }

        Shop s = new Shop(shop.getName(), shop.getAddress(), shop.getCoords(), shop.getEmail(), shop.getPhoneNumber(), shop.getShopHours());
        shopsRepository.insert(s);
    }

    @Override
    public void updateShop(Shop shop) {
        if (shop.getShopHours().length != 7){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop hours length must be 7!");
        }

        Optional<Shop> dbShop = shopsRepository.findById(shop.get_id());
        if (dbShop.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop with id: '" + shop.get_id() + "' does not exist!");
        }
        Shop shopUpd = dbShop.get();

        if (!Objects.equals(shop.getName(), shopUpd.getName())){
            shopUpd.setName(shop.getName());
        }

        if (!Objects.equals(shop.getEmail(), shopUpd.getEmail())){
            shopUpd.setEmail(shop.getEmail());
        }

        if (!Objects.equals(shop.getPhoneNumber(), shopUpd.getPhoneNumber())){
            shopUpd.setPhoneNumber(shop.getPhoneNumber());
        }

        if (!shop.getAddress().equals(shopUpd.getAddress())){
            shopUpd.setAddress(shop.getAddress());
        }

        if(!shop.getCoords().equals(shopUpd.getCoords())) {
            shopUpd.setCoords(shop.getCoords());
        }

        //hours
        for (int i = 0; i < 7; i++) {
            if(!shop.getShopHours()[i].equals(shopUpd.getShopHours()[i])){
                shopUpd.setShopHours(shop.getShopHours());
                break;
            }
        }

        //update
        shopsRepository.save(shopUpd);
    }

    @Override
    public void deactivateShop(String id) {
        removeShop(id, false);
    }

    @Override
    public void deleteShop(String id) {
        removeShop(id, true);
    }

    public void removeShop(String id, boolean delete) {
        Shop shop = getShopById(id);

        if (shop == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop with id: '" + id + "' does not exist!");
        }

        if (delete){
            shopsRepository.delete(shop);
        } else {
            shop.setActive(false);
            shopsRepository.save(shop);
        }
    }

    @Override
    public void activateShop(String id) {
        Shop shop = getShopById(id);

        if (shop == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop with id: '" + id + "' does not exist!");
        }

        shop.setActive(true);
        shopsRepository.save(shop);
    }
}
