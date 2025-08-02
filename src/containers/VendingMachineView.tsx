import React from 'react';
import type { Drink } from '../strategies/PaymentStrategy';
import { DrinkSelector } from '../components/DrinkSelector';
import { ControlPanel } from '../components/ControlPanel';
import { ReturnTray } from '../components/ReturnTray';

interface VendingMachineViewProps {
  drinks: Drink[];
  insertedMoney: number;
  purchasedItems: Drink[];
  message: string;
  paymentMethod: 'cash' | 'card';
  isProcessing: boolean;
  onSelectDrink: (drink: Drink) => void;
  onTogglePaymentMode: () => void;
  onInsertCash: (amount: number) => void;
  onReset: () => void;
}

export const VendingMachineView: React.FC<VendingMachineViewProps> = ({
  drinks,
  insertedMoney,
  purchasedItems,
  message,
  paymentMethod,
  isProcessing,
  onSelectDrink,
  onTogglePaymentMode,
  onInsertCash,
  onReset
}) => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-blue-900/80 backdrop-blur-sm border border-blue-500/50 rounded-2xl shadow-2xl p-8 w-[800px] h-auto grid grid-cols-3 gap-8">
        <DrinkSelector
          drinks={drinks}
          paymentMethod={paymentMethod}
          insertedMoney={insertedMoney}
          isProcessing={isProcessing}
          onSelectDrink={onSelectDrink}
        />

        <ControlPanel
          paymentMethod={paymentMethod}
          insertedMoney={insertedMoney}
          message={message}
          isProcessing={isProcessing}
          purchasedItemsCount={purchasedItems.length}
          onTogglePaymentMode={onTogglePaymentMode}
          onInsertCash={onInsertCash}
          onReset={onReset}
        />

        <ReturnTray purchasedItems={purchasedItems} />
      </div>
    </div>
  );
};