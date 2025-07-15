package com.project.bookstore.Controller;

import com.project.bookstore.Entity.Comment;
import com.project.bookstore.Services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/book/{bookId}")
    public List<Comment> getCommentsByBook(@PathVariable Long bookId) {
        return commentService.getCommentsByBookId(bookId);
    }

    @PostMapping
    public ResponseEntity<Comment> postComment(@RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.saveComment(comment));
    }
}