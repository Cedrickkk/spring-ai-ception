package com.springaiception.api.web;

import com.springaiception.api.chat.ChatService;
import com.springaiception.api.dto.ChatRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(value = "/chat", produces = "text/plain;charset=UTF-8")
    public Flux<String> chat(@Valid @RequestBody ChatRequest request) {
        return this.chatService.chatStream(request);
    }

}
