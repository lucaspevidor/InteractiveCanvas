import { Vector2 } from "./Vector2";

/**
 * @class RigidBody2D
 * @description A class responsible for simulating a 2D rigid body.
 * @property {Vector2} position The position of the rigid body.
 * @property {Vector2} velocity The velocity of the rigid body.
 * @property {Vector2} acceleration The acceleration of the rigid body.
 * @property {number} maxVelocity A limit for the velocity of the rigid body.
 * @property {number} stopVelocity A tolerance, in which the rigid body will stop moving.
 *
 * @example
 * const rb = new RigidBody2D();
 * rb.mass = 10;
 *
 * const f = new Vector2(10, 0);
 * rb.ApplyForce(f);
 *
 * rb.Update(1);
 */
export class RigidBody2D {
    public position = new Vector2(0, 0);
    public velocity = new Vector2(0, 0);
    public acceleration = new Vector2(0, 0);
    public maxVelocity = -1;
    public stopVelocity = -1;

    private _forces: Record<number, Vector2> = {};
    private _forceIndex = 0;

    /**
     * Represents the mass of the rigid body.
     * @property {number} mass
     * @default 1
     * @throws {Error} Mass must be greater than 0
     */
    private _mass = 1;
    get mass(): number {
        return this._mass;
    }

    set mass(value: number) {
        if (value <= 0) { throw new Error("Mass must be greater than 0"); }
        this._mass = value;
    }

    /**
     * Represents the drag coefficient of the rigid body.
     * @property {number} dragCoefficient
     * @default 0
     * @throws {Error} Drag coefficient must be greater than or equal to 0
     */
    private _dragCoefficient = 0;
    get dragCoefficient(): number {
        return this._dragCoefficient;
    }

    set dragCoefficient(value: number) {
        if (value < 0) { throw new Error("Drag coefficient must be greater than or equal to 0"); }
        this._dragCoefficient = value;
    }

    /**
     * Applies a force to the rigid body. The force will be applied on the next update, by calling the Update method.
     * @param force force to be applied to the rigid body
     * @returns the id of the force
     */
    ApplyForce(force: Vector2): number {
        this._forces[this._forceIndex] = force.copy();
        return this._forceIndex++;
    }

    /**
     * Removes a force from the rigid body.
     * @param forceId id of the force to be removed
     * @returns true if the force was removed, false otherwise
     */
    RemoveForce(forceId: number): boolean {
        if (!Object.keys(this._forces).map(Number).includes(forceId)) { return false; }

        this._forces = Object.entries(this._forces)
            .filter(([id, force]) => Number(id) !== forceId)
            .reduce<Record<number, Vector2>>((obj, [id, force]) => {
            obj[Number(id)] = force;
            return obj;
        }, {});

        return true;
    }

    /**
     * Removes all forces applied the rigid body.
     */
    RemoveForces(): void {
        this._forces = {};
    }

    /**
     * Updates the rigid body simulation.
     * @param deltaTime time elapsed since the last update
     */
    Update(deltaTime: number): void {
        const dragForce = this.velocity.r180deg().scale(this._dragCoefficient);
        const resultingForce = Object.values(this._forces).reduce((acc, force) =>
            acc.add(force), dragForce.copy());

        this.acceleration = resultingForce.scale(1 / this._mass);

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
