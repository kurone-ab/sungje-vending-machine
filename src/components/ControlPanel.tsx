import React from "react";
import { useVendingMachine } from "../contexts/VendingMachineContext";

const cashTypes = [100, 500, 1000, 5000, 10000];

export const ControlPanel: React.FC = () => {
  const { paymentMethod, insertedMoney, message, isProcessing, purchasedItems, refundedAmount, togglePaymentMode, insertCash, resetToInitialState, refundAllCash } =
    useVendingMachine();
  
  const totalPaymentAmount = purchasedItems.reduce((total, item) => total + item.price, 0);
  return (
    <div className="flex flex-col gap-6 row-span-2">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl text-right shadow-lg border border-slate-700">
        <div className="text-sm text-emerald-400 font-medium">{paymentMethod === "card" ? "💳 카드 결제" : "💵 현금 결제"}</div>
        <div className="text-4xl font-mono my-2 text-white">₩{insertedMoney.toLocaleString()}</div>
        <div className="text-sm mt-2 h-12 text-amber-300 break-keep leading-relaxed">{message}</div>
      </div>

      <button
        onClick={togglePaymentMode}
        disabled={insertedMoney > 0}
        className="cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-md"
      >
        {paymentMethod === "cash" ? "💳 카드 결제로 전환" : "💵 현금 결제로 전환"}
      </button>

      <div>
        <p className={`text-slate-700 font-semibold mb-3 transition-opacity ${paymentMethod !== "cash" && "opacity-50"}`}>
          💰 현금 투입
        </p>
        <div className="grid grid-cols-2 gap-3">
          {cashTypes.map((cash) => (
            <button
              key={cash}
              onClick={() => insertCash(cash)}
              disabled={paymentMethod !== "cash" || isProcessing || purchasedItems.length > 0}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-md"
            >
              {cash.toLocaleString()}원
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={refundAllCash}
          disabled={paymentMethod !== "cash" || insertedMoney === 0 || isProcessing}
          className="cursor-pointer w-full bg-gradient-to-r from-rose-500 to-red-500 text-white p-3 rounded-xl hover:from-rose-600 hover:to-red-600 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-md"
        >
          💸 현금 환불
        </button>
        <button
          onClick={resetToInitialState}
          disabled={isProcessing}
          className="cursor-pointer w-full bg-gradient-to-r from-slate-500 to-gray-600 text-white p-3 rounded-xl hover:from-slate-600 hover:to-gray-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-md"
        >
          🔄 초기화
        </button>
      </div>

        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-4 border border-amber-200 shadow-sm">
            <div className="text-amber-800 text-sm font-semibold mb-2 flex items-center gap-1">
              💰 환불된 금액
            </div>
            <div className="text-amber-900 text-2xl font-bold">
                ₩{refundedAmount.toLocaleString()}
            </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 border border-emerald-200 shadow-sm">
            <div className="text-emerald-800 text-sm font-semibold mb-2 flex items-center gap-1">
              💳 총 결제 금액
            </div>
            <div className="text-emerald-900 text-2xl font-bold">
                ₩{totalPaymentAmount.toLocaleString()}
            </div>
        </div>
    </div>
  );
};
