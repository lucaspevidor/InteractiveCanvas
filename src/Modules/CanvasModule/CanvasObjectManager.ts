import { type Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";
import { Circle, type CanvasObject, Rectangle, Line } from "./CanvasObject";

export class CanvasObjectManager {
    private canvasObjects: CanvasObject[] = [];
    private idCounter: number = 0;
    constructor(
        private readonly cM: CanvasManager
    ) {}

    private AddObject(obj: CanvasObject): void {
        this.canvasObjects = [...this.canvasObjects, obj];
    }

    AddCircle(color: string, center: Vector2, radius: number): CanvasObject {
        const circle = new Circle(this.idCounter, center, radius, color, this.cM.CanvasRenderer());
        this.AddObject(circle);
        return circle;
    }

    AddRectangle(color: string, topLeft: Vector2, size: Vector2): CanvasObject {
        const rect = new Rectangle(this.idCounter, topLeft, size, color, this.cM.CanvasRenderer());
        this.AddObject(rect);
        return rect;
    }

    AddLine(color: string, origin: Vector2, dest: Vector2, width: number): CanvasObject {
        const line = new Line(this.idCounter, color, origin, dest, width, this.cM.CanvasRenderer());
        this.AddObject(line);
        return line;
    }

    RemoveObject(obj: CanvasObject): boolean {
        return this.RemoveObjectById(obj.id);
    }

    RemoveObjectById(id: number): boolean {
        let objectRemoved = false;
        this.canvasObjects = this.canvasObjects.filter((obj) => {
            if (obj.id === id) { objectRemoved = true; }
            return obj.id !== id;
        });

        return objectRemoved;
    }

    RenderObjects(): void {
        this.canvasObjects.forEach(obj => { obj.Render(); });
    }
}
