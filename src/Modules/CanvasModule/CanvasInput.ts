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
        const shiftMultiplier = 3;

        let f = new Vector2(0, 0);

        if (e.type === "keydown") {
            if (e.key === "a" || e.key === "A") { this.keyPressed.a = true; }
            if (e.key === "s" || e.key === "S") { this.keyPressed.s = true; }
            if (e.key === "d" || e.key === "D") { this.keyPressed.d = true; }
            if (e.key === "w" || e.key === "W") { this.keyPressed.w = true; }
        }
        if (e.type === "keyup") {
            if (e.key === "a" || e.key === "A") { this.keyPressed.a = false; }
            if (e.key === "s" || e.key === "S") { this.keyPressed.s = false; }
            if (e.key === "d" || e.key === "D") { this.keyPressed.d = false; }
            if (e.key === "w" || e.key === "W") { this.keyPressed.w = false; }
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
        if (e.shiftKey) {
            f = f.scale(shiftMultiplier);
        }

        cM.CanvasMovement().TranslateCanvas(f.scale(forceIntensity));
    }
}
