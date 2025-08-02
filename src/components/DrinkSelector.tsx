import React from "react";
import { useVendingMachine } from "../contexts/VendingMachineContext";

export const DrinkSelector: React.FC = () => {
  const { drinks, paymentMethod, insertedMoney, isProcessing, selectDrink } = useVendingMachine();
  return (
    <div className="col-span-2 bg-black/30 rounded-lg p-6 grid grid-cols-3 grid-rows-2 gap-6">
      {drinks.map((drink) => {
        const isCashAvailable = paymentMethod === "cash" && insertedMoney >= drink.price;
        const isCardAvailable = paymentMethod === "card";
        const isAvailable = isCashAvailable || isCardAvailable;

        return (
          <button
            key={drink.id}
            onClick={() => selectDrink(drink)}
            disabled={!isAvailable || isProcessing}
            className={`bg-white/90 p-4 rounded-lg shadow-lg flex flex-col items-center justify-between transition-all duration-200 ${isAvailable && !isProcessing ? "cursor-pointer hover:scale-105 hover:shadow-xl" : "opacity-50 cursor-not-allowed"}`}
          >
            <div className="text-5xl mb-2">{drink.icon}</div>
            <div className="font-bold text-lg">{drink.name}</div>
            <div className="text-md text-gray-800">₩{drink.price.toLocaleString()}</div>
            <div
              className={`text-xs font-semibold mt-2 px-2 py-1 rounded-full ${drink.stock > 0 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
            >
              재고: {drink.stock}
            </div>
          </button>
        );
      })}
    </div>
  );
};
