import React from 'react';

interface ControlPanelProps {
  paymentMethod: 'cash' | 'card';
  insertedMoney: number;
  message: string;
  isProcessing: boolean;
  purchasedItemsCount: number;
  onTogglePaymentMode: () => void;
  onInsertCash: (amount: number) => void;
  onReset: () => void;
}

const cashTypes = [100, 500, 1000, 5000, 10000];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  paymentMethod,
  insertedMoney,
  message,
  isProcessing,
  purchasedItemsCount,
  onTogglePaymentMode,
  onInsertCash,
  onReset
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-black text-white p-4 rounded-md text-right shadow-inner-lg">
        <div className="text-sm text-green-400">{paymentMethod === "card" ? "💳 카드결제" : "💵 현금결제"}</div>
        <div className="text-3xl font-mono my-1">₩{insertedMoney.toLocaleString()}</div>
        <div className="text-sm mt-1 h-10 text-yellow-300 break-keep">{message}</div>
      </div>

      <button
        onClick={onTogglePaymentMode}
        disabled={insertedMoney > 0}
        className="cursor-pointer w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {paymentMethod === "cash" ? "💳 카드 결제로 전환" : "💵 현금 결제로 전환"}
      </button>

      <div>
        <p
          className={`text-white font-semibold mb-2 transition-opacity ${paymentMethod !== "cash" && "opacity-50"}`}
        >
          현금 투입
        </p>
        <div className="grid grid-cols-2 gap-2">
          {cashTypes.map((cash) => (
            <button
              key={cash}
              onClick={() => onInsertCash(cash)}
              disabled={paymentMethod !== "cash" || isProcessing || purchasedItemsCount > 0}
              className="cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {cash.toLocaleString()}원
            </button>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={onReset}
          disabled={(paymentMethod === "cash" && insertedMoney === 0) || isProcessing}
          className="cursor-pointer w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          초기화
        </button>
      </div>
    </div>
  );
};