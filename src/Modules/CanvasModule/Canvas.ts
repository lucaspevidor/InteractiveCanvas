import { CanvasManager } from "./CanvasManager";

export function GetCanvasCt(): CanvasRenderingContext2D {
    const canvas = GetCanvas();
    if (canvas == null) { throw new Error("Canvas is null"); }

    return canvas.getContext("2d") as CanvasRenderingContext2D;
}

export function GetCanvas(): HTMLCanvasElement {
    const canvasId = "cv";
    return document.getElementById(canvasId) as HTMLCanvasElement;
}

export function DefineCanvasHooks(manager: CanvasManager): void {
    window.addEventListener("resize", () => { CanvasManager.RedefineCanvasResolution(manager); });
    window.addEventListener("keydown", (e: KeyboardEvent) => { manager.CanvasInput().KeyHandling(manager, e); });
    window.addEventListener("keyup", (e: KeyboardEvent) => { manager.CanvasInput().KeyHandling(manager, e); });
    GetCanvas().addEventListener("mousedown", (e: MouseEvent) => { manager.CanvasInput().MouseButtonHandling(manager, e); });
    GetCanvas().addEventListener("mouseup", (e: MouseEvent) => { manager.CanvasInput().MouseButtonHandling(manager, e); });
    GetCanvas().addEventListener("mousemove", (e: MouseEvent) => { manager.CanvasInput().MouseButtonHandling(manager, e); });
    GetCanvas().addEventListener("wheel", (e: WheelEvent) => { manager.CanvasInput().MouseScrollHandling(manager, e); });
}
