package com.project.bookstore.Services;

import com.project.bookstore.Entity.User;
import com.project.bookstore.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setSurname(updatedUser.getSurname());
                    user.setUsername(updatedUser.getUsername());
                    user.setRole(updatedUser.getRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public User addUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists.");
        }
        return userRepository.save(user);
    }
}
