package com.springaiception.api.chat;

import com.springaiception.api.dto.ChatRequest;
import com.springaiception.api.dto.ChatResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public ChatResponse chat(ChatRequest request) {
        String reply = this.chatClient.prompt()
                .user(request.message())
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, request.conversationId()))
                .call()
                .content();

        return new ChatResponse(request.conversationId(), reply);
    }

}
