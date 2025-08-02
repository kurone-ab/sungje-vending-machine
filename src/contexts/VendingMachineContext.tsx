import type { ReactNode } from "react";
import { MessageProvider } from "./MessageContext";
import { PaymentProvider } from "./PaymentContext";
import { DrinksProvider } from "./DrinksContext";
import { VendingMachineStateProvider } from "./VendingMachineStateContext";
import type { DebugSettings } from "../types/debug";

interface VendingMachineProviderProps {
  children: ReactNode;
  isDebugMode: boolean;
  debugSettings: DebugSettings;
}

export function VendingMachineProvider(props: VendingMachineProviderProps) {
  const { children, isDebugMode, debugSettings } = props;

  return (
    <MessageProvider>
      <PaymentProvider>
        <DrinksProvider>
          <VendingMachineStateProvider isDebugMode={isDebugMode} debugSettings={debugSettings}>
            {children}
          </VendingMachineStateProvider>
        </DrinksProvider>
      </PaymentProvider>
    </MessageProvider>
  );
}

export { useVendingMachine } from "./VendingMachineStateContext";
