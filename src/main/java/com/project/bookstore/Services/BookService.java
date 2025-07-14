package com.project.bookstore.Services;

import com.project.bookstore.Entity.Book;
import com.project.bookstore.Repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}