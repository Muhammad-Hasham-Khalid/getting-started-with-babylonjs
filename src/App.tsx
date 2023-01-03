import { useCallback, useEffect, useRef, CSSProperties, useState } from "react";
import { MeshActions } from "./modules/babylon";
import { CustomLoadingScreen } from "./modules/babylon/lib/loading";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const _onMounted = useCallback(async () => {
    if (canvasRef.current === null) {
      return;
    }

    // initialize scene
    let valFromStorage = localStorage.getItem("showDebugger");
    let showDebugger = valFromStorage
      ? (JSON.parse(valFromStorage) as boolean)
      : false;

    const customLoadingScreen = new CustomLoadingScreen({
      loaderApi: {
        show: () => setIsLoading(true),
        hide: () => setIsLoading(false),
      },
    });

    const scene = new MeshActions(canvasRef.current, {
      debug: showDebugger,
      customLoadingScreen,
    });

    await scene.initialize();

    return () => scene.dispose();
  }, []);

  useEffect(() => {
    const _clear = _onMounted();

    return () => {
      _clear.then((f) => f?.());
    };
  }, [_onMounted]);

  return (
    <div className="App">
      {isLoading ? <div style={loadingContainerStyles}>LOADING...</div> : null}
      <canvas ref={canvasRef} />
    </div>
  );
}

const loadingContainerStyles: CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  backgroundColor: "black",
  display: "grid",
  placeItems: "center",
  minWidth: "100vw",
  minHeight: "100vh",
  color: "white",
  fontSize: 32,
};

export default App;
