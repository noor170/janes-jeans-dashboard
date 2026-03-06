package com.janesjeans.api.controller;

import com.janesjeans.api.entity.CashFlowTransaction;
import com.janesjeans.api.service.CashFlowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cash-flow")
@RequiredArgsConstructor
@Tag(name = "Cash Flow", description = "Cash flow and accounting management")
@SecurityRequirement(name = "bearerAuth")
public class CashFlowController {

    private final CashFlowService cashFlowService;

    @Operation(summary = "List all transactions")
    @GetMapping
    public ResponseEntity<List<CashFlowTransaction>> getAllTransactions() {
        return ResponseEntity.ok(cashFlowService.getAllTransactions());
    }

    @Operation(summary = "Get transaction by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CashFlowTransaction> getById(@PathVariable String id) {
        return ResponseEntity.ok(cashFlowService.getById(id));
    }

    @Operation(summary = "Get transactions by type (INCOME or EXPENSE)")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<CashFlowTransaction>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(cashFlowService.getByType(type));
    }

    @Operation(summary = "Get transactions within date range")
    @GetMapping("/range")
    public ResponseEntity<List<CashFlowTransaction>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(cashFlowService.getByDateRange(from, to));
    }

    @Operation(summary = "Create a transaction")
    @PostMapping
    public ResponseEntity<CashFlowTransaction> create(@RequestBody CashFlowTransaction transaction) {
        return ResponseEntity.status(201).body(cashFlowService.create(transaction));
    }

    @Operation(summary = "Update a transaction")
    @PutMapping("/{id}")
    public ResponseEntity<CashFlowTransaction> update(@PathVariable String id, @RequestBody CashFlowTransaction transaction) {
        return ResponseEntity.ok(cashFlowService.update(id, transaction));
    }

    @Operation(summary = "Delete a transaction")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        cashFlowService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get cash flow summary (total income, expense, net)")
    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getSummary() {
        return ResponseEntity.ok(cashFlowService.getSummary());
    }

    @Operation(summary = "Get cash flow summary for date range")
    @GetMapping("/summary/range")
    public ResponseEntity<Map<String, BigDecimal>> getSummaryByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(cashFlowService.getSummaryByDateRange(from, to));
    }
}
