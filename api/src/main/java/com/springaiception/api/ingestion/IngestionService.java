package com.springaiception.api.ingestion;

import com.springaiception.api.dto.IngestResponse;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Orchestrates ingestion: read docs.jsonl, chunk, embed, and replace the vector store
 * contents. Each call is a whole-table replace so re-ingesting after re-scraping or
 * tuning chunk size never accumulates duplicates.
 */
@Service
public class IngestionService {

    private final DocsJsonlReader docsJsonlReader;

    private final TokenTextSplitter tokenTextSplitter;

    private final VectorStore vectorStore;

    private final JdbcTemplate jdbcTemplate;

    private final String tableName;

    public IngestionService(DocsJsonlReader docsJsonlReader, TokenTextSplitter tokenTextSplitter,
                            VectorStore vectorStore, JdbcTemplate jdbcTemplate,
                            @Value("${spring.ai.vectorstore.pgvector.table-name:vector_store}") String tableName) {
        this.docsJsonlReader = docsJsonlReader;
        this.tokenTextSplitter = tokenTextSplitter;
        this.vectorStore = vectorStore;
        this.jdbcTemplate = jdbcTemplate;
        this.tableName = tableName;
    }

    public IngestResponse ingest() {
        long start = System.currentTimeMillis();

        List<Document> sourceDocuments = this.docsJsonlReader.readDocuments();
        List<Document> chunks = this.tokenTextSplitter.split(sourceDocuments);

        this.jdbcTemplate.update("DELETE FROM " + this.tableName);
        this.vectorStore.add(chunks);

        long durationMs = System.currentTimeMillis() - start;
        return new IngestResponse(sourceDocuments.size(), chunks.size(), durationMs);
    }

}
