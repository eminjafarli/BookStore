package com.project.bookstore.Controller;

import com.project.bookstore.Entity.Book;
import com.project.bookstore.Entity.User;
import com.project.bookstore.Repository.BookRepository;
import com.project.bookstore.Services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final BookRepository bookRepository;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/download/{bookId}")
    public ResponseEntity<Resource> downloadBook(@PathVariable Long bookId) throws IOException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        String filename = book.getFilename();
        Path booksDir = Paths.get("").toAbsolutePath().resolve("books");
        Path filePath = booksDir.resolve(filename).normalize();

        if (!Files.exists(filePath)) {
            throw new NoSuchFileException("File not found: " + filename);
        }

        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Book> uploadBook(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().build();
            }

            Path booksDir = Paths.get("").toAbsolutePath().resolve("books");
            if (!Files.exists(booksDir)) {
                Files.createDirectories(booksDir);
            }

            User user = (User) authentication.getPrincipal();
            Book tempBook = Book.builder()
                    .title(title)
                    .filename("temp")
                    .user(user)
                    .build();

            Book savedBook = bookService.saveBook(tempBook);

            String cleanTitle = title.replaceAll("[^a-zA-Z0-9]", "");
            String newFilename = cleanTitle + savedBook.getId() + ".pdf";

            Path filePath = booksDir.resolve(newFilename);
            file.transferTo(filePath.toFile());

            savedBook.setFilename(newFilename);
            Book finalBook = bookService.saveBook(savedBook);

            return ResponseEntity.ok(finalBook);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        String cleanTitle = book.getTitle().replaceAll("[^a-zA-Z0-9]", "");
        String filename = cleanTitle + book.getId() + ".pdf";

        Path booksDir = Paths.get("").toAbsolutePath().resolve("books");
        Path filePath = booksDir.resolve(filename);

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        bookService.deleteBook(bookId);

        return ResponseEntity.ok().build();
    }

}
