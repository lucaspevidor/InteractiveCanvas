import { describe, test, expect, beforeEach } from "vitest";
import { RigidBody1D } from "../../src/Modules/Physics/RigidBody1D";

describe("RigidBody2D", () => {
    let rb: RigidBody1D;

    beforeEach(() => {
        rb = new RigidBody1D();
    });

    test("Instantiate RB", () => {
        expect(rb).toBeInstanceOf(RigidBody1D);
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
        const id = rb.ApplyForce(10);
        expect(rb.RemoveForce(id)).toBeTruthy();
    });

    test("Falling RB without drag", () => {
        rb.ApplyForce(-10);
        rb.Update(1);

        expect(rb.acceleration).toEqual(-10);
        expect(rb.velocity).toEqual(-10);
        expect(rb.position).toEqual(-5);
    });

    test("Apply multiple forces to RB then remove forces", () => {
        rb.ApplyForce(-20);
        rb.ApplyForce(10);

        SimulateRB(rb, 0.1, 10);

        expect(rb.acceleration).toEqual(-10);
        expect(rb.velocity).toEqual(-10);
        expect(rb.position).toBeCloseTo(-5, 0.001);

        rb.RemoveForces();
        SimulateRB(rb, 0.1, 10);

        expect(rb.acceleration).toEqual(0);
        expect(rb.velocity).toEqual(-10);
        expect(rb.position).toBeCloseTo(-15, 0.001);
    });

    test("RB with maxV set to 10 should not exceed 10", () => {
        rb.maxVelocity = 10;
        rb.ApplyForce(-10);

        SimulateRB(rb, 0.1, 20);

        expect(rb.velocity).toEqual(-10);
        expect(rb.position).toBeCloseTo(-15, 0.0001);
    });

    test("RB with maxV set to 10 and drag=0.5 should not exceed 10", () => {
        rb.maxVelocity = 10;
        rb.dragCoefficient = 0.5;
        rb.ApplyForce(-10);

        SimulateRB(rb, 0.01, 200);

        expect(rb.velocity).toEqual(-10);
        expect(rb.position).toBeCloseTo(-13.88, 0.01);
    });

    test("RB with stopV set to 0.01 and drag=3 should stop", () => {
        rb.stopVelocity = 0.01;
        rb.dragCoefficient = 3;
        rb.velocity = 10;

        SimulateRB(rb, 0.1, 20);

        expect(rb.velocity).toEqual(0);
        expect(rb.position).toBeCloseTo(2.83, 0.01);
    });
});

function SimulateRB(rb: RigidBody1D, deltaTime: number, iteractions: number): void {
    for (let i = 0; i < iteractions; i++) {
        rb.Update(deltaTime);
    }
}
