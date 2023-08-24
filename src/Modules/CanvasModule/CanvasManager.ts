import { CanvasInput } from "./CanvasInput";
import { CanvasMovement } from "./CanvasMovement";
import { CanvasRenderer } from "./CanvasRenderer";

export class CanvasManager {
    private readonly _canvasContext: CanvasRenderingContext2D;
    private readonly _canvasMovement: CanvasMovement;
    private readonly _canvasRenderer: CanvasRenderer;
    private readonly _canvasInput: CanvasInput;

    constructor(
        public c: HTMLCanvasElement
    ) {
        this._canvasContext = c.getContext("2d") as CanvasRenderingContext2D;
        this._canvasMovement = new CanvasMovement(this);
        this._canvasRenderer = new CanvasRenderer(this);
        this._canvasInput = new CanvasInput(this);
    }

    CanvasContext(): CanvasRenderingContext2D {
        return this._canvasContext;
    }

    CanvasMovement(): CanvasMovement {
        return this._canvasMovement;
    }

    CanvasRenderer(): CanvasRenderer {
        return this._canvasRenderer;
    }

    CanvasInput(): CanvasInput {
        return this._canvasInput;
    }

    static RedefineCanvasResolution(cM: CanvasManager): void {
        const matrix = cM._canvasContext.getTransform();
        const style = getComputedStyle(cM.c);
        cM.c.width = parseInt(style.width);
        cM.c.height = parseInt(style.height);
        cM._canvasContext.setTransform(matrix);
    }
}
