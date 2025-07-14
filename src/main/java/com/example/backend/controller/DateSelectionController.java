package com.example.backend.controller;

import com.example.backend.dto.SelectionRequest;
import com.example.backend.model.DateSelection;
import com.example.backend.service.DateSelectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")


public class DateSelectionController {

    @Autowired
    private DateSelectionService service;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/selections")
    public List<DateSelection> getAllSelections() {
        return service.getAllSelections();
    }

    @PostMapping("/selections")
    public ResponseEntity<?> saveSelections(@RequestBody SelectionRequest request) {
        try {
            request.getDates().forEach(date -> {
                service.saveSelection(request.getUsername(), date);
            });
            // Notify all clients via WebSocket
            messagingTemplate.convertAndSend("/topic/selections", service.getAllSelections());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/usernames")
    public List<String> getAllUsernames() {
        return service.getAllUsernames();
    }

    @DeleteMapping("/selections/{username}")
    public ResponseEntity<?> deleteSelectionsByUsername(@PathVariable String username) {
        service.deleteSelectionsByUsername(username);
        messagingTemplate.convertAndSend("/topic/selections", service.getAllSelections());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/selections/{username}/{dateString}")
    public ResponseEntity<?> deleteSelectionByUsernameAndDate(@PathVariable String username, @PathVariable String dateString) {
        service.deleteSelectionByUsernameAndDate(username, dateString);
        messagingTemplate.convertAndSend("/topic/selections", service.getAllSelections());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    public String healthCheck() {
        System.out.println("Health check endpoint accessed!");
        return "OK";
    }
}
