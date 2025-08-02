import { VendingMachineProvider } from "../contexts/VendingMachineContext";
import type { DebugSettings } from "../useDebug";
import { VendingMachineView } from "./VendingMachineView";

interface VendingMachineProps {
  isDebugMode: boolean;
  debugSettings: DebugSettings;
}

export function VendingMachine({ isDebugMode, debugSettings }: VendingMachineProps) {
  return (
    <VendingMachineProvider isDebugMode={isDebugMode} debugSettings={debugSettings}>
      <VendingMachineView />
    </VendingMachineProvider>
  );
}
