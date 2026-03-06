package com.janesjeans.api.repository;

import com.janesjeans.api.entity.CashFlowTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CashFlowTransactionRepository extends JpaRepository<CashFlowTransaction, String> {
    List<CashFlowTransaction> findByType(String type);
    List<CashFlowTransaction> findByCategory(String category);
    List<CashFlowTransaction> findByTransactionDateBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM CashFlowTransaction c WHERE c.type = :type AND c.status = 'COMPLETED'")
    BigDecimal sumByType(@Param("type") String type);

    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM CashFlowTransaction c WHERE c.type = :type AND c.status = 'COMPLETED' AND c.transactionDate BETWEEN :from AND :to")
    BigDecimal sumByTypeAndDateRange(@Param("type") String type, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
