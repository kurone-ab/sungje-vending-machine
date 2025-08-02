import { VendingMachineProvider } from "../../contexts/VendingMachineContext";
import { ControlPanel } from "./ControlPanel";
import { DrinkSelector } from "../features/DrinkSelector";
import { ReturnTray } from "../features/ReturnTray";
import type { DebugSettings } from "../../types/debug";

interface VendingMachineProps {
  isDebugMode: boolean;
  debugSettings: DebugSettings;
}

export function VendingMachine({ isDebugMode, debugSettings }: VendingMachineProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-xl p-10 w-[900px] h-auto grid grid-cols-3 gap-8">
        <VendingMachineProvider isDebugMode={isDebugMode} debugSettings={debugSettings}>
          <DrinkSelector />
          <ControlPanel />
          <ReturnTray />
        </VendingMachineProvider>
      </div>
    </div>
  );
}
