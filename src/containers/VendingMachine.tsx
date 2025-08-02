import React from "react";
import type { DebugSettings } from "../useDebug";
import { VendingMachineProvider } from "../contexts/VendingMachineContext";
import { VendingMachineView } from "./VendingMachineView";

interface VendingMachineProps {
  isDebugMode: boolean;
  debugSettings: DebugSettings;
}

export const VendingMachine: React.FC<VendingMachineProps> = ({ isDebugMode, debugSettings }) => {
  return (
    <VendingMachineProvider isDebugMode={isDebugMode} debugSettings={debugSettings}>
      <VendingMachineView />
    </VendingMachineProvider>
  );
};
