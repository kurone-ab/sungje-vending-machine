import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { DebugSettings } from "../types/debug";

interface SwitchProps {
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

interface DebugPanelProps {
  debugSettings: DebugSettings;
  setDebugSettings: Dispatch<SetStateAction<DebugSettings>>;
}

function Switch({ name, checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
    </label>
  );
}


function DebugPanel({ debugSettings, setDebugSettings }: DebugPanelProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDebugSettings((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-64">
      <h3 className="text-lg font-bold mb-3 border-b border-gray-600 pb-2">관리자 모드</h3>
      <div className="space-y-3">
        <Switch
          name="forceCardFailure"
          checked={debugSettings.forceCardFailure}
          onChange={handleChange}
          label="카드 결제 실패 강제"
        />
        <Switch
          name="forceDispenseFailure"
          checked={debugSettings.forceDispenseFailure}
          onChange={handleChange}
          label="상품 제공 실패 강제"
        />
        <Switch
          name="forceInvalidCash"
          checked={debugSettings.forceInvalidCash}
          onChange={handleChange}
          label="유효하지 않은 화폐"
        />
        <Switch
          name="forceStockMismatch"
          checked={debugSettings.forceStockMismatch}
          onChange={handleChange}
          label="재고 불일치 강제"
        />
      </div>
    </div>
  );
}

export default DebugPanel;
