import React from "react";
import { useVendingMachine } from "../contexts/VendingMachineContext";

export const ReturnTray: React.FC = () => {
  const { purchasedItems } = useVendingMachine();
  return (
    <div className="col-span-2 flex flex-col gap-3">
      <div className="font-bold text-slate-700 text-lg flex items-center gap-2">
        📦 상품 수령함
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 min-h-[120px] flex items-center justify-center border border-slate-200 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="flex gap-3 flex-wrap justify-center">
            {purchasedItems.length > 0 ? (
              purchasedItems.map((item) => (
                <div key={item.id} className="text-5xl animate-bounce">
                  {item.icon}
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-center">
                <div className="text-4xl mb-2">🛒</div>
                <div className="text-sm font-medium">구매한 상품이 여기에 나타납니다</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
