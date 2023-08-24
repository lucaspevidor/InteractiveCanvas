import { Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasInput {
    constructor(
        private readonly cM: CanvasManager
    ) {}

    KeyHandling(cM: CanvasManager, e: KeyboardEvent): void {
        const movementIntensity = 60;

        if (e.key === "a") {
            cM.CanvasMovement().TranslateCanvas(new Vector2(movementIntensity, 0));
        }
        if (e.key === "s") {
            cM.CanvasMovement().TranslateCanvas(new Vector2(0, -movementIntensity));
        }
        if (e.key === "d") {
            cM.CanvasMovement().TranslateCanvas(new Vector2(-movementIntensity, 0));
        }
        if (e.key === "w") {
            cM.CanvasMovement().TranslateCanvas(new Vector2(0, movementIntensity));
        }
    }
}
