import { RigidBody1D } from "../Physics/RigidBody1D";
import { RigidBody2D } from "../Physics/RigidBody2D";
import { Vector2 } from "../Physics/Vector2";
import { type CanvasManager } from "./CanvasManager";

export class CanvasMovement {
    private readonly _c: CanvasRenderingContext2D;
    private readonly _rb: RigidBody2D = new RigidBody2D();
    private readonly _rbScroll: RigidBody1D = new RigidBody1D();

    private _scaleFactor = 1;
    get scaleFactor(): number {
        return this._scaleFactor;
    }

    constructor(
        private readonly cM: CanvasManager
    ) {
        this._rb.mass = 1.5;
        this._rb.dragCoefficient = 10;
        this._rb.maxVelocity = 50000;
        this._rb.stopVelocity = 0.1;

        this._rbScroll.mass = 1;
        this._rbScroll.dragCoefficient = 10;
        this._rbScroll.maxVelocity = 20;
        this._rbScroll.stopVelocity = 0.001;
        this._rbScroll.position = 1;

        this._c = cM.CanvasContext();
        this._scaleFactor = this._c.getTransform().a;
    }

    UpdateCanvasTranslation(deltaTime: number): void {
        this._rb.Update(deltaTime);
        const matrix = this._c.getTransform();
        matrix.e = this._rb.position.x;
        matrix.f = this._rb.position.y;

        this._c.setTransform(matrix);
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
        // this._c.scale(this._rbScroll.velocity + 1, this._rbScroll.velocity + 1);
        const matrix = this._c.getTransform();
        matrix.a = this._rbScroll.position;
        matrix.d = this._rbScroll.position;
        matrix.m11 = this._rbScroll.position;
        this._c.setTransform(matrix);

        this._rbScroll.RemoveForces();
        const deltaSFactor = matrix.a - this.scaleFactor;
        this._scaleFactor = matrix.a;

        // Handles display translation to keep it on center when zooming
        const canvasSize = new Vector2(this._c.canvas.width, this._c.canvas.height);
        const canvasCenter = this._rb.position.scale(1 / this.scaleFactor).add(canvasSize.scale(-0.5 / this._scaleFactor));

        this.ForceCanvasTranslate(canvasCenter.scale(deltaSFactor / this._scaleFactor));
    }

    ScaleCanvas(scaleIntensity: number): void {
        this._rbScroll.RemoveForces();
        this._rbScroll.ApplyForce(scaleIntensity);
    }
}
