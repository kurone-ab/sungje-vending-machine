import { VendingMachine } from "./containers/VendingMachine";
import DebugPanel from "./DebugPanel";
import { useDebug } from "./useDebug";

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
