class AmmoUI {
    constructor(scene, maxAmmo) {
        this.scene = scene;
        this.maxAmmo = maxAmmo;
        this.ammoUI = [];

        for (let i = 0; i < maxAmmo; i++) {
            let bulletIcon = scene.add.image(450 + i * 20, 600, 'ammo_ui')
                .setScale(0.5)
                .setScrollFactor(0);
            this.ammoUI.push(bulletIcon);
        }
    }

    updateAmmoUI(ammo) {
        this.ammoUI.forEach((icon, index) => {
            if (index < ammo) {
                icon.setVisible(true);
            } else if (icon.visible) {
                let shell = this.scene.add.image(icon.x, icon.y, 'ammo_ui').setScale(0.5);
                shell.setDepth(10);

                let worldPosition = this.scene.cameras.main.getWorldPoint(icon.x, icon.y);
                shell.setPosition(worldPosition.x, worldPosition.y);

                let velocityX = Phaser.Math.Between(-50, 50);
                let velocityY = Phaser.Math.Between(-100, -50);

                this.scene.tweens.add({
                    targets: shell,
                    x: shell.x + velocityX,
                    y: shell.y + velocityY,
                    angle: Phaser.Math.Between(-180, 180),
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => shell.destroy(),
                });

                icon.setVisible(false);
            }
        });
    }
}