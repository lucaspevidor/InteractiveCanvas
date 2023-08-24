import { DefineCanvasHooks, GetCanvas } from "./Modules/CanvasModule/Canvas";
import { CanvasManager } from "./Modules/CanvasModule/CanvasManager";
import { Vector2 } from "./Modules/Physics/Vector2";

function OnLoad(): void {
    DefineCanvasHooks(canvasManager);
    CanvasManager.RedefineCanvasResolution(canvasManager);
}

function OnFrameUpdate(): void {
    canvasManager.CanvasRenderer().ClearCanvas();
    canvasManager.CanvasRenderer().DrawCircle("yellow", new Vector2(50, 50), 10);
    canvasManager.CanvasRenderer().DrawCircle("red", new Vector2(-50, -50), 10);

    canvasManager.CanvasMovement().UpdateCanvasTranslation();

    requestAnimationFrame(OnFrameUpdate);
}

const canvas = GetCanvas();
const canvasManager = new CanvasManager(canvas);

OnLoad();
requestAnimationFrame(OnFrameUpdate);

// canvasManager.CanvasInput().KeyHandling(new KeyboardEvent("keydown", { key: "a" }));
canvasManager.CanvasMovement().TranslateCanvas(new Vector2(100, 100));
