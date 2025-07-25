package com.project.bookstore.Repository;

import com.project.bookstore.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u ORDER BY u.id DESC")
    List<User> findAllOrderByIdAsc();

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET id = :newId WHERE id = :oldId", nativeQuery = true)
    void updateUserId(long oldId, long newId);

}
