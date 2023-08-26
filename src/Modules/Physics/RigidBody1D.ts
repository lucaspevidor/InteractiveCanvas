/**
 * @class RigidBody1D
 * @description A class responsible for simulating a 1D rigid body.
 * @property {number} position The position of the rigid body.
 * @property {number} velocity The velocity of the rigid body.
 * @property {number} acceleration The acceleration of the rigid body.
 * @property {number} maxVelocity A limit for the velocity of the rigid body.
 * @property {number} stopVelocity A tolerance, in which the rigid body will stop moving.
 *
 * @example
 * const rb = new RigidBody2D();
 * rb.mass = 10;
 *
 * const f = 10;
 * rb.ApplyForce(f);
 *
 * rb.Update(1);
 */
export class RigidBody1D {
    public position = 0;
    public velocity = 0;
    public acceleration = 0;
    public maxVelocity = -1;
    public stopVelocity = -1;

    private _forces: Record<number, number> = {};
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
    ApplyForce(force: number): number {
        this._forces[this._forceIndex] = force;
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
            .reduce<Record<number, number>>((obj, [id, force]) => {
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
        const dragForce = this.velocity * (-1) * this.dragCoefficient;
        const resultingForce = Object.values(this._forces).reduce((acc, force) =>
            acc + force, dragForce);

        this.acceleration = resultingForce / this._mass;

        const prevVelocity = this.velocity;
        this.velocity = this.velocity + this.acceleration * deltaTime;

        if (this.maxVelocity >= 0) {
            if (Math.abs(this.velocity) > this.maxVelocity) {
                this.velocity = this.maxVelocity * Math.sign(this.velocity);
            }
        }

        if (this.stopVelocity >= 0) {
            if (Math.abs(this.velocity) < this.stopVelocity) {
                this.velocity = 0;
            }
        }

        this.position = this.position + (this.velocity + prevVelocity) * deltaTime / 2;
    }
}
