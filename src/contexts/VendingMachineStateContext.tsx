import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { VendingMachineService } from "../services/VendingMachineService";
import { DebugMachineOperationStrategy, DefaultMachineOperationStrategy } from "../strategies/MachineOperationStrategy";
import { CardPaymentStrategy, CashPaymentStrategy } from "../strategies/PaymentStrategy";
import type { DebugSettings } from "../types/debug";
import type { Drink } from "../types/drink";
import { useDrinks } from "./DrinksContext";
import { useMessage } from "./MessageContext";
import { usePayment } from "./PaymentContext";

interface VendingMachineStateProviderProps {
  children: ReactNode;
  isDebugMode: boolean;
  debugSettings: DebugSettings;
}

interface VendingMachineState {
  isProcessing: boolean;
}

interface VendingMachineActions {
  insertCash: (amount: number) => void;
  selectDrink: (drink: Drink) => Promise<void>;
  togglePaymentMode: () => void;
  resetToInitialState: () => void;
  refundAllCash: () => void;
}

interface VendingMachineContextType extends VendingMachineState, VendingMachineActions {}

const VendingMachineStateContext = createContext<VendingMachineContextType | undefined>(undefined);

export function VendingMachineStateProvider(props: VendingMachineStateProviderProps) {
  const { children, isDebugMode, debugSettings } = props;
  const [isProcessing, setIsProcessing] = useState(false);

  const { showMessage, showTemporaryMessage, setDefaultMessage } = useMessage();
  const { paymentMethod, insertedMoney, setPaymentMethod, updateInsertedMoney, addRefundedAmount, resetPayment } =
    usePayment();
  const { drinks, updateDrinkStock, dispenseDrink, resetDrinks } = useDrinks();

  const cashStrategy = useMemo(() => new CashPaymentStrategy(), []);
  const cardStrategy = useMemo(() => new CardPaymentStrategy(), []);
  const defaultMachineOperationStrategy = useMemo(() => new DefaultMachineOperationStrategy(), []);
  const debugModeStrategy = useMemo(() => new DebugMachineOperationStrategy(debugSettings), [debugSettings]);

  const currentPaymentStrategy = paymentMethod === "cash" ? cashStrategy : cardStrategy;
  const machineOperationStrategy = isDebugMode ? debugModeStrategy : defaultMachineOperationStrategy;

  const vendingMachineService = useMemo(
    () =>
      new VendingMachineService({
        onShowMessage: showMessage,
        onShowTemporaryMessage: showTemporaryMessage,
        onSetDefaultMessage: setDefaultMessage,
        onUpdateInsertedMoney: updateInsertedMoney,
        onAddRefundedAmount: addRefundedAmount,
        onDispenseDrink: dispenseDrink,
        onUpdateDrinkStock: updateDrinkStock,
      }),
    [
      showMessage,
      showTemporaryMessage,
      setDefaultMessage,
      updateInsertedMoney,
      addRefundedAmount,
      dispenseDrink,
      updateDrinkStock,
    ],
  );

  const insertCash = (amount: number) => {
    vendingMachineService.insertCash(amount, paymentMethod, machineOperationStrategy);
  };

  const selectDrink = async (drink: Drink) => {
    if (isProcessing) return;

    setIsProcessing(true);
    await vendingMachineService.selectDrink(
      drink,
      insertedMoney,
      paymentMethod,
      drinks,
      currentPaymentStrategy,
      machineOperationStrategy,
    );
    setIsProcessing(false);
  };

  const togglePaymentMode = () => {
    const result = vendingMachineService.togglePaymentMode(paymentMethod);
    setPaymentMethod(result.newPaymentMethod);
    showTemporaryMessage(result.message);
  };

  const resetToInitialState = () => {
    resetDrinks();
    resetPayment();
    setIsProcessing(false);
    showMessage("결제 방식을 선택해주세요.");
  };

  const refundAllCash = () => {
    vendingMachineService.refundAllCash(insertedMoney, paymentMethod);
  };

  const value: VendingMachineContextType = {
    isProcessing,
    insertCash,
    selectDrink,
    togglePaymentMode,
    resetToInitialState,
    refundAllCash,
  };

  return <VendingMachineStateContext.Provider value={value}>{children}</VendingMachineStateContext.Provider>;
}

export const useVendingMachine = () => {
  const context = useContext(VendingMachineStateContext);
  if (context === undefined) {
    throw new Error("useVendingMachine must be used within a VendingMachineStateProvider");
  }
  return context;
};
