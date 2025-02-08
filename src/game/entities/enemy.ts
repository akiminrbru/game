import { Entity } from "./entity";
import { Player } from "./player";

export class Enemy extends Entity {
    private isDead: boolean;
    private moveSpeed = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }

    followToPlayer(player: Player) {
        this.scene.physics.moveToObject(this, player, 100, this.moveSpeed);
    }

    update() {}
}
