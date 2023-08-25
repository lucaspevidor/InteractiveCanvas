import { Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasMovement {
    private readonly _c: CanvasRenderingContext2D;

    private _position = new Vector2(0, 0);
    private _velocity = new Vector2(0, 0);
    private _force = new Vector2(0, 0);

    private _mass = 1.5;
    private _drag = 10;
    private _maxVelocity = 10;

    constructor(
        private readonly cM: CanvasManager
    ) {
        this._c = cM.CanvasContext();
    };

    UpdateCanvasTranslation(deltaTime: number): void {
        const fDrag = this._velocity.r180deg().scale(this._drag);
        const acc = this._force.add(fDrag).scale(1 / this._mass);

        this._velocity = this._velocity.add(acc.scale(deltaTime));

        const velMag = this._velocity.mag();
        if (velMag > this._maxVelocity) {
            this._velocity = this._velocity.normalize().scale(this._maxVelocity);
        }
        if (velMag < 0.1) {
            this._velocity = new Vector2(0, 0);
        }

        this._c.translate(this._velocity.x, this._velocity.y);
        this._position.x = this._c.getTransform().e;
        this._position.y = this._c.getTransform().f;
    }

    TranslateCanvas(translation: Vector2): void {
        this._force = translation;
    }
}
