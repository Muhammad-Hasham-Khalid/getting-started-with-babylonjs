import { useCallback, useEffect, useRef, CSSProperties, useState } from "react";
import { Portal } from "./modules/babylon";
import { CustomLoadingScreen } from "./modules/babylon/loading";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visible, setVisible] = useState(false);

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
        show: () => setVisible(true),
        hide: () => setVisible(false),
      },
    });

    const scene = new Portal(canvasRef.current, {
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

  return (
    <div className="App">
      {visible ? <div style={loadingContainerStyles}>LOADING...</div> : null}
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
