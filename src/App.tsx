import { useEffect, useRef } from "react";
import { CustomLoading } from "./modules/babylon";
import {
  CustomLoadingScreen,
  useLoadingContext,
} from "./modules/babylon/loading";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { show, hide, visible } = useLoadingContext();

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    // initialize scene
    let valFromStorage = localStorage.getItem("showDebugger");
    let showDebugger = valFromStorage
      ? (JSON.parse(valFromStorage) as boolean)
      : false;

    const customLoadingScreen = new CustomLoadingScreen({
      loaderApi: { show, hide },
    });

    const scene = new CustomLoading(canvasRef.current, {
      debug: showDebugger,
      customLoadingScreen,
    });

    scene.initialize();
  }, [hide, show]);

  return (
    <div className="App">
      {visible ? "LOADING" : null}
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
