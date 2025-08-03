import { ActionButtons } from "../features/ActionButtons";
import { CashInputPanel } from "../features/CashInputPanel";
import { PaymentModeToggle } from "../features/PaymentModeToggle";
import { PaymentDisplay } from "../ui/PaymentDisplay";
import { PaymentSummary } from "../ui/PaymentSummary";

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
