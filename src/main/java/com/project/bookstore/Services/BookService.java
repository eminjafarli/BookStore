package com.project.bookstore.Services;

import com.project.bookstore.Entity.Book;
import com.project.bookstore.Repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<Book> getBooksByUserId(Long userId) {
        return bookRepository.findByUserId(userId);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBook(Long bookId) {
        bookRepository.deleteById(bookId);
    }
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