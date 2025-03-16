export default class Cop extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add the cop to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Initialize cop properties
        this.setScale(0.25).setDepth(10).setAngle(60);
        this.setSize(56, 64);
        this.setCollideWorldBounds(true);
        this.body.setDrag(200);
        this.body.setFriction(0.1);
        this.body.setBounce(2);

        // Animation
        this.play('chillin');

        // Timers
        this.lastTurnTime = 0;
    }

    update(player, starLevel, CHASE_VELOCITY) {
        if (!player) return;

        // Update cop behavior
        if (!this.lastTurnTime || this.scene.time.now > this.lastTurnTime + (50 / (starLevel + 1))) {
            let targetAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
            this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, targetAngle, 0.05 * starLevel + 0.01);
            this.lastTurnTime = this.scene.time.now;
        }

        const speed = CHASE_VELOCITY + (CHASE_VELOCITY * (starLevel / 20));
        this.setVelocity(Math.cos(this.rotation) * speed, Math.sin(this.rotation) * speed);

        this.play('not-chillin');
    }
}