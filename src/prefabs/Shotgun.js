class ShotgunScene extends Phaser.Scene {
    constructor() {
        super("shotgunScene");
    }

    create() {
        // Get the player from the PlayerScene
        const player = this.registry.get('player');

        // Initialize shotgun properties
        this.ammo = 5;
        this.maxAmmo = 5;
        this.reloadTime = 2000;
        this.isReloading = false;

        // Share shotgun data with other scenes
        this.registry.set('ammo', this.ammo);
    }

    fireShotgun() {
        if (this.isReloading || this.ammo <= 0) return;

        this.ammo--;
        this.registry.set('ammo', this.ammo);

        const player = this.registry.get('player');
        const targetAngle = Phaser.Math.Angle.Between(player.x, player.y, this.input.activePointer.worldX, this.input.activePointer.worldY);

        // Create bullets
        const bullets = this.physics.add.group();
        for (let i = 0; i < 10; i++) {
            const bullet = bullets.create(player.x, player.y, 'bullet').setScale(0.1);
            bullet.setVelocity(Math.cos(targetAngle) * 600, Math.sin(targetAngle) * 600);
            bullet.setRotation(targetAngle);
        }

        if (this.ammo === 0) this.reload();
    }

    reload() {
        this.isReloading = true;
        this.time.delayedCall(this.reloadTime, () => {
            this.ammo = this.maxAmmo;
            this.registry.set('ammo', this.ammo);
            this.isReloading = false;
        }, [], this);
    }
}