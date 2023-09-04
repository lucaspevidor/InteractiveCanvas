import { type Vector2 } from "../Physics/Vector2";
import { type CanvasRenderer } from "./CanvasRenderer";

export interface CanvasObject {
    readonly id: number
    Render: () => void
}

export class Circle implements CanvasObject {
    constructor(
        public readonly id: number,
        public position: Vector2,
        public radius: number,
        public color: string,
        private readonly cR: CanvasRenderer
    ) {}

    Render(): void {
        this.cR.DrawCircle(this.color, this.position, this.radius);
    }
}

export class Rectangle implements CanvasObject {
    constructor(
        public readonly id: number,
        public topLeft: Vector2,
        public size: Vector2,
        public color: string,
        private readonly cR: CanvasRenderer
    ) {}

    Render(): void {
        this.cR.DrawRectangle(this.color, this.topLeft, this.size);
    }
}

export class Line implements CanvasObject {
    constructor(
        public readonly id: number,
        public color: string,
        public origin: Vector2,
        public dest: Vector2,
        public width: number,
        private readonly cR: CanvasRenderer
    ) {}

    Render(): void {
        this.cR.DrawLine(this.color, this.origin, this.dest, this.width);
    }
}
