export interface Drink {
  id: number;
  name: string;
  price: number;
  stock: number;
  icon: string;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  refundAmount?: number;
}

export interface PaymentStrategy {
  canPurchase(drink: Drink, insertedMoney?: number): boolean;
  processPayment(drink: Drink, insertedMoney: number): Promise<PaymentResult>;
  getDisplayName(): string;
}

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
      refundAmount: insertedMoney - drink.price,
    };
  }

  getDisplayName(): string {
    return "💵 현금결제";
  }
}

export class CardPaymentStrategy implements PaymentStrategy {
  canPurchase(drink: Drink): boolean {
    return drink.stock > 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async processPayment(drink: Drink, _insertedMoney: number): Promise<PaymentResult> {
    if (!this.canPurchase(drink)) {
      return {
        success: false,
        message: "재고가 없습니다.",
      };
    }

    // 카드 결제 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.2; // 80% 확률로 성공

    if (isSuccess) {
      return {
        success: true,
        message: `${drink.name}이(가) 나왔습니다.`,
      };
    } else {
      return {
        success: false,
        message: "카드 결제에 실패했습니다.",
      };
    }
  }

  getDisplayName(): string {
    return "💳 카드결제";
  }
}
