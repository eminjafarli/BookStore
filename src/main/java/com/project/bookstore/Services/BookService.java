package com.project.bookstore.Services;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.bookstore.Entity.Book;
import com.project.bookstore.Entity.User;
import com.project.bookstore.Repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<Book> getAllBooks() {
        return bookRepository.findAllOrderByIdAsc();
    }

    public List<Book> getBooksByUserId(Long userId) {
        return bookRepository.findByUserId(userId);
    }
    public Book saveBook(Book book) {
        book.setUploadDate(LocalDateTime.now().withSecond(0).withNano(0));
        return bookRepository.save(book);
    }
// i just noticed that i dont need clean id for books for now
    @Transactional
    public void deleteBook(Long bookId) {
        bookRepository.deleteById(bookId);
//        reindexBookIds();
    }

//    @Transactional
//    public void reindexBookIds() {
//        List<Book> books = bookRepository.findAllOrderByIdAsc();
//        long newId = 2;
//        for (Book book : books) {
//            if (book.getId() != newId) {
//                bookRepository.updateBookId(book.getId(), newId);
//            }
//            newId++;
//
//        }
//        resetSequence();
//    }
//    private void resetSequence() {
//        String sql = "SELECT setval(pg_get_serial_sequence('books', 'id'), COALESCE((SELECT MAX(id) FROM books), 1), true)";
//        jdbcTemplate.execute(sql);
//    }
    public Book updateBook(Long bookId, String title, MultipartFile file) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (title != null && !title.isBlank()) {
            book.setTitle(title);
        }

        if (file != null && !file.isEmpty()) {
            try {
                String folderPath = "C:\\Users\\ASUS\\Desktop\\uploaded_books\\";
                Path folder = Paths.get(folderPath);
                if (!Files.exists(folder)) {
                    Files.createDirectories(folder);
                }

                String fileName = file.getOriginalFilename();
                Path filePath = folder.resolve(fileName);
                Files.write(filePath, file.getBytes());
                book.setFilename(filePath.toString());

            } catch (IOException e) {
                throw new RuntimeException("Failed to save file", e);
            }
        }

        return bookRepository.save(book);
    }

}