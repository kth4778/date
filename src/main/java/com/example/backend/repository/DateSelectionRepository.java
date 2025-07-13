package com.example.backend.repository;

import com.example.backend.model.DateSelection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DateSelectionRepository extends JpaRepository<DateSelection, Long> {
    List<DateSelection> findAllByOrderBySelectedDateAsc();
    boolean existsByUsernameAndSelectedDate(String username, String selectedDate);
    void deleteByUsername(String username);
    void deleteByUsernameAndSelectedDate(String username, String selectedDate);
}
