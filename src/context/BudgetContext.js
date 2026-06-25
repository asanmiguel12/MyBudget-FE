import React, { createContext, useContext, useState, useCallback } from 'react';

const BudgetContext = createContext();

const INITIAL_BUDGET = 2500.00;

const INITIAL_TRANSACTIONS = [
  {
    id: '1',
    merchant: 'Lunch',
    category: 'food',
    amount: 12.50,
    date: new Date(2025, 4, 12, 12, 45),
    icon: 'restaurant',
    color: '#4CAF50',
  },
];

export function BudgetProvider({ children }) {
  const [budget] = useState(INITIAL_BUDGET);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = budget - spent;
  const percentRemaining = ((remaining / budget) * 100).toFixed(2);

  const addTransaction = useCallback((transaction) => {
    setIsAnimating(true);
    setPendingTransaction(transaction);

    setTimeout(() => {
      setTransactions(prev => [transaction, ...prev]);
      setPendingTransaction(null);
      setIsAnimating(false);
    }, 2000);
  }, []);

  const simulateBankNotification = useCallback(() => {
    const newTx = {
      id: Date.now().toString(),
      merchant: 'Coffee Corner',
      category: 'coffee',
      amount: 25.60,
      date: new Date(),
      icon: 'local-cafe',
      color: '#8B6914',
    };
    addTransaction(newTx);
    return newTx;
  }, [addTransaction]);

  return (
    <BudgetContext.Provider value={{
      budget,
      spent,
      remaining,
      percentRemaining,
      transactions,
      pendingTransaction,
      isAnimating,
      addTransaction,
      simulateBankNotification,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  return useContext(BudgetContext);
}
