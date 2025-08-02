import type { Drink } from './drink';
import type { PaymentResult, PaymentStrategy } from './payment';

export interface MachineOperationStrategy {
  processInsertCash(amount: number, onMessage: (msg: string) => void): boolean;
  processPayment(strategy: PaymentStrategy, drink: Drink, insertedMoney: number): Promise<PaymentResult>;
  processDispense(): boolean;
}