import type { Drink } from "../types/drink";
import type { PaymentResult, PaymentStrategy } from "../types/payment";
import type { DebugSettings } from "../types/debug";

export class CashPaymentStrategy implements PaymentStrategy {
  canPurchase(drink: Drink, insertedMoney: number): boolean {
    return drink.stock > 0 && insertedMoney >= drink.price;
  }

  async processPayment(drink: Drink, insertedMoney: number): Promise<PaymentResult> {
    if (!this.canPurchase(drink, insertedMoney)) {
      return {
        success: false,
        message: insertedMoney < drink.price ? "잔액이 부족합니다." : "재고가 없습니다.",
      };
    }

    return {
      success: true,
      message: `${drink.name}이(가) 나왔습니다.`,
      changeAmount: insertedMoney - drink.price,
    };
  }
}

export class CardPaymentStrategy implements PaymentStrategy {
  canPurchase(drink: Drink): boolean {
    return drink.stock > 0;
  }

  async processPayment(drink: Drink): Promise<PaymentResult> {
    if (!this.canPurchase(drink)) {
      return {
        success: false,
        message: "재고가 없습니다.",
      };
    }

    // 카드 결제 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      message: `${drink.name}이(가) 나왔습니다.`,
    };
  }
}

export class DebugCardPaymentStrategy extends CardPaymentStrategy {
  private debugSettings: DebugSettings;

  constructor(debugSettings: DebugSettings) {
    super();
    this.debugSettings = debugSettings;
  }

  async processPayment(drink: Drink): Promise<PaymentResult> {
    if (!this.canPurchase(drink)) {
      return {
        success: false,
        message: "재고가 없습니다.",
      };
    }

    // 카드 결제 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 디버그 모드에서 카드 결제 실패 시뮬레이션
    if (this.debugSettings.forceCardFailure) {
      return {
        success: false,
        message: "카드 결제에 실패했습니다.",
      };
    }

    return {
      success: true,
      message: `${drink.name}이(가) 나왔습니다.`,
    };
  }
}
