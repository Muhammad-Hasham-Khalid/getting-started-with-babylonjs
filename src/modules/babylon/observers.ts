import { EventState, FreeCamera, KeyboardInfo, Vector3 } from "@babylonjs/core";

export class Observers {
  static moveCameraUpDown = (camera: FreeCamera) => {
    return (eventData: KeyboardInfo, eventState: EventState) => {
      const keyPressed = eventData.event.code;
      const isKeyDown = eventData.event.type === "keydown";

      // move up
      if (keyPressed === "Space" && isKeyDown) {
        camera.position = camera.position.add(new Vector3(0, camera.speed, 0));
      }

      // move down
      if (keyPressed === "ControlLeft" && isKeyDown) {
        camera.position = camera.position.add(new Vector3(0, -camera.speed, 0));
      }
    };
  };
}
