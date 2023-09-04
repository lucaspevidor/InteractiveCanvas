import { DefineCanvasHooks, GetCanvas } from "./Modules/CanvasModule/Canvas";
import { CanvasManager } from "./Modules/CanvasModule/CanvasManager";
import { Vector2 } from "./Modules/Physics/Vector2";

function OnLoad(): void {
    DefineCanvasHooks(canvasManager);
    CanvasManager.RedefineCanvasResolution(canvasManager);
}

let lastTimestamp = 0;
function CalculateDeltaTime(timestamp: number): number {
    const maxDelay = 0.5;
    let dt = (timestamp - lastTimestamp) / 1000;
    if (dt > maxDelay) {
        dt = 0;
    }

    lastTimestamp = timestamp;
    return dt;
}

function OnFrameUpdate(timestamp: number): void {
    const dt = CalculateDeltaTime(timestamp);

    canvasManager.CanvasRenderer().ClearCanvas();
    canvasManager.CanvasMovement().UpdateCanvasTranslation(dt);
    canvasManager.CanvasMovement().UpdateCanvasScale(dt);
    canvasManager.CanvasRenderer().DrawGrid();
    canvasManager.CanvasObjectManager().RenderObjects();

    requestAnimationFrame(OnFrameUpdate);
}

const canvas = GetCanvas();
const canvasManager = new CanvasManager(canvas);

canvasManager.CanvasObjectManager().AddCircle("yellow", new Vector2(50, 50), 10);
canvasManager.CanvasObjectManager().AddCircle("red", new Vector2(-50, -50), 10);
canvasManager.CanvasObjectManager().AddCircle("lightblue", new Vector2(500, 500), 10);

OnLoad();
requestAnimationFrame(OnFrameUpdate);
