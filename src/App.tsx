import { useEffect, useRef, useState } from "react";
import { StandardMaterials } from "./modules/babylon";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showDebugger, setShowDebugger] = useState(true);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    // initialize scene
    new StandardMaterials(canvasRef.current, { debug: showDebugger });
  }, [showDebugger]);

  return (
    <div className="App">
      <label htmlFor="show-debugger">
        Show Debugger
        <input
          type="checkbox"
          name="debug"
          id="show-debugger"
          checked={showDebugger}
          onChange={(e) => setShowDebugger(e.target.checked)}
        />
      </label>

      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
