import { type Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasRenderer {
    private readonly c: CanvasRenderingContext2D;
    constructor(
        private readonly cM: CanvasManager
    ) {
        this.c = cM.CanvasContext();
    }

    ClearCanvas(): void {
        const matrix = this.c.getTransform();
        this.c.clearRect(-matrix.e, -matrix.f, this.c.canvas.width, this.c.canvas.height);
    }

    DrawCircle(color: string, position: Vector2, radius: number): void {
        this.c.fillStyle = color;
        this.c.beginPath();
        this.c.arc(position.x, position.y, radius, 0, Math.PI * 2);
        this.c.fill();
    }

    DrawCrosshair(color: string, position: Vector2, size: number): void {
        this.c.strokeStyle = color;
        this.c.beginPath();
        this.c.moveTo(position.x, position.y - size);
        this.c.lineTo(position.x, position.y + size);
        this.c.moveTo(position.x - size, position.y);
        this.c.lineTo(position.x + size, position.y);
        this.c.stroke();
    }
}
