import { RigidBody2D } from "../Physics/RigidBody2D";
import { type Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasMovement {
    private readonly _c: CanvasRenderingContext2D;
    private readonly _rb: RigidBody2D = new RigidBody2D();

    constructor(
        private readonly cM: CanvasManager
    ) {
        this._rb.mass = 1.5;
        this._rb.dragCoefficient = 10;
        this._rb.maxVelocity = 10;
        this._rb.stopVelocity = 0.1;

        this._c = cM.CanvasContext();
    }

    UpdateCanvasTranslation(deltaTime: number): void {
        this._rb.Update(deltaTime);
        this._c.translate(this._rb.velocity.x, this._rb.velocity.y);
    }

    TranslateCanvas(translation: Vector2): void {
        this._rb.RemoveForces();
        this._rb.ApplyForce(translation);
    }
}
