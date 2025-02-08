import durotarJSON from "../../../public/assets/durotar.json";
import { Scene } from "phaser";
import { LAYERS, SIZES, SPRITES, TILES } from "../utils/constants";
import { Player } from "../entities/player";
import { Enemy } from "../entities/enemy";

export class Game extends Scene {
    private player: Player;
    private enemies: Phaser.Physics.Arcade.Group;

    constructor() {
        super("Game");
    }

    // Предзагрузка ассетов
    preload() {
        this.load.setPath("assets");
        this.load.image(TILES.DUROTAR, "durotar.png");
        this.load.tilemapTiledJSON("map", "durotar.json");

        this.load.spritesheet(SPRITES.PLAYER, "characters/alliance.png", {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT,
        });
        this.load.spritesheet(SPRITES.ENEMY, "characters/boar.png", {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT,
        });
    }

    create() {
        // Создание карты
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage(
            durotarJSON.tilesets[0].name,
            TILES.DUROTAR,
            SIZES.TILE,
            SIZES.TILE
        );
        // Создание слоев для карты
        const groundLayer =
            tileset && map.createLayer(LAYERS.GROUND, tileset, 0, 0);
        const wallsLayer =
            tileset && map.createLayer(LAYERS.WALLS, tileset, 0, 0);

        // Создание игрока
        this.player = new Player(this, 400, 250, SPRITES.PLAYER);

        // Создание группы для врагов
        this.enemies = this.physics.add.group();

        // Спавн врагов
        this.time.addEvent({
            delay: 100, // Задержка между спавном врагов
            callback: () => {
                const enemy = new Enemy(
                    this,
                    Phaser.Math.Between(
                        this.player.x - 500,
                        this.player.x - 100
                    ),
                    Phaser.Math.Between(
                        this.player.y - 500,
                        this.player.y - 100
                    ) ||
                        Phaser.Math.Between(
                            this.player.y + 100,
                            this.player.y + 500
                        ),
                    SPRITES.ENEMY
                );
                this.enemies.add(enemy);
            },
            loop: true,
        });

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

        wallsLayer && this.physics.add.collider(this.player, wallsLayer);
        wallsLayer?.setCollisionByExclusion([-1]);

        // Пример урона
        this.input.keyboard.on("keydown-D", () => {
            this.player.takeDamage(10); // Уменьшаем здоровье на 10
        });

        // Пример лечения
        this.input.keyboard.on("keydown-H", () => {
            this.player.heal(10); // Увеличиваем здоровье на 10
        });
    }

    update(_: number, delta: number): void {
        this.player?.update(delta);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
