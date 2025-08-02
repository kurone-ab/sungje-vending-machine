import { useVendingMachine } from "../contexts/VendingMachineContext";

export function PaymentModeToggle() {
  const { paymentMethod, insertedMoney, togglePaymentMode } = useVendingMachine();
  
  return (
    <button
      onClick={togglePaymentMode}
      disabled={insertedMoney > 0}
      className="cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-md"
    >
      {paymentMethod === "cash" ? "💳 카드 결제로 전환" : "💵 현금 결제로 전환"}
    </button>
  );
}