import mapJSON from "../../../public/assets/map.json";
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
        this.load.image(TILES.MAP, "map.png");
        this.load.tilemapTiledJSON("map", "map.json");

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
            mapJSON.tilesets[0].name,
            TILES.MAP,
            SIZES.TILE,
            SIZES.TILE
        );
        // Создание слоев для карты
        const groundLayer = map.createLayer(LAYERS.GROUND, tileset, 0, 0);
        const wallsLayer = map.createLayer(LAYERS.WALLS, tileset, 0, 0);

        // Создание игрока
        this.player = new Player(this, 450, 250, SPRITES.PLAYER);

        // Создание группы для врагов
        this.enemies = this.physics.add.group();

        // Спавн врагов
        this.time.addEvent({
            delay: 1000, // Задержка между спавном врагов
            callback: () => {
                // Получаем позицию игрока
                const playerX = this.player.x; // Предполагается, что у вас есть объект player
                const playerY = this.player.y;

                // Генерируем случайные координаты вокруг игрока в радиусе от 300 до 600 пикселей
                const angle = Phaser.Math.FloatBetween(0, Math.PI * 2); // Случайный угол
                const radius = Phaser.Math.Between(300, 600); // Радиус спавна
                const enemyX = playerX + Math.cos(angle) * radius;
                const enemyY = playerY + Math.sin(angle) * radius;

                const enemy = new Enemy(this, enemyX, enemyY, SPRITES.ENEMY);
                enemy.setBounce(1);
                enemy.setCollideWorldBounds(true);
                // Чтобы враг не проходил сквозь стены
                this.physics.add.collider(enemy, wallsLayer);
                this.enemies.add(enemy);
            },
            loop: true,
        });

        this.physics.add.collider(this.player, this.enemies, () => {
            this.player.takeDamage(10);
        });

        // Чтобы камера следила за игроком
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
        // Чтобы игрок не заходил за границы мира
        this.player.setCollideWorldBounds(true);

        // Чтобы игрок не проходил сквозь стены
        this.physics.add.collider(this.player, wallsLayer);

        wallsLayer.setCollisionByExclusion([-1]);

        // Пример лечения
        this.input.keyboard.on("keydown-H", () => {
            this.player.heal(10); // Увеличиваем здоровье на 10
        });
    }

    update(_: number, delta: number): void {
        const player = this.player;
        player.update(delta);
        this.enemies.children.iterate((enemy) => {
            this.physics.moveToObject(enemy, player, 100);
        }, this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    // Определени дистанции между игроков и врагом
    // const distanceToPlayer = Phaser.Math.Distance.Between(x,y,x , y)
}
