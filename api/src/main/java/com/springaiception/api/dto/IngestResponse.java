package com.springaiception.api.dto;

public record IngestResponse(int sourceDocuments, int chunksIngested, long durationMs) {
}
