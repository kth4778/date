package com.example.backend.service;

import com.example.backend.model.DateSelection;
import com.example.backend.repository.DateSelectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DateSelectionService {

    private static final Logger logger = LoggerFactory.getLogger(DateSelectionService.class);

    @Autowired
    private DateSelectionRepository repository;

    public List<DateSelection> getAllSelections() {
        return repository.findAllByOrderBySelectedDateAsc();
    }

    @Transactional // 추가된 부분
    public void saveSelection(String username, String date) {
        // 특정 날짜에 해당 username이 이미 존재하는지 확인
        if (repository.existsByUsernameAndSelectedDate(username, date)) {
            throw new IllegalArgumentException("Username '" + username + "' already exists for date '" + date + "'.");
        }
        DateSelection selection = new DateSelection();
        selection.setUsername(username);
        selection.setSelectedDate(date);
        repository.save(selection);
    }

    @Transactional // 추가된 부분
    public void deleteSelectionsByUsername(String username) {
//        logger.info("Deleting all selections for username: {}", username);
        repository.deleteByUsername(username);
    }

    @Transactional
    public void deleteSelectionByUsernameAndDate(String username, String date) {
//        logger.info("Attempting to delete selection for username: {} and date: {}", username, date);
        repository.deleteByUsernameAndSelectedDate(username, date);
//        logger.info("Deletion attempt completed for username: {} and date: {}", username, date);
    }

    public List<String> getAllUsernames() {
        return repository.findAll().stream()
                .map(DateSelection::getUsername)
                .distinct()
                .collect(Collectors.toList());
    }
}
