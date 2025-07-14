package com.project.bookstore.Services;

import com.project.bookstore.Entity.Comment;
import com.project.bookstore.Repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public List<Comment> getCommentsByBookId(Long bookId) {
        return commentRepository.findByBookId(bookId);
    }

    public Comment saveComment(Comment comment) {
        comment.setPostedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }
}