import { PaymentDisplay } from "../features/PaymentDisplay";
import { PaymentModeToggle } from "../features/PaymentModeToggle";
import { ActionButtons } from "../ui/ActionButtons";
import { CashInputPanel } from "../ui/CashInputPanel";
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
