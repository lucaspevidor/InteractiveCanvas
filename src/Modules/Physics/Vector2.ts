export class Vector2 {
    constructor(
        public x: number,
        public y: number
    ) {};

    public static unit(): Vector2 {
        return new Vector2(1, 0);
    }

    public static zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public add(other: Vector2): Vector2;
    public add(x: number, y: number): Vector2;
    public add(arg1: Vector2 | number, arg2?: number): Vector2 {
        if (arg1 instanceof Vector2) {
            return new Vector2(this.x + arg1.x, this.y + arg1.y);
        } else if (typeof arg1 === "number" && typeof arg2 === "number") {
            return new Vector2(this.x + arg1, this.y + arg2);
        } else {
            throw new Error("Invalid arguments");
        }
    }

    public subtract(other: Vector2): Vector2;
    public subtract(x: number, y: number): Vector2;
    public subtract(a1: Vector2 | number, a2?: number): Vector2 {
        if (a1 instanceof Vector2) {
            return new Vector2(this.x - a1.x, this.y - a1.y);
        } else if (typeof a1 === "number" && typeof a2 === "number") {
            return new Vector2(this.x - a1, this.y - a2);
        } else {
            throw new Error("Invalid arguments");
        }
    }

    public multiply(other: Vector2): Vector2 {
        const mag = this.mag() * other.mag();
        const angle = this.angle() + other.angle();

        const y = Math.sin(angle) * mag;
        const x = Math.cos(angle) * mag;

        return new Vector2(x, y);
    }

    public divide(other: Vector2): Vector2 {
        const mag = this.mag() / other.mag();
        const angle = this.angle() - other.angle();

        const y = Math.sin(angle) * mag;
        const x = Math.cos(angle) * mag;

        return new Vector2(x, y);
    }

    public scale(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor);
    }

    public isEqual(other: Vector2): boolean {
        return (
            Math.abs(this.x - other.x) < 0.001 &&
            Math.abs(this.y - other.y) < 0.001
        );
    }

    public mag(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public angle(): number {
        return Math.atan(this.y / this.x);
    }

    public angleDeg(): number {
        return this.angle() * 180 / Math.PI;
    }

    public normalize(): Vector2 {
        const mag = this.mag();
        return new Vector2(this.x / mag, this.y / mag);
    }

    public r90deg(): Vector2 {
        return new Vector2(-this.y, this.x);
    }

    public r180deg(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    public r270deg(): Vector2 {
        return new Vector2(this.y, -this.x);
    }

    public copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}
