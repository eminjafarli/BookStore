package com.project.bookstore.Controller;

import com.project.bookstore.Entity.Book;
import com.project.bookstore.Entity.User;
import com.project.bookstore.Services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long bookId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            Book updated = bookService.updateBook(bookId, title, file);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/user/{userId}")
    public List<Book> getBooksByUser(@PathVariable Long userId) {
        return bookService.getBooksByUserId(userId);
    }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Book> uploadBook(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            String filename = file.getOriginalFilename();
            String uploadDir = "C:\\Users\\ASUS\\Desktop";
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            File destinationFile = new File(uploadDir + File.separator + filename);
            file.transferTo(destinationFile);

            User user = (User) authentication.getPrincipal();

            Book book = Book.builder()
                    .title(title)
                    .filename(filename)
                    .user(user)
                    .build();

            return ResponseEntity.ok(bookService.saveBook(book));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Book> uploadBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.saveBook(book));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long bookId) {
        bookService.deleteBook(bookId);
        return ResponseEntity.ok().build();
    }
}