import React from "react";
import { useVendingMachine } from "../contexts/VendingMachineContext";

export const ReturnTray: React.FC = () => {
  const { purchasedItems } = useVendingMachine();
  return (
    <div className="col-span-3 flex flex-col gap-2">
      <div className="font-bold text-white">반환구</div>
      <div className="bg-black/30 rounded-lg p-4 min-h-[100px] flex items-center justify-between shadow-inner-lg">
        <div className="flex items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {purchasedItems.length > 0 ? (
              purchasedItems.map((item) => (
                <div key={item.id} className="text-4xl">
                  {item.icon}
                </div>
              ))
            ) : (
              <div className="text-gray-400">구매한 상품이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
