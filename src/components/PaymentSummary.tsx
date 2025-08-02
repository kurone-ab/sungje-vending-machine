import { useVendingMachine } from "../contexts/VendingMachineContext";

export function PaymentSummary() {
  const { purchasedItems, refundedAmount } = useVendingMachine();
  
  const totalPaymentAmount = purchasedItems.reduce((total, item) => total + item.price, 0);
  
  return (
    <>
      <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 border border-emerald-200 shadow-sm">
        <div className="text-emerald-800 text-sm font-semibold mb-2 flex items-center gap-1">💳 총 결제 금액</div>
        <div className="text-emerald-900 text-2xl font-bold">₩{totalPaymentAmount.toLocaleString()}</div>
      </div>

      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-4 border border-amber-200 shadow-sm">
        <div className="text-amber-800 text-sm font-semibold mb-2 flex items-center gap-1">💰 환불된 금액</div>
        <div className="text-amber-900 text-2xl font-bold">₩{refundedAmount.toLocaleString()}</div>
      </div>
    </>
  );
}