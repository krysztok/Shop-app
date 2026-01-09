package com.example.shop_backend.accounts;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends CrudRepository<UserDB, Long> {

    List<UserDB> findAllByRole(String role);
    UserDB findByIdAndRole(Long id, String role);
    UserDB findByEmail(String email);
    UserDB findByPhoneNumber(String phoneNumber);

}
