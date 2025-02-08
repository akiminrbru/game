import durotarJSON from "../../../public/assets/durotar.json";
import { Scene } from "phaser";
import { LAYERS, SIZES, SPRITES, TILES } from "../utils/constants";
import { Player } from "../entities/player";

export class Game extends Scene {
    private player?: Player;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        this.load.image(TILES.DUROTAR, "durotar.png");
        this.load.tilemapTiledJSON("map", "durotar.json");

        this.load.spritesheet(SPRITES.PLAYER, "characters/alliance.png", {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT,
        });
    }

    create() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage(
            durotarJSON.tilesets[0].name,
            TILES.DUROTAR,
            SIZES.TILE,
            SIZES.TILE
        );
        const groundLayer = map.createLayer(LAYERS.GROUND, tileset, 0, 0);
        const wallsLayer = map.createLayer(LAYERS.WALLS, tileset, 0, 0);

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, wallsLayer);
        wallsLayer.setCollisionByExclusion([-1]);
    }

    update(_: number, delta: number): void {
        this.player?.update(delta);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
