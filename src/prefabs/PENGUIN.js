class Penguin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'PENGUIN'); // Use the 'penguin' spritesheet
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up penguin properties
        this.setScale(1);
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setDrag(100);
        this.setFriction(0.1);
        this.setDepth(6);

        // Define animations
        this.createAnimations(scene);

        // Start dancing animation
        this.play('dance');

        // Random movement variables
        this.moveTimer = scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000), // Random delay between 1-3 seconds
            callback: this.changeDirection,
            callbackScope: this,
            loop: true
        });
    }

    createAnimations(scene) {
        // Dancing animation
        scene.anims.create({
            key: 'dance',
            frames: scene.anims.generateFrameNumbers('PENGUIN', {
                start: 0, // Start frame index
                end: 3    // End frame index
            }),
            frameRate: 8, // Frames per second
            repeat: -1    // Loop indefinitely
        });

        // Death animation
        scene.anims.create({
            key: 'death',
            frames: scene.anims.generateFrameNumbers('PENGUIN', {
                start: 4, // Start frame index
                end: 7    // End frame index
            }),
            frameRate: 8, // Frames per second
            repeat: 0     // Do not loop
        });
    }

    changeDirection() {
        const speed = Phaser.Math.Between(50, 150);
        const angle = Phaser.Math.Between(0, 360);
        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        this.updateRotation();
    }

    updateRotation() {
        const angle = Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y);

        // Set the rotation of the penguin
        this.setRotation(angle);
    }

    update() {
        if (this.body && this.body.velocity) {
            this.updateRotation();
        }
    }

    destroyPenguin() {
        // Play death animation
        this.play('death');

        // Destroy the penguin after the animation completes
        this.once('animationcomplete', () => {
            this.moveTimer.destroy(); // Stop the movement timer
            this.destroy(); // Remove the penguin from the scene
        });
    }
}