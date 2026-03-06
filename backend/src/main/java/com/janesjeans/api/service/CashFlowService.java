package com.janesjeans.api.service;

import com.janesjeans.api.entity.CashFlowTransaction;
import com.janesjeans.api.repository.CashFlowTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CashFlowService {

    private final CashFlowTransactionRepository repository;

    public List<CashFlowTransaction> getAllTransactions() {
        return repository.findAll();
    }

    public CashFlowTransaction getById(String id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public List<CashFlowTransaction> getByType(String type) {
        return repository.findByType(type);
    }

    public List<CashFlowTransaction> getByDateRange(LocalDateTime from, LocalDateTime to) {
        return repository.findByTransactionDateBetween(from, to);
    }

    public CashFlowTransaction create(CashFlowTransaction transaction) {
        return repository.save(transaction);
    }

    public CashFlowTransaction update(String id, CashFlowTransaction updates) {
        CashFlowTransaction tx = getById(id);
        if (updates.getType() != null) tx.setType(updates.getType());
        if (updates.getCategory() != null) tx.setCategory(updates.getCategory());
        if (updates.getAmount() != null) tx.setAmount(updates.getAmount());
        if (updates.getDescription() != null) tx.setDescription(updates.getDescription());
        if (updates.getPaymentMethod() != null) tx.setPaymentMethod(updates.getPaymentMethod());
        if (updates.getStatus() != null) tx.setStatus(updates.getStatus());
        if (updates.getTransactionDate() != null) tx.setTransactionDate(updates.getTransactionDate());
        return repository.save(tx);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public Map<String, BigDecimal> getSummary() {
        BigDecimal totalIncome = repository.sumByType("INCOME");
        BigDecimal totalExpense = repository.sumByType("EXPENSE");
        BigDecimal netCashFlow = totalIncome.subtract(totalExpense);
        return Map.of(
            "totalIncome", totalIncome,
            "totalExpense", totalExpense,
            "netCashFlow", netCashFlow
        );
    }

    public Map<String, BigDecimal> getSummaryByDateRange(LocalDateTime from, LocalDateTime to) {
        BigDecimal totalIncome = repository.sumByTypeAndDateRange("INCOME", from, to);
        BigDecimal totalExpense = repository.sumByTypeAndDateRange("EXPENSE", from, to);
        BigDecimal netCashFlow = totalIncome.subtract(totalExpense);
        return Map.of(
            "totalIncome", totalIncome,
            "totalExpense", totalExpense,
            "netCashFlow", netCashFlow
        );
    }
}
