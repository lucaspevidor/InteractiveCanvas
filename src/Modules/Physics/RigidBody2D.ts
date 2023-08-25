import { Vector2 } from "./Vector2";

export class RigidBody2D {
    position = new Vector2(0, 0);
    velocity = new Vector2(0, 0);
    acceleration = new Vector2(0, 0);
    forces: Record<number, Vector2> = {};
    private _forceIndex = 0;

    mass = 1;
    dragCoefficient = 0;
    maxVelocity = -1;
    stopVelocity = -1;

    ApplyForce(force: Vector2): number {
        this.forces[this._forceIndex] = force.copy();
        return this._forceIndex++;
    }

    RemoveForce(forceId: number): void {
        this.forces = Object.entries(this.forces)
            .filter(([id, force]) => Number(id) !== forceId)
            .reduce<Record<number, Vector2>>((obj, [id, force]) => {
            obj[Number(id)] = force;
            return obj;
        }, {});
    }

    RemoveForces(): void {
        this.forces = {};
    }

    Update(deltaTime: number): void {
        const dragForce = this.velocity.r180deg().scale(this.dragCoefficient);
        const resultingForce = Object.values(this.forces).reduce((acc, force) =>
            acc.add(force), dragForce.copy());

        this.acceleration = resultingForce.scale(1 / this.mass);

        const prevVelocity = this.velocity.copy();
        this.velocity = this.velocity.add(this.acceleration.scale(deltaTime));

        if (this.maxVelocity >= 0) {
            const velMag = this.velocity.mag();
            if (velMag > this.maxVelocity) {
                this.velocity = this.velocity.normalize().scale(this.maxVelocity);
            }
        }

        if (this.stopVelocity >= 0) {
            const velMag = this.velocity.mag();
            if (velMag < this.stopVelocity) {
                this.velocity = new Vector2(0, 0);
            }
        }

        this.position = this.position.add(this.velocity.add(prevVelocity).scale(deltaTime * 0.5));
    }
}
