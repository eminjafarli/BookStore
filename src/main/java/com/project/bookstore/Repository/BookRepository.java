package com.project.bookstore.Repository;

import com.project.bookstore.Entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByUserId(Long bookId);
    @Query("SELECT u FROM Book u ORDER BY u.id DESC")
    List<Book> findAllOrderByIdAsc();

    @Modifying
    @Transactional
    @Query(value = "UPDATE books SET id = :newId WHERE id = :oldId", nativeQuery = true)
    void updateBookId(long oldId, long newId);

}