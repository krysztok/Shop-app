package com.example.shop_backend.shops;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;


@RequestMapping("shops/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ShopsController {
    private final ShopsServiceI shopsService;

    @Autowired
    public ShopsController(ShopsServiceI shopsService) {
        this.shopsService = shopsService;
    }

    @GetMapping("/p/getShops")
    public List<Shop> getShops(){
        return shopsService.getShops();
    }

    @PostMapping("/a/createShop")
    public void createShop(@RequestBody Shop shop) {
        shopsService.createShop(shop);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/a/updateShop")
    @ResponseBody
    public void updateShop(@RequestBody Shop shop) throws IOException {
       shopsService.updateShop(shop);
    }

    @DeleteMapping("/a/deactivateShop/{id}")
    public void deactivateShop(@PathVariable String id) {
        shopsService.deactivateShop(id);
    }

    @DeleteMapping("/a/deleteShop/{id}")
    public void deleteShop(@PathVariable String id) {
        shopsService.deleteShop(id);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/a/activateShop/{id}")
    @ResponseBody
    public void activateShop(@PathVariable String id){
        shopsService.activateShop(id);
    }
}
