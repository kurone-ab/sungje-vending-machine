import DebugPanel from "./components/DebugPanel";
import { VendingMachine } from "./components/layouts/VendingMachine";
import { useDebug } from "./hooks/useDebug";

function App() {
  const { isDebugMode, debugSettings, setDebugSettings } = useDebug();

  return (
    <>
      <VendingMachine isDebugMode={isDebugMode} debugSettings={debugSettings} />
      {isDebugMode && <DebugPanel debugSettings={debugSettings} setDebugSettings={setDebugSettings} />}
    </>
  );
}

export default App;
