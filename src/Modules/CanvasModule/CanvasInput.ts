import { Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasInput {
    private keyPressed: Record<string, boolean> = {
        a: false,
        s: false,
        d: false,
        w: false,
        plus: false,
        minus: false
    };

    private mouseBtnPressed: Record<number, boolean> = {
        0: false,
        1: false,
        2: false
    };

    constructor(
        private readonly cM: CanvasManager
    ) {}

    KeyHandling(cM: CanvasManager, e: KeyboardEvent): void {
        const forceIntensity = 60;
        const scaleIntensity = 0.2;
        const shiftMultiplier = 3;

        let f = new Vector2(0, 0);
        let s = 0;

        if (e.type === "keydown") {
            if (e.key === "a" || e.key === "A") { this.keyPressed.a = true; }
            if (e.key === "s" || e.key === "S") { this.keyPressed.s = true; }
            if (e.key === "d" || e.key === "D") { this.keyPressed.d = true; }
            if (e.key === "w" || e.key === "W") { this.keyPressed.w = true; }
            if (e.key === "=" || e.key === "+") { this.keyPressed.plus = true; }
            if (e.key === "-" || e.key === "_") { this.keyPressed.minus = true; }
        }
        if (e.type === "keyup") {
            if (e.key === "a" || e.key === "A") { this.keyPressed.a = false; }
            if (e.key === "s" || e.key === "S") { this.keyPressed.s = false; }
            if (e.key === "d" || e.key === "D") { this.keyPressed.d = false; }
            if (e.key === "w" || e.key === "W") { this.keyPressed.w = false; }
            if (e.key === "=" || e.key === "+") { this.keyPressed.plus = false; }
            if (e.key === "-" || e.key === "_") { this.keyPressed.minus = false; }
        }

        // Canvas translation

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

        // Canvas scale
        if (this.keyPressed.plus) {
            s += 1;
        }
        if (this.keyPressed.minus) {
            s -= 1;
        }

        cM.CanvasMovement().ScaleCanvas(s * scaleIntensity);
    }

    MouseButtonHandling(cM: CanvasManager, e: MouseEvent): void {
        if (e.type === "mousedown") {
            if (e.button === 0) { this.mouseBtnPressed[0] = true; }
            if (e.button === 1) { this.mouseBtnPressed[1] = true; }
            if (e.button === 2) { this.mouseBtnPressed[2] = true; }
        }

        if (e.type === "mouseup") {
            if (e.button === 0) { this.mouseBtnPressed[0] = false; }
            if (e.button === 1) { this.mouseBtnPressed[1] = false; }
            if (e.button === 2) { this.mouseBtnPressed[2] = false; }
        }

        // Drag event
        if (e.type === "mousemove" && this.mouseBtnPressed[0]) {
            cM.CanvasMovement().ForceCanvasTranslate(new Vector2(e.movementX, e.movementY));
        }
    }

    MouseScrollHandling(cM: CanvasManager, e: WheelEvent): void {
        e.preventDefault();
        const scaleIntensity = 0.02;

        cM.CanvasMovement().ScaleCanvas(scaleIntensity * e.deltaY);
    }
}
