import { useVendingMachine } from "../contexts/VendingMachineContext";

export function PaymentDisplay() {
  const { paymentMethod, insertedMoney, message } = useVendingMachine();
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl text-right shadow-lg border border-slate-700">
      <div className="text-sm text-emerald-400 font-medium">
        {paymentMethod === "card" ? "💳 카드 결제" : "💵 현금 결제"}
      </div>
      <div className="text-4xl font-mono my-2 text-white">₩{insertedMoney.toLocaleString()}</div>
      <div className="text-sm mt-2 h-12 text-amber-300 break-keep leading-relaxed">{message}</div>
    </div>
  );
}