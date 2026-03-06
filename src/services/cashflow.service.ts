/**
 * Cash Flow Service Layer
 */

import { CashFlowTransactionDTO, CashFlowSummary } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './util';

export const fetchCashFlowTransactions = async (): Promise<CashFlowTransactionDTO[]> => {
  return apiGet<CashFlowTransactionDTO[]>('/api/cash-flow');
};

export const fetchCashFlowById = async (id: string): Promise<CashFlowTransactionDTO> => {
  return apiGet<CashFlowTransactionDTO>(`/api/cash-flow/${id}`);
};

export const fetchCashFlowByType = async (type: 'INCOME' | 'EXPENSE'): Promise<CashFlowTransactionDTO[]> => {
  return apiGet<CashFlowTransactionDTO[]>(`/api/cash-flow/type/${type}`);
};

export const createCashFlowTransaction = async (tx: Partial<CashFlowTransactionDTO>): Promise<CashFlowTransactionDTO> => {
  return apiPost<CashFlowTransactionDTO>('/api/cash-flow', tx);
};

export const updateCashFlowTransaction = async (id: string, tx: Partial<CashFlowTransactionDTO>): Promise<CashFlowTransactionDTO> => {
  return apiPut<CashFlowTransactionDTO>(`/api/cash-flow/${id}`, tx);
};

export const deleteCashFlowTransaction = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/cash-flow/${id}`);
};

export const fetchCashFlowSummary = async (): Promise<CashFlowSummary> => {
  return apiGet<CashFlowSummary>('/api/cash-flow/summary');
};
