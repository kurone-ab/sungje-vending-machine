import { usePayment } from "../../contexts/PaymentContext";
import { useVendingMachine } from "../../contexts/VendingMachineStateContext";

const cashTypes = [100, 500, 1000, 5000, 10000];

export function CashInputPanel() {
  const { paymentMethod } = usePayment();
  const { isProcessing, insertCash } = useVendingMachine();

  return (
    <div>
      <p className={`text-slate-700 font-semibold mb-3 transition-opacity ${paymentMethod !== "cash" && "opacity-50"}`}>
        💰 현금 투입
      </p>
      <div className="grid grid-cols-2 gap-3">
        {cashTypes.map((cash) => (
          <button
            key={cash}
            onClick={() => insertCash(cash)}
            disabled={paymentMethod !== "cash" || isProcessing}
            className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-md"
          >
            {cash.toLocaleString()}원
          </button>
        ))}
      </div>
    </div>
  );
}
