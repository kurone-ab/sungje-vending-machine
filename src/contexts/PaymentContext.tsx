import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { PaymentMethod } from "../types/payment";

interface PaymentProviderProps {
  children: ReactNode;
}

interface PaymentState {
  paymentMethod: PaymentMethod;
  insertedMoney: number;
  refundedAmount: number;
}

interface PaymentActions {
  setPaymentMethod: (method: PaymentMethod) => void;
  updateInsertedMoney: (amount: number) => void;
  addRefundedAmount: (amount: number) => void;
  clearRefundedAmount: () => void;
  resetPayment: () => void;
}

interface PaymentContextType extends PaymentState, PaymentActions {}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: PaymentProviderProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [insertedMoney, setInsertedMoney] = useState(0);
  const [refundedAmount, setRefundedAmount] = useState(0);

  const updateInsertedMoney = (amount: number) => {
    if (amount === 0) {
      setInsertedMoney(0);
    } else {
      setInsertedMoney((prev) => prev + amount);
    }
  };

  const addRefundedAmount = (amount: number) => {
    setRefundedAmount((prev) => prev + amount);
  };

  const clearRefundedAmount = () => {
    setRefundedAmount(0);
  };

  const resetPayment = () => {
    setPaymentMethod("cash");
    setInsertedMoney(0);
    setRefundedAmount(0);
  };

  const value: PaymentContextType = {
    paymentMethod,
    insertedMoney,
    refundedAmount,
    setPaymentMethod,
    updateInsertedMoney,
    addRefundedAmount,
    clearRefundedAmount,
    resetPayment,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
