package com.example.shop_backend.accounts;

import com.example.shop_backend.auth.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientsService implements ClientsServiceI{

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private UserProductsStorageRepository userProductsStorageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<ClientData> getAllClients() {
        List<UserDB> clientsDB = usersRepository.findAllByRole(Roles.CLIENT);
        List<ClientData> clients = new ArrayList<ClientData>();

        clientsDB.forEach(userDB -> {
            clients.add(new ClientData(userDB));
        });

        return clients;
    }

    @Override
    public ClientData getClient(int id) {
        UserDB userDB = getClientDB(id);

        if(userDB != null){
            return new ClientData(userDB);
        } else {
            return null;
        }
    }

    @Override
    public ClientData getClientByEmail(String email) {
        UserDB userDB = usersRepository.findByEmail(email);
        return userDB!= null? new ClientData(userDB) : null;
    }

    @Override
    public UserDB getClientDB(int id) {
        return usersRepository.findByIdAndRole((long) id, Roles.CLIENT);/*.orElse(null);*/
    }

    @Override
    public CartDTO getCartByClientEmail(String email) {
        UserDB userDB = usersRepository.findByEmail(email);

        if(userDB == null) {
            return null;
        }

        UserProductsStorage userStorage = userProductsStorageRepository.findByUserId(userDB.getId());
        return userStorage!= null? userStorage.getCart() : null;
    }

    @Override
    public String[] getWishListByClientEmail(String email) {
        UserDB userDB = usersRepository.findByEmail(email);

        if(userDB == null) {
            return null;
        }

        UserProductsStorage userStorage = userProductsStorageRepository.findByUserId(userDB.getId());
        return userStorage!= null? userStorage.getWishList() : null;
    }

    @Override
    public void createClient(ClientCreateDTO clientCreateDTO) {
        clientCreateDTO.setPassword(passwordEncoder.encode(clientCreateDTO.getPassword()));
        UserDB userDB = new UserDB(clientCreateDTO);

        if (usersRepository.findByEmail(userDB.getEmail())!=null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email: '" + userDB.getEmail() + "' already exists!");
        }

        if (usersRepository.findByPhoneNumber(userDB.getPhoneNumber())!=null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with phone number: '" + userDB.getPhoneNumber() + "' already exists!");
        }

        usersRepository.save(userDB);
    }

    @Override
    public void changePassword(String email, ChangePasswordDTO changePasswordDTO) {
        UserDB userDB = usersRepository.findByEmail(email);

        if (userDB == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email: '" + email + "' does not exist!");
        }

        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), userDB.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Wrong password!");
        }

        userDB.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        usersRepository.save(userDB);
    }

    @Override
    public void updateClientData(String email, ClientUpdateDTO clientData) {
        UserDB userDB = usersRepository.findByEmail(email);

        if (userDB == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email: '" + email + "' does not exist!");
        }

        userDB.updateClientData(clientData);
        usersRepository.save(userDB);
    }

    @Override
    public void updateClientAddress(String email, Address address) {
        UserDB userDB = usersRepository.findByEmail(email);

        if (userDB == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email: '" + email + "' does not exist!");
        }

        userDB.setAddress(address);
        usersRepository.save(userDB);
    }

    @Override
    public void deleteClient(int id) {
        removeClient(id, true);
    }

    @Override
    public void deactivateClient(int id) {
        removeClient(id, false);
    }

    @Override
    public void activateClient(int id) {
        UserDB userDB = getClientDB(id);

        if (userDB == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Client with id: '" + id + "' does not exist!");
        }

        userDB.setActive(true);
        usersRepository.save(userDB);
    }

    public void removeClient(int id, boolean delete) {
        UserDB userDB = getClientDB(id);

        if (userDB == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Client with id: '" + id + "' does not exist!");
        }

        if (delete){
            usersRepository.delete(userDB);
        } else {
            userDB.setActive(false);
            usersRepository.save(userDB);
        }
    }

    @Override
    public boolean checkPassword(String password) {
        return false;
    }

    @Override
    public void saveClientCart(String email, CartDTO cartDTO) {
        UserDB userDB = usersRepository.findByEmail(email);

        if (userDB == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email: '" + email + "' does not exist!");
        }

        UserProductsStorage userStorage = userProductsStorageRepository.findByUserId(userDB.getId());

        if(userStorage == null) {
            userStorage = new UserProductsStorage(userDB.getId());
        }

        userStorage.setCart(cartDTO);
        userProductsStorageRepository.save(userStorage);
    }

    @Override
    public void saveClientWishList(String email, String[] wishList) {
        for (String id : wishList) {
            if (!id.matches("^[0-9a-zA-Z ()']+$")) {
                throw new IllegalArgumentException("Ids contain illegal characters!");
            } else if (id.length() > 25){
                throw new IllegalArgumentException("Ids too long!");
            }
        }

        UserDB userDB = usersRepository.findByEmail(email);

        if (userDB == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email: '" + email + "' does not exist!");
        }

        UserProductsStorage userStorage = userProductsStorageRepository.findByUserId(userDB.getId());

        if(userStorage == null) {
            userStorage = new UserProductsStorage(userDB.getId());
        }

        userStorage.setWishList(wishList);
        userProductsStorageRepository.save(userStorage);
    }
}
