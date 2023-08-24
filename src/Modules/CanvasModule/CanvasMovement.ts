import { Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasMovement {
    private readonly c: CanvasRenderingContext2D;
    private isTranslating = false;
    private readonly currentPosition = new Vector2(0, 0);
    private originPosition = new Vector2(0, 0);
    private destPosition = new Vector2(0, 0);

    constructor(
        private readonly cM: CanvasManager
    ) {
        this.c = cM.CanvasContext();
    };

    UpdateCanvasTranslation(): void {
        this.cM.CanvasRenderer().DrawCrosshair("red", this.destPosition.scale(-1).add(new Vector2(300, 300)), 4);

        if (this.currentPosition.isEqual(this.destPosition)) {
            this.originPosition = this.currentPosition.copy();
            this.isTranslating = false;
            return;
        }

        const tVector = this.destPosition.subtract(this.currentPosition);

        if (Math.abs(tVector.x) > 0.1) {
            const direction = tVector.x / Math.abs(tVector.x);
            const accFactor = 3 * SCurve(
                Math.abs(this.destPosition.x - this.currentPosition.x) / Math.abs(this.destPosition.x - this.originPosition.x)
            );
            this.c.translate(direction * accFactor, 0);
        }
        if (Math.abs(tVector.y) > 0.1) {
            const direction = tVector.y / Math.abs(tVector.y);
            const accFactor = 3 * SCurve(
                Math.abs(this.destPosition.y - this.currentPosition.y) / Math.abs(this.destPosition.y - this.originPosition.y)
            );
            this.c.translate(0, direction * accFactor);
        }

        this.currentPosition.x = this.c.getTransform().e;
        this.currentPosition.y = this.c.getTransform().f;

        const tol = 2;
        if (Math.abs(this.currentPosition.x - this.destPosition.x) < tol &&
            Math.abs(this.currentPosition.y - this.destPosition.y) < tol) {
            this.destPosition = this.currentPosition.copy();
        }
    }

    TranslateCanvas(translation: Vector2): void {
        this.originPosition = this.currentPosition.copy();
        this.destPosition = this.destPosition.add(translation);
    }
}

function SCurve(x: number): number {
    const sigma = 3;
    return (0.5 + 0.5 * Math.tanh(sigma * (x - 0.5) / 2));
}
