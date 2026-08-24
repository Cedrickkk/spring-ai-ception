package com.springaiception.api.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.UncheckedIOException;
import java.nio.file.NoSuchFileException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UncheckedIOException.class)
    ProblemDetail handleIoFailure(UncheckedIOException ex) {
        HttpStatus status = ex.getCause() instanceof NoSuchFileException ? HttpStatus.NOT_FOUND
                : HttpStatus.BAD_GATEWAY;
        return ProblemDetail.forStatusAndDetail(status, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail handleUnexpected(Exception ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

}
