import { useVendingMachine } from "../contexts/VendingMachineContext";

export function DrinkSelector() {
  const { drinks, paymentMethod, insertedMoney, isProcessing, selectDrink } = useVendingMachine();
  return (
    <div className="col-span-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 grid grid-cols-3 grid-rows-2 gap-6 border border-slate-300/50">
      {drinks.map((drink) => {
        const isCashAvailable = paymentMethod === "cash" && insertedMoney >= drink.price;
        const isCardAvailable = paymentMethod === "card";
        const isAvailable = isCashAvailable || isCardAvailable;

        return (
          <button
            key={drink.id}
            onClick={() => selectDrink(drink)}
            disabled={!isAvailable || isProcessing}
            className={`bg-white p-5 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center justify-between transition-all duration-300 ${isAvailable && !isProcessing ? "cursor-pointer hover:scale-105 hover:shadow-lg hover:border-blue-300 hover:bg-blue-50" : "opacity-60 cursor-not-allowed grayscale"}`}
          >
            <div className="text-5xl mb-3">{drink.icon}</div>
            <div className="font-bold text-lg text-slate-800 mb-1">{drink.name}</div>
            <div className="text-lg font-semibold text-blue-600 mb-2">₩{drink.price.toLocaleString()}</div>
            <div
              className={`text-xs font-medium px-3 py-1 rounded-full ${drink.stock > 0 ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"}`}
            >
              재고 {drink.stock}개
            </div>
          </button>
        );
      })}
    </div>
  );
}
