import { useEffect, useRef } from "react";
import { Portal, LightsShadows } from "./modules/babylon";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    // initialize scene
    let valFromStorage = localStorage.getItem("showDebugger");
    let showDebugger = valFromStorage
      ? (JSON.parse(valFromStorage) as boolean)
      : false;

    const scene = new Portal(canvasRef.current, {
      debug: showDebugger,
    });

    scene.initialize();
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
