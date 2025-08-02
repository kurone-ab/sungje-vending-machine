import type { ReactNode } from "react";
import type { DebugSettings } from "../hooks/useDebug";
import { MessageProvider } from "./MessageContext";
import { PaymentProvider } from "./PaymentContext";
import { DrinksProvider } from "./DrinksContext";
import { VendingMachineStateProvider } from "./VendingMachineStateContext";

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
