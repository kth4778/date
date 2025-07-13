package com.example.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class SelectionRequest {
    private String username;
    private List<String> dates;
}
