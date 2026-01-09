package com.example.shop_backend.accounts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("clients/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ClientsController {

    private final ClientsServiceI clientsService;

    @Autowired
    public ClientsController (ClientsServiceI clientsService) {
        this.clientsService = clientsService;
    }

    @GetMapping("/a/getAllClients")
    public List<ClientData> getAllClients(){
        return clientsService.getAllClients();
    }

    @GetMapping("/a/getClient/{id}")
    public ClientData getClient(@PathVariable int id){
        return clientsService.getClient(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/p/createClient")
    @ResponseBody
    public void createClient(@RequestBody ClientCreateDTO userCreate) {
        clientsService.createClient(userCreate);
    }

    @GetMapping("/c/getMyData")
    public ClientData getMyData(Authentication authentication){
        return clientsService.getClientByEmail(authentication.getName());
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/c/updateMyData")
    @ResponseBody
    public void updateClientData(@RequestBody ClientUpdateDTO clientData, Authentication authentication) {
        clientsService.updateClientData(authentication.getName(),clientData);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/c/updateMyAddress")
    @ResponseBody
    public void updateClientAddress(@RequestBody Address address, Authentication authentication) {
        clientsService.updateClientAddress(authentication.getName(), address);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/c/changeMyPassword")
    @ResponseBody
    public void changePassword(@RequestBody ChangePasswordDTO changePasswordDTO, Authentication authentication){
        clientsService.changePassword(authentication.getName(), changePasswordDTO);
    }

    @GetMapping("/c/getMyCart")
    public CartDTO getMyCart(Authentication authentication){
        return clientsService.getCartByClientEmail(authentication.getName());
    }

    @GetMapping("/c/getMyWishList")
    public String[] getMyWishList(Authentication authentication){
        return clientsService.getWishListByClientEmail(authentication.getName());
    }

    @PutMapping("/c/saveMyCart")
    @ResponseBody
    public void saveMyCart(@RequestBody CartDTO cartDTO, Authentication authentication) {
        clientsService.saveClientCart(authentication.getName(),cartDTO);
    }

    @PutMapping("/c/saveMyWishList")
    @ResponseBody
    public void saveMyWishList(@RequestBody String[] wishList, Authentication authentication) {
        clientsService.saveClientWishList(authentication.getName(),wishList);
    }

    @DeleteMapping("/a/deleteClient/{id}")
    public void deleteClient(@PathVariable int id) {
        clientsService.deleteClient(id);
    }

    @DeleteMapping("/a/deactivateClient/{id}")
    public void deactivateClient(@PathVariable int id) {
        clientsService.deactivateClient(id);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/a/activateClient/{id}")
    public void activateClient(@PathVariable int id){
        clientsService.activateClient(id);
    }

}
