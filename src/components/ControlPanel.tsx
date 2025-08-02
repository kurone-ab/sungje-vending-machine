import React from "react";
import { useVendingMachine } from "../contexts/VendingMachineContext";

const cashTypes = [100, 500, 1000, 5000, 10000];

export const ControlPanel: React.FC = () => {
  const { paymentMethod, insertedMoney, message, isProcessing, purchasedItems, refundedAmount, togglePaymentMode, insertCash, resetToInitialState, refundAllCash } =
    useVendingMachine();
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-black text-white p-4 rounded-md text-right shadow-inner-lg">
        <div className="text-sm text-green-400">{paymentMethod === "card" ? "💳 카드결제" : "💵 현금결제"}</div>
        <div className="text-3xl font-mono my-1">₩{insertedMoney.toLocaleString()}</div>
        <div className="text-sm mt-1 h-10 text-yellow-300 break-keep">{message}</div>
      </div>

      <button
        onClick={togglePaymentMode}
        disabled={insertedMoney > 0}
        className="cursor-pointer w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {paymentMethod === "cash" ? "💳 카드 결제로 전환" : "💵 현금 결제로 전환"}
      </button>

      <div>
        <p className={`text-white font-semibold mb-2 transition-opacity ${paymentMethod !== "cash" && "opacity-50"}`}>
          현금 투입
        </p>
        <div className="grid grid-cols-2 gap-2">
          {cashTypes.map((cash) => (
            <button
              key={cash}
              onClick={() => insertCash(cash)}
              disabled={paymentMethod !== "cash" || isProcessing || purchasedItems.length > 0}
              className="cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {cash.toLocaleString()}원
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={refundAllCash}
          disabled={paymentMethod !== "cash" || insertedMoney === 0 || isProcessing}
          className="cursor-pointer w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          현금 환불
        </button>
        <button
          onClick={resetToInitialState}
          disabled={isProcessing}
          className="cursor-pointer w-full bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          초기 상태로 리셋
        </button>
      </div>

        <div className="bg-yellow-600/80 rounded-lg p-3 border border-yellow-500">
            <div className="text-white text-sm font-medium mb-1">환불된금액</div>
            <div className="text-yellow-200 text-xl font-bold">
                {refundedAmount.toLocaleString()}원
            </div>
        </div>
    </div>
  );
};
