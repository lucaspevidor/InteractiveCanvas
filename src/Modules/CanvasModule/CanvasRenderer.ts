import { Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

/**
 * Represents the properties of the grid to be drawn on the canvas.
 *
 * @interface
 * @property {string} originColor - The color of the origin.
 * @property {string} mainColor - The color of the main lines.
 * @property {string} secondaryColor - The color of the secondary lines.
 * @property {number} lineWidth - The width of the lines.
 * @property {number} unitSize - The separation between grid lines.
 * @property {Vector2} offset - The offset of the grid.
 */
export interface GridProperties {
    originColor: string
    mainColor: string
    secondaryColor: string
    lineWidth: number
    unitSize: number
    offset: Vector2
    showUnits: boolean
    unitFont: string
}

export class CanvasRenderer {
    private readonly c: CanvasRenderingContext2D;
    public gridProperites: GridProperties = {
        originColor: "green",
        mainColor: "rgba(172, 76, 31, 0.5)",
        secondaryColor: "rgba(255, 255, 255, 0.1",
        lineWidth: 0.5,
        unitSize: 25,
        offset: new Vector2(0, 0),
        showUnits: true,
        unitFont: "Century Gothic"
    };

    constructor(
        private readonly cM: CanvasManager
    ) {
        this.c = cM.CanvasContext();
    }

    ClearCanvas(): void {
        const matrix = this.c.getTransform();
        this.c.clearRect(-matrix.e / matrix.a, -matrix.f / matrix.a, this.c.canvas.width / matrix.a, this.c.canvas.height / matrix.a);
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

    DrawLine(color: string, origin: Vector2, dest: Vector2, width: number): void {
        this.c.strokeStyle = color;
        this.c.lineWidth = width;
        this.c.lineCap = "square";
        this.c.beginPath();
        this.c.moveTo(origin.x, origin.y);
        this.c.lineTo(dest.x, dest.y);
        this.c.stroke();
    }

    DrawText(text: string, position: Vector2, color: string, font: string): void {
        this.c.fillStyle = color;
        this.c.font = `${Math.round(18 / this.c.getTransform().a)}px ` + font;
        this.c.fillText(text, position.x, position.y);
    }

    DrawGrid(params: Partial<GridProperties> | undefined = undefined): void {
        let { originColor, mainColor, secondaryColor, lineWidth, unitSize, offset, showUnits, unitFont } =
            params === undefined ? this.gridProperites : { ...this.gridProperites, ...params };

        const tMatrix = this.c.getTransform();
        const topLeft = new Vector2(-tMatrix.e, -tMatrix.f).scale(1 / tMatrix.a);
        const bottomRight = new Vector2(-tMatrix.e, -tMatrix.f).add(new Vector2(this.c.canvas.width, this.c.canvas.height)).scale(1 / tMatrix.a);

        const unitScaleFactor = Math.round(-0.434294 * Math.log(tMatrix.a));
        unitSize = unitSize * (10 ** unitScaleFactor);

        const sxLineStart = Math.floor((topLeft.x / unitSize) - 1) * unitSize + offset.x % unitSize;
        const pxLineStart = Math.floor((topLeft.x / (unitSize * 10)) - 1) * unitSize * 10 + offset.x % unitSize;
        const syLineStart = Math.floor((topLeft.y / unitSize) - 1) * unitSize + offset.y % unitSize;
        const pyLineStart = Math.floor((topLeft.y / (unitSize * 10)) - 1) * unitSize * 10 + offset.y % unitSize;

        const sxLineEnd = Math.ceil(bottomRight.x / unitSize) * unitSize;
        const syLineEnd = Math.ceil(bottomRight.y / unitSize) * unitSize;

        this.DrawCircle("blue", topLeft, 2);
        this.DrawCircle("blue", bottomRight, 2);

        // Drawing y_axis lines
        // Secondary color
        for (let i = sxLineStart; i < bottomRight.x; i += unitSize) {
            this.DrawLine(secondaryColor, new Vector2(i, syLineStart), new Vector2(i, syLineEnd), lineWidth / tMatrix.a);
        }

        // Primary Color
        for (let i = pxLineStart; i < bottomRight.x; i += unitSize * 10) {
            let color = mainColor;
            if (i === offset.x % unitSize) { color = originColor; }
            if (i > sxLineStart) {
                this.DrawLine(color, new Vector2(i, syLineStart), new Vector2(i, syLineEnd), lineWidth / tMatrix.a);
                if (showUnits) { this.DrawText(String(i), new Vector2(i, bottomRight.y).add(new Vector2(5, -5).scale(1 / tMatrix.a)), color, unitFont); }
            }
        }

        // Draw x_axis lines
        // Secondary color
        for (let i = syLineStart; i < bottomRight.y; i += unitSize) {
            this.DrawLine(secondaryColor, new Vector2(sxLineStart, i), new Vector2(sxLineEnd, i), lineWidth / tMatrix.a);
        }

        // Primary color
        for (let i = pyLineStart; i < bottomRight.y; i += unitSize * 10) {
            let color = mainColor;
            if (i === offset.y % (unitSize)) { color = originColor; }
            if (i > syLineStart) {
                this.DrawLine(color, new Vector2(sxLineStart, i), new Vector2(sxLineEnd, i), lineWidth / tMatrix.a);
                if (showUnits) { this.DrawText(String(i), new Vector2(topLeft.x, i).add(new Vector2(5, -5).scale(1 / tMatrix.a)), color, unitFont); }
            }
        }
    }
}
