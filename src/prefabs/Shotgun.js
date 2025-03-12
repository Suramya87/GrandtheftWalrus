class Shotgun {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.ammo = 5;
        this.isReloading = false;
        this.reloadTime = 2000; // 2 seconds
    }

    fire() {
        if (this.ammo <= 0 || this.isReloading) {
            return;
        }

        this.ammo--;
        console.log("Shot fired! Ammo left:", this.ammo);

        // Fire a spread of pellets
        for (let i = 0; i < 5; i++) {
            const angleOffset = Phaser.Math.Between(-15, 15);
            const bulletAngle = this.player.rotation + Phaser.Math.DegToRad(angleOffset);

            const bullet = this.scene.physics.add.sprite(
                this.player.x, 
                this.player.y, 
                'bullet' // Replace with your bullet sprite
            );

            this.scene.physics.velocityFromRotation(bulletAngle, 500, bullet.body.velocity);
            bullet.setScale(0.1);
            this.scene.time.delayedCall(1000, () => bullet.destroy()); // Remove after 1 sec
        }

        if (this.ammo === 0) {
            this.reload();
        }
    }

    reload() {
        if (this.isReloading) return;

        console.log("Reloading...");
        this.isReloading = true;
        this.scene.time.delayedCall(this.reloadTime, () => {
            this.ammo = 5;
            this.isReloading = false;
            console.log("Reloaded!");
        });
    }
}
