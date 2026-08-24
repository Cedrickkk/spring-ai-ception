package com.springaiception.api.web;

import com.springaiception.api.dto.IngestResponse;
import com.springaiception.api.ingestion.IngestionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final IngestionService ingestionService;

    public AdminController(IngestionService ingestionService) {
        this.ingestionService = ingestionService;
    }

    @PostMapping("/ingest")
    public IngestResponse ingest() {
        return this.ingestionService.ingest();
    }

}
