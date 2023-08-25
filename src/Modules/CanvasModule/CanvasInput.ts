import { Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasInput {
    private keyPressed: Record<string, boolean> = {
        a: false,
        s: false,
        d: false,
        w: false
    };

    constructor(
        private readonly cM: CanvasManager
    ) {}

    KeyHandling(cM: CanvasManager, e: KeyboardEvent): void {
        const forceIntensity = 60;
        let f = new Vector2(0, 0);

        if (e.type === "keydown") {
            if (e.key === "a") { this.keyPressed.a = true; }
            if (e.key === "s") { this.keyPressed.s = true; }
            if (e.key === "d") { this.keyPressed.d = true; }
            if (e.key === "w") { this.keyPressed.w = true; }
        }
        if (e.type === "keyup") {
            if (e.key === "a") { this.keyPressed.a = false; }
            if (e.key === "s") { this.keyPressed.s = false; }
            if (e.key === "d") { this.keyPressed.d = false; }
            if (e.key === "w") { this.keyPressed.w = false; }
        }

        if (this.keyPressed.a) {
            f = f.add(new Vector2(1, 0));
        }
        if (this.keyPressed.s) {
            f = f.add(new Vector2(0, -1));
        }
        if (this.keyPressed.d) {
            f = f.add(new Vector2(-1, 0));
        }
        if (this.keyPressed.w) {
            f = f.add(new Vector2(0, 1));
        }
        cM.CanvasMovement().TranslateCanvas(f.scale(forceIntensity));
    }
}
