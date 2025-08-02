import { PaymentDisplay } from "./PaymentDisplay";
import { PaymentModeToggle } from "./PaymentModeToggle";
import { CashInputPanel } from "./CashInputPanel";
import { ActionButtons } from "./ActionButtons";
import { PaymentSummary } from "./PaymentSummary";

export function ControlPanel() {
  return (
    <div className="flex flex-col gap-6 row-span-2">
      <PaymentDisplay />
      <PaymentModeToggle />
      <CashInputPanel />
      <ActionButtons />
      <PaymentSummary />
    </div>
  );
}
