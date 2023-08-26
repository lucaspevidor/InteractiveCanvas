import { RigidBody1D } from "../Physics/RigidBody1D";
import { RigidBody2D } from "../Physics/RigidBody2D";
import { type Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasMovement {
    private readonly _c: CanvasRenderingContext2D;
    private readonly _rb: RigidBody2D = new RigidBody2D();
    private readonly _rbScroll: RigidBody1D = new RigidBody1D();

    constructor(
        private readonly cM: CanvasManager
    ) {
        this._rb.mass = 1.5;
        this._rb.dragCoefficient = 10;
        this._rb.maxVelocity = 30;
        this._rb.stopVelocity = 0.1;

        this._rbScroll.mass = 1;
        this._rbScroll.dragCoefficient = 10;
        this._rbScroll.maxVelocity = 1;
        this._rbScroll.stopVelocity = 0;
        this._rbScroll.position = 1;

        this._c = cM.CanvasContext();
    }

    UpdateCanvasTranslation(deltaTime: number): void {
        this._rb.Update(deltaTime);
        this._c.translate(this._rb.velocity.x, this._rb.velocity.y);
        // console.log(this._c.getTransform());
    }

    TranslateCanvas(translation: Vector2): void {
        this._rb.RemoveForces();
        this._rb.ApplyForce(translation);
    }

    ForceCanvasTranslate(translation: Vector2): void {
        this._c.translate(translation.x, translation.y);
        this._rb.position.x = this._c.getTransform().e;
        this._rb.position.y = this._c.getTransform().f;
    }

    UpdateCanvasScale(deltaTime: number): void {
        this._rbScroll.Update(deltaTime);
        this._c.scale(this._rbScroll.velocity + 1, this._rbScroll.velocity + 1);
        this._rbScroll.RemoveForces();
    }

    ScaleCanvas(scaleIntensity: number): void {
        this._rbScroll.RemoveForces();
        this._rbScroll.ApplyForce(scaleIntensity);
    }
}
