import { describe, test, expect, beforeEach } from "vitest";
import { RigidBody2D } from "../../src/Modules/Physics/RigidBody2D";
import { Vector2 } from "../../src/Modules/Physics/Vector2";

describe("RigidBody2D", () => {
    let rb: RigidBody2D;

    beforeEach(() => {
        rb = new RigidBody2D();
    });

    test("Instantiate RB", () => {
        expect(rb).toBeInstanceOf(RigidBody2D);
    });

    test("RB initial max velocity should be negative", () => {
        expect(rb.maxVelocity).toBeLessThan(0);
    });

    test("RB initial stopVelocity should be negative", () => {
        expect(rb.stopVelocity).toBeLessThan(0);
    });

    test("RB initial drag coeff should be 0", () => {
        expect(rb.dragCoefficient).toEqual(0);
    });

    test("RB initial mass should be positive", () => {
        expect(rb.mass).toBeGreaterThan(0);
    });

    // Data validation
    test("RB mass should be greater than 0", () => {
        expect(() => { rb.mass = 0; }).toThrowError("Mass must be greater than 0");
        expect(() => { rb.mass = -1; }).toThrowError("Mass must be greater than 0");
    });

    test("RB drag coeff should be greater than or equal to 0", () => {
        expect(() => { rb.dragCoefficient = -1; })
            .toThrowError("Drag coefficient must be greater than or equal to 0");
    });

    test("Removing invalid force from RB should return false", () => {
        expect(rb.RemoveForce(0)).toBeFalsy();
    });

    test("Removing valid force from RB should return true", () => {
        const id = rb.ApplyForce(new Vector2(0, 0));
        expect(rb.RemoveForce(id)).toBeTruthy();
    });

    test("Falling RB without drag", () => {
        rb.ApplyForce(new Vector2(0, -10));
        rb.Update(1);

        expect(rb.acceleration.angleDeg()).toEqual(-90);
        expect(rb.acceleration.mag()).toEqual(10);
        expect(rb.velocity.angleDeg()).toEqual(-90);
        expect(rb.velocity.mag()).toEqual(10);
        expect(rb.position.angleDeg()).toEqual(-90);
        expect(rb.position.mag()).toEqual(5);
    });

    test("Apply multiple forces to RB then remove forces", () => {
        rb.ApplyForce(new Vector2(0, 10));
        rb.ApplyForce(new Vector2(10, 0));

        SimulateRB(rb, 0.1, 10);

        const mag = 10 * Math.sqrt(2);
        expect(rb.acceleration.angleDeg()).toEqual(45);
        expect(rb.acceleration.mag()).toEqual(mag);
        expect(rb.velocity.angleDeg()).toEqual(45);
        expect(rb.velocity.mag()).toBeCloseTo(mag, 0.0001);
        expect(rb.position.angleDeg()).toEqual(45);
        expect(rb.position.mag()).toBeCloseTo(mag / 2, 0.0001);

        rb.RemoveForces();
        SimulateRB(rb, 0.1, 10);

        expect(rb.acceleration.mag()).toEqual(0);
        expect(rb.velocity.angleDeg()).toEqual(45);
        expect(rb.velocity.mag()).toBeCloseTo(mag, 0.0001);
        expect(rb.position.angleDeg()).toEqual(45);
        expect(rb.position.mag()).toBeCloseTo(15 * Math.sqrt(2), 0.0001);
    });

    test("RB thrown at 45 deg. without drag", () => {
        rb.ApplyForce(new Vector2(0, -10));
        rb.velocity = new Vector2(10, 10);

        SimulateRB(rb, 0.1, 10);

        expect(rb.velocity.mag()).toEqual(10);
        expect(rb.velocity.angle()).toEqual(0);
        expect(rb.position.x).toEqual(10);
        expect(rb.position.y).toEqual(5);

        SimulateRB(rb, 0.1, 10);

        expect(rb.velocity.mag()).toBeCloseTo(10 * Math.sqrt(2), 0.0001);
        expect(rb.velocity.angleDeg()).toEqual(-45);
        expect(rb.position.x).toEqual(20);
        expect(rb.position.y).toBeCloseTo(0, 0.0001);
    });

    test("RB with maxV set to 10 should not exceed 10", () => {
        rb.maxVelocity = 10;
        rb.ApplyForce(new Vector2(0, -10));

        SimulateRB(rb, 0.1, 20);

        expect(rb.velocity.mag()).toEqual(10);
        expect(rb.position.y).toBeCloseTo(-15, 0.0001);
    });

    test("RB with maxV set to 10 and drag=0.5 should not exceed 10", () => {
        rb.maxVelocity = 10;
        rb.dragCoefficient = 0.5;
        rb.ApplyForce(new Vector2(0, -10));

        SimulateRB(rb, 0.01, 200);

        expect(rb.velocity.mag()).toEqual(10);
        expect(rb.position.y).toBeCloseTo(-13.88, 0.01);
    });

    test("RB with stopV set to 0.01 and drag=3 should stop", () => {
        rb.stopVelocity = 0.01;
        rb.dragCoefficient = 3;
        rb.velocity = new Vector2(10, 0);

        SimulateRB(rb, 0.1, 20);

        expect(rb.velocity.mag()).toEqual(0);
        expect(rb.position.x).toBeCloseTo(2.83, 0.01);
    });
});

function SimulateRB(rb: RigidBody2D, deltaTime: number, iteractions: number): void {
    for (let i = 0; i < iteractions; i++) {
        rb.Update(deltaTime);
    }
}
