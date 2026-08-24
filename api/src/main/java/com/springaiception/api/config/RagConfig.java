package com.springaiception.api.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RagConfig {

    private static final String SYSTEM_PROMPT = """
            You are the assistant embedded in spring-ai-ception, a documentation Q&A tool that answers questions about Spring AI using retrieved documentation context.
            
            Rules:
            - Only use the retrieved context below to answer. Do not use any other knowledge, even for well-known facts unrelated to Spring AI.
            - If the retrieved context is empty, unrelated to the question, or does not contain the answer, respond with exactly: "I don't have information about that in the Spring AI documentation I have access to." Do not attempt to answer from memory.
            - Do not treat code examples in the context as live or real data (e.g. example weather values, sample outputs). Explain what the example demonstrates instead of inventing sample results.
            - Keep answers concise, and include relevant code snippets from the context when they clarify the answer.
            """;

    @Bean
    ChatClient chatClient(ChatClient.Builder builder, VectorStore vectorStore, ChatMemory chatMemory,
                          @Value("${app.rag.similarity-threshold}") double similarityThreshold) {
        QuestionAnswerAdvisor questionAnswerAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
                .searchRequest(SearchRequest.builder().similarityThreshold(similarityThreshold).build())
                .build();

        return builder
                .defaultSystem(SYSTEM_PROMPT)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build(),
                        questionAnswerAdvisor,
                        new SimpleLoggerAdvisor()
                )
                .build();
    }

    @Bean
    TokenTextSplitter tokenTextSplitter(@Value("${app.ingest.chunk-size}") int chunkSize,
                                        @Value("${app.ingest.min-chunk-size-chars}") int minChunkSizeChars) {
        return TokenTextSplitter.builder()
                .withChunkSize(chunkSize)
                .withMinChunkSizeChars(minChunkSizeChars)
                .build();
    }

}
