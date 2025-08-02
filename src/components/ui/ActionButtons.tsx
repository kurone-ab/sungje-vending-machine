import { usePayment } from "../../contexts/PaymentContext";
import { useVendingMachine } from "../../contexts/VendingMachineContext";

export function ActionButtons() {
  const { paymentMethod, insertedMoney } = usePayment();
  const { isProcessing, refundAllCash, resetToInitialState } = useVendingMachine();

  return (
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
  );
}
