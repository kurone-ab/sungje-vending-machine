import type { Drink, MachineOperationStrategy, PaymentStrategy, PaymentMethod } from "../types";

interface VendingMachineServiceCallbacks {
  onShowMessage: (msg: string) => void;
  onShowTemporaryMessage: (msg: string, duration?: number) => Promise<boolean>;
  onSetDefaultMessage: (paymentMethod: PaymentMethod) => void;
  onUpdateInsertedMoney: (amount: number) => void;
  onAddRefundedAmount: (amount: number) => void;
  onDispenseDrink: (drink: Drink) => void;
  onUpdateDrinkStock: (drinkId: number) => void;
}

export class VendingMachineService {
  private callbacks: VendingMachineServiceCallbacks;

  constructor(callbacks: VendingMachineServiceCallbacks) {
    this.callbacks = callbacks;
  }

  private changeIfCannotBuyMore(insertedMoney: number, drinks: Drink[]) {
    if (insertedMoney > 0) {
      const canBuyMore = drinks.some((drink) => drink.stock > 0 && insertedMoney >= drink.price);
      if (!canBuyMore) {
        this.callbacks.onShowTemporaryMessage(
          `구매 가능한 상품이 없어 ${insertedMoney.toLocaleString()}원을 반환합니다.`,
          4000,
        );
        this.callbacks.onAddRefundedAmount(insertedMoney);
        this.callbacks.onUpdateInsertedMoney(0);
      }
    }
  }

  insertCash(amount: number, paymentMethod: PaymentMethod, machineOperationStrategy: MachineOperationStrategy): void {
    if (paymentMethod !== "cash") return;

    const success = machineOperationStrategy.processInsertCash(amount, this.callbacks.onShowTemporaryMessage);
    if (success) {
      this.callbacks.onUpdateInsertedMoney(amount);
    } else {
      this.callbacks.onAddRefundedAmount(amount);
    }
  }

  async selectDrink(
    drink: Drink,
    insertedMoney: number,
    paymentMethod: PaymentMethod,
    drinks: Drink[],
    currentPaymentStrategy: PaymentStrategy,
    machineOperationStrategy: MachineOperationStrategy,
  ): Promise<void> {
    if (paymentMethod === "card") {
      this.callbacks.onShowMessage(`${drink.name} 카드 결제 중...`);
    }

    try {
      const paymentResult = await machineOperationStrategy.processPayment(currentPaymentStrategy, drink, insertedMoney);

      if (paymentResult.success) {
        const canDispense = machineOperationStrategy.processDispense();

        if (canDispense) {
          if (paymentMethod === "cash" && paymentResult.changeAmount !== undefined) {
            this.callbacks.onUpdateInsertedMoney(paymentResult.changeAmount);
            this.changeIfCannotBuyMore(paymentResult.changeAmount, drinks);
          }
          this.callbacks.onDispenseDrink(drink);
          this.callbacks.onUpdateDrinkStock(drink.id);
          this.callbacks.onShowTemporaryMessage(paymentResult.message);
        } else {
          if (paymentMethod === "cash") {
            this.callbacks.onShowTemporaryMessage(
              `상품 제공에 실패했습니다. ${drink.price.toLocaleString()}원을 환불합니다.`,
            );
            this.callbacks.onUpdateInsertedMoney(insertedMoney - drink.price);
            this.callbacks.onAddRefundedAmount(drink.price);
          } else {
            this.callbacks.onShowTemporaryMessage("상품 제공에 실패했습니다. 결제를 취소합니다.");
          }
        }
      } else {
        this.callbacks.onShowTemporaryMessage(paymentResult.message);
      }
    } catch {
      this.callbacks.onShowTemporaryMessage("처리 중 오류가 발생했습니다.");
    }
  }

  refundAllCash(insertedMoney: number, paymentMethod: PaymentMethod): void {
    if (paymentMethod === "cash" && insertedMoney > 0) {
      this.callbacks.onShowTemporaryMessage(`${insertedMoney.toLocaleString()}원이 반환됩니다.`);
      this.callbacks.onAddRefundedAmount(insertedMoney);
      this.callbacks.onUpdateInsertedMoney(0);
    }
  }

  togglePaymentMode(currentPaymentMethod: PaymentMethod): { newPaymentMethod: PaymentMethod; message: string } {
    const newPaymentMethod = currentPaymentMethod === "cash" ? "card" : "cash";
    const message = currentPaymentMethod === "card" ? "현금 결제로 전환되었습니다." : "카드 결제로 전환되었습니다.";

    return { newPaymentMethod, message };
  }
}
