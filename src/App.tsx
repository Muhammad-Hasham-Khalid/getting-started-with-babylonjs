import { useEffect, useRef } from "react";
import { StandardMaterials } from "./modules/babylon";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    // initialize scene
    new StandardMaterials(canvasRef.current);
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
