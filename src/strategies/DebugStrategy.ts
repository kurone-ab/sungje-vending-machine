import type { DebugSettings } from "../useDebug";
import type { Drink, PaymentResult, PaymentStrategy } from "./PaymentStrategy";

export interface DebugStrategy {
  processInsertCash(amount: number, onMessage: (msg: string) => void): boolean;
  processPayment(strategy: PaymentStrategy, drink: Drink, insertedMoney: number): Promise<PaymentResult>;
  processDispense(): boolean;
}

export class NormalDebugStrategy implements DebugStrategy {
  processInsertCash(amount: number, onMessage: (msg: string) => void): boolean {
    onMessage(`${amount.toLocaleString()}원이 투입되었습니다.`);
    return true;
  }

  async processPayment(strategy: PaymentStrategy, drink: Drink, insertedMoney: number): Promise<PaymentResult> {
    return strategy.processPayment(drink, insertedMoney);
  }

  processDispense(): boolean {
    return true;
  }
}

export class DebugModeStrategy implements DebugStrategy {
  private debugSettings: DebugSettings;

  constructor(debugSettings: DebugSettings) {
    this.debugSettings = debugSettings;
  }

  processInsertCash(amount: number, onMessage: (msg: string) => void): boolean {
    if (this.debugSettings.forceInvalidCash) {
      onMessage(`[Debug] 유효하지 않은 화폐(${amount.toLocaleString()}원)가 반환됩니다.`);
      return false;
    }

    onMessage(`${amount.toLocaleString()}원이 투입되었습니다.`);
    return true;
  }

  async processPayment(strategy: PaymentStrategy, drink: Drink, insertedMoney: number): Promise<PaymentResult> {
    if (this.debugSettings.forceStockMismatch) {
      return {
        success: false,
        message: "재고가 없습니다.",
      };
    }

    const result = await strategy.processPayment(drink, insertedMoney);

    if (result.success && strategy.getDisplayName().includes("카드") && this.debugSettings.forceCardFailure) {
      return {
        success: false,
        message: "카드 결제에 실패했습니다.",
      };
    }

    return result;
  }

  processDispense(): boolean {
    return !this.debugSettings.forceDispenseFailure;
  }
}
