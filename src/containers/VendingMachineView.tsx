import { ControlPanel } from "../components/ControlPanel";
import { DrinkSelector } from "../components/DrinkSelector";
import { ReturnTray } from "../components/ReturnTray";

export function VendingMachineView() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-xl p-10 w-[900px] h-auto grid grid-cols-3 gap-8">
        <DrinkSelector />
        <ControlPanel />
        <ReturnTray />
      </div>
    </div>
  );
}
