import React, { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { DebugMachineOperationStrategy, DefaultMachineOperationStrategy } from "../strategies/MachineOperationStrategy";
import type { Drink } from "../strategies/PaymentStrategy";
import { CardPaymentStrategy, CashPaymentStrategy } from "../strategies/PaymentStrategy";
import type { DebugSettings } from "../useDebug";

type PaymentMethod = "cash" | "card";

const initialDrinks: Drink[] = [
  { id: 1, name: "콜라", price: 1100, stock: 5, icon: "🥤" },
  { id: 2, name: "물", price: 600, stock: 10, icon: "💧" },
  { id: 3, name: "커피", price: 700, stock: 8, icon: "☕️" },
];

interface VendingMachineState {
  drinks: Drink[];
  insertedMoney: number;
  purchasedItems: Drink[];
  message: string;
  paymentMethod: PaymentMethod;
  isProcessing: boolean;
  refundedAmount: number;
}

interface VendingMachineActions {
  insertCash: (amount: number) => void;
  selectDrink: (drink: Drink) => Promise<void>;
  togglePaymentMode: () => void;
  clearRefundedAmount: () => void;
  resetToInitialState: () => void;
  refundAllCash: () => void;
}

interface VendingMachineContextType extends VendingMachineState, VendingMachineActions {}

const VendingMachineContext = createContext<VendingMachineContextType | undefined>(undefined);

interface VendingMachineProviderProps {
  children: ReactNode;
  isDebugMode: boolean;
  debugSettings: DebugSettings;
}

export const VendingMachineProvider: React.FC<VendingMachineProviderProps> = ({
  children,
  isDebugMode,
  debugSettings,
}) => {
  const [drinks, setDrinks] = useState(initialDrinks);
  const [insertedMoney, setInsertedMoney] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<Drink[]>([]);
  const [message, setMessage] = useState("결제 방식을 선택해주세요.");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundedAmount, setRefundedAmount] = useState(0);
  const [messageTimeoutId, setMessageTimeoutId] = useState<number | null>(null);

  const cashStrategy = useMemo(() => new CashPaymentStrategy(), []);
  const cardStrategy = useMemo(() => new CardPaymentStrategy(), []);
  const defaultMachineOperationStrategy = useMemo(() => new DefaultMachineOperationStrategy(), []);
  const debugModeStrategy = useMemo(() => new DebugMachineOperationStrategy(debugSettings), [debugSettings]);

  const currentPaymentStrategy = paymentMethod === "cash" ? cashStrategy : cardStrategy;
  const machineOperationStrategy = isDebugMode ? debugModeStrategy : defaultMachineOperationStrategy;

  const showTemporaryMessage = (msg: string, duration = 2000) => {
    const defaultMessage =
      paymentMethod === "cash" ? "현금을 투입하거나 음료를 선택하세요." : "결제할 음료를 선택하세요.";

    if (messageTimeoutId !== null) {
      clearTimeout(messageTimeoutId);
    }

    setMessage(msg);
    return new Promise<boolean>((resolve) => {
      const timeoutId = window.setTimeout(() => {
        setMessage(defaultMessage);
        setMessageTimeoutId(null);
        resolve(true);
      }, duration);
      setMessageTimeoutId(timeoutId);
    });
  };

  useEffect(() => {
    if (insertedMoney > 0 && purchasedItems.length > 0) {
      const canBuyMore = drinks.some((drink) => drink.stock > 0 && insertedMoney >= drink.price);
      if (!canBuyMore) {
        showTemporaryMessage(`구매 가능한 상품이 없어 ${insertedMoney.toLocaleString()}원을 반환합니다.`, 4000);
        setRefundedAmount((prev) => prev + insertedMoney);
        setInsertedMoney(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasedItems.length, drinks, insertedMoney]);

  const insertCash = (amount: number) => {
    if (paymentMethod !== "cash" || purchasedItems.length > 0) return;

    const success = machineOperationStrategy.processInsertCash(amount, showTemporaryMessage);
    if (success) {
      setInsertedMoney((prev) => prev + amount);
    }
  };

  const selectDrink = async (drink: Drink) => {
    if (isProcessing) return;

    setIsProcessing(true);

    if (paymentMethod === "card") {
      setMessage(`${drink.name} 카드 결제 중...`);
    }

    try {
      const paymentResult = await machineOperationStrategy.processPayment(currentPaymentStrategy, drink, insertedMoney);

      if (paymentResult.success) {
        const canDispense = machineOperationStrategy.processDispense();

        if (canDispense) {
          if (paymentMethod === "cash" && paymentResult.refundAmount !== undefined) {
            setInsertedMoney(paymentResult.refundAmount);
          }
          dispenseDrink(drink);
          showTemporaryMessage(paymentResult.message);
        } else {
          showTemporaryMessage("상품 제공에 실패했습니다. 결제를 취소합니다.");
          if (paymentMethod === "cash") {
            showTemporaryMessage(`오류 발생! ${drink.price.toLocaleString()}원을 환불합니다.`);
            setRefundedAmount((prev) => prev + drink.price);
            setInsertedMoney((prev) => prev + drink.price);
          }
        }
      } else {
        showTemporaryMessage(paymentResult.message);
      }
    } catch {
      showTemporaryMessage("처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const dispenseDrink = (drink: Drink) => {
    setPurchasedItems((prev) => [...prev, { ...drink, id: Date.now() }]);
    setDrinks((prevDrinks) => prevDrinks.map((d) => (d.id === drink.id ? { ...d, stock: d.stock - 1 } : d)));
  };

  const togglePaymentMode = () => {
    setPaymentMethod((prev) => (prev === "cash" ? "card" : "cash"));
    showTemporaryMessage(paymentMethod === "card" ? "현금 결제로 전환되었습니다." : "카드 결제로 전환되었습니다.");
  };

  const clearRefundedAmount = () => {
    setRefundedAmount(0);
  };

  const resetToInitialState = () => {
    setDrinks(initialDrinks);
    setInsertedMoney(0);
    setPurchasedItems([]);
    setMessage("결제 방식을 선택해주세요.");
    setPaymentMethod("cash");
    setIsProcessing(false);
    setRefundedAmount(0);
    if (messageTimeoutId !== null) {
      clearTimeout(messageTimeoutId);
      setMessageTimeoutId(null);
    }
  };

  const refundAllCash = () => {
    if (paymentMethod === "cash" && insertedMoney > 0) {
      showTemporaryMessage(`${insertedMoney.toLocaleString()}원이 반환됩니다.`);
      setRefundedAmount((prev) => prev + insertedMoney);
      setInsertedMoney(0);
    }
  };

  const value: VendingMachineContextType = {
    drinks,
    insertedMoney,
    purchasedItems,
    message,
    paymentMethod,
    isProcessing,
    refundedAmount,
    insertCash,
    selectDrink,
    togglePaymentMode,
    clearRefundedAmount,
    resetToInitialState,
    refundAllCash,
  };

  return <VendingMachineContext.Provider value={value}>{children}</VendingMachineContext.Provider>;
};

export const useVendingMachine = () => {
  const context = useContext(VendingMachineContext);
  if (context === undefined) {
    throw new Error("useVendingMachine must be used within a VendingMachineProvider");
  }
  return context;
};
