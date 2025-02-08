import { Game, GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "background");

        EventBus.emit("current-scene-ready", this);

        // Вычисляем центр холста
        const centerX = this.cameras.main.centerX; // Центр по оси X
        const centerY = this.cameras.main.centerY; // Центр по оси Y

        // Создаем текст "Best RougLIKE" чуть выше центра
        this.titleText = this.add
            .text(centerX, centerY - 50, "Best RougLIKE", {
                // Сдвигаем на 50 пикселей вверх
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5, 0.5); // Устанавливаем точку привязки в центр текста

        // Создаем текст "Start Game" чуть ниже центра
        this.clickButton = this.add
            .text(centerX, centerY + 50, "Start Game", {
                // Сдвигаем на 50 пикселей вниз
                fontFamily: "Arial Black",
                fontSize: 38,
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
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");
    }

    // moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
    //     if (this.logoTween) {
    //         if (this.logoTween.isPlaying()) {
    //             this.logoTween.pause();
    //         } else {
    //             this.logoTween.play();
    //         }
    //     } else {
    //         this.logoTween = this.tweens.add({
    //             targets: this.logo,
    //             x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
    //             y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
    //             yoyo: true,
    //             repeat: -1,
    //             onUpdate: () => {
    //                 if (vueCallback) {
    //                     vueCallback({
    //                         x: Math.floor(this.logo.x),
    //                         y: Math.floor(this.logo.y),
    //                     });
    //                 }
    //             },
    //         });
    //     }
    // }
    moveTitleText(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.titleTextTween) {
            if (this.titleTextTween.isPlaying()) {
                this.titleTextTween.pause();
            } else {
                this.titleTextTween.play();
            }
        } else {
            this.titleTextTween = this.tweens.add({
                targets: this.titleText, // Изменено на titleText
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.titleText.x), // Изменено на titleText
                            y: Math.floor(this.titleText.y), // Изменено на titleText
                        });
                    }
                },
            });
        }
    }
}
