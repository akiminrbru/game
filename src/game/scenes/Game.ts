import { Scene } from "phaser";
import { SIZES, SPRITES } from "../utils/constants";
import { Player } from "../entities/player";

export class Game extends Scene {
    private player?: Player;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        this.load.spritesheet(SPRITES.PLAYER, "characters/alliance.png", {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT,
        });
    }

    create() {
        // const map = this.make.tilemap({ key: "map" });

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);

        // this.cameras.main.startFollow(this.player);
        // this.cameras.main.setBounds(
        //     0,
        //     0,
        //     map.widthInPixels,
        //     map.heightInPixels
        // );

        // this.physics.world.setBounds(
        //     0,
        //     0,
        //     map.widthInPixels,
        //     map.heightInPixels
        // );
        // this.player.setCollideWorldBounds(true);
    }

    update(_: number, delta: number): void {
        this.player?.update(delta);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
