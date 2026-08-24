package com.springaiception.api.ingestion;

import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * Reads the scraper's docs.jsonl and maps each line to a Spring AI {@link Document}.
 */
@Component
public class DocsJsonlReader {

    private final Path docsPath;

    private final ObjectMapper objectMapper;

    public DocsJsonlReader(@Value("${app.ingest.docs-path}") String docsPath, ObjectMapper objectMapper) {
        this.docsPath = Path.of(docsPath);
        this.objectMapper = objectMapper;
    }

    public List<Document> readDocuments() {
        List<String> lines;
        try {
            lines = Files.readAllLines(this.docsPath);
        } catch (IOException ex) {
            throw new UncheckedIOException("Failed to read docs.jsonl at " + this.docsPath, ex);
        }

        return lines.stream()
                .filter(line -> !line.isBlank())
                .map(this::toDocument)
                .toList();
    }

    private Document toDocument(String line) {
        DocLine docLine;
        docLine = this.objectMapper.readValue(line, DocLine.class);

        return Document.builder()
                .text(docLine.content())
                .metadata("path", docLine.path())
                .metadata("title", docLine.title() != null ? docLine.title() : "")
                .build();
    }

}
