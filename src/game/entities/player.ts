// import { SPRITES } from "../utils/constants";
import { PLAYER_HEALTH } from "../utils/constants";
import { Entity } from "./entity";

export class Player extends Entity {
    textureKey: string;
    private moveSpeed: number;
    private health: number;
    private maxHealth: number;
    private healthBar: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.health = PLAYER_HEALTH.HEALTH; // Начальное здоровье
        this.maxHealth = PLAYER_HEALTH.MAX_HEALTH; // Максимальное здоровье

        this.healthBar = scene.add.graphics();

        this.drawHealthBar();

        const anims = this.scene.anims;
        const animsFrameRate = 9;
        this.textureKey = texture;
        this.moveSpeed = 50;
        this.setSize(28, 32);
        this.setOffset(10, 16);
        this.setScale(0.8);

        anims.create({
            key: "down",
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 2,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: "left",
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 12,
                end: 14,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: "right",
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 24,
                end: 26,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: "up",
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 36,
                end: 38,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });
    }

    private drawHealthBar(): void {
        // Очищаем предыдущую графику
        this.healthBar.clear();

        // Рисуем фоновую полоску здоровья
        this.healthBar.fillStyle(0x000000); // Черный цвет
        this.healthBar.fillRect(this.x - 50, this.y + 30, 100, 10); // Позиция и размер

        // Рисуем текущую полоску здоровья
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.fillStyle(0xff0000); // Красный цвет
        this.healthBar.fillRect(
            this.x - 50,
            this.y + 30,
            100 * healthPercent,
            10
        ); // Позиция и размер
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        this.drawHealthBar(); // Обновляем полоску здоровья
    }

    public heal(amount: number): void {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        this.drawHealthBar(); // Обновляем полоску здоровья
    }
    update(delta: number) {
        const keys = this.scene.input.keyboard?.createCursorKeys();
        const wKey = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );
        const aKey = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        const sKey = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        const dKey = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        // Инициализация переменных для скорости
        let velocityX = 0;
        let velocityY = 0;
        let isMoving = false;
        let currentAnimation = "";

        // Перемещение вверх
        if (keys?.up.isDown || wKey.isDown) {
            velocityY = -delta * this.moveSpeed;
        }

        // Перемещение вниз
        if (keys?.down.isDown || sKey.isDown) {
            velocityY = delta * this.moveSpeed;
        }

        // Перемещение влево
        if (keys?.left.isDown || aKey.isDown) {
            velocityX = -delta * this.moveSpeed;
        }

        // Перемещение вправо
        if (keys?.right.isDown || dKey.isDown) {
            velocityX = delta * this.moveSpeed;
        }

        // Нормализация скорости для предотвращения увеличения скорости при диагональном движении
        const totalVelocity = Math.sqrt(
            velocityX * velocityX + velocityY * velocityY
        );
        if (totalVelocity > this.moveSpeed) {
            velocityX = (velocityX / totalVelocity) * this.moveSpeed;
            velocityY = (velocityY / totalVelocity) * this.moveSpeed;
        }

        // Установка анимации в зависимости от направления
        if (velocityX !== 0 || velocityY !== 0) {
            isMoving = true; // Устанавливаем состояние движения

            if (velocityX < 0) {
                this.play("left", true);
                currentAnimation = "left";
            } else if (velocityX > 0) {
                this.play("right", true);
                currentAnimation = "right";
            } else if (velocityY < 0) {
                this.play("up", true);
                currentAnimation = "up";
            } else if (velocityY > 0) {
                this.play("down", true);
                currentAnimation = "down";
            }
        } else {
            this.stop();
            isMoving = false; // Сброс состояния движения
            currentAnimation = ""; // Сброс текущей анимации
        }

        // Установка скорости
        this.setVelocity(velocityX * 5, velocityY * 5);

        // Отрисовка полосы здоровья
        this.drawHealthBar();
    }
}
