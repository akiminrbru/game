import { Entity } from "./entity";

export class Enemy extends Entity {
    private isDead: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }

    update() {}
}
