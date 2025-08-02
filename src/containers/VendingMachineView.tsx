import React from "react";
import { DrinkSelector } from "../components/DrinkSelector";
import { ControlPanel } from "../components/ControlPanel";
import { ReturnTray } from "../components/ReturnTray";

export const VendingMachineView: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-blue-900/80 backdrop-blur-sm border border-blue-500/50 rounded-2xl shadow-2xl p-8 w-[800px] h-auto grid grid-cols-3 gap-8">
        <DrinkSelector />
        <ControlPanel />
        <ReturnTray />
      </div>
    </div>
  );
};
