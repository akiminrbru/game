import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    clickButton: Phaser.GameObjects.Text; // Изменено на clickButton

    constructor() {
        super("GameOver");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        // Получаем размеры экрана
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Создаем текст "Game Over" в центре экрана
        this.clickButton = this.add
            .text(centerX, centerY, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64, // Увеличиваем размер шрифта для лучшей видимости
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5, 0.5) // Устанавливаем точку привязки в центр текста
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => {
                this.changeScene();
            });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}
