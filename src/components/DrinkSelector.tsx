import { useVendingMachine } from "../contexts/VendingMachineContext";
import { DrinkCard } from "./DrinkCard";

export function DrinkSelector() {
  const { drinks, paymentMethod, insertedMoney, isProcessing, selectDrink } = useVendingMachine();
  return (
    <div className="col-span-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 grid grid-cols-3 grid-rows-2 gap-6 border border-slate-300/50">
      {drinks.map((drink) => {
        const isCashAvailable = paymentMethod === "cash" && insertedMoney >= drink.price;
        const isCardAvailable = paymentMethod === "card";
        const isAvailable = isCashAvailable || isCardAvailable;

        return (
          <DrinkCard
            key={drink.id}
            drink={drink}
            isAvailable={isAvailable}
            isProcessing={isProcessing}
            onSelect={selectDrink}
          />
        );
      })}
    </div>
  );
}
