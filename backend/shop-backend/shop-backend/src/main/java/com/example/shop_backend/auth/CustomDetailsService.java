package com.example.shop_backend.auth;

import com.example.shop_backend.accounts.UserDB;
import com.example.shop_backend.accounts.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomDetailsService implements UserDetailsService {
    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDB user = usersRepository.findByEmail(username);
        if (user==null){
            throw new UsernameNotFoundException("User with name '"+username+"' not found!");
        }

        return toUser(user);
    }

    private UserDetails toUser(UserDB userDB) {
        return User
                .withUsername(userDB.getEmail())
                .password(userDB.getPassword())
                .roles(userDB.getRole()).build();
    }
}
