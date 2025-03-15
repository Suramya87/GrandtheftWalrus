class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        // Call the parent class constructor
        super(scene, x, y, texture);

        // Add the player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up player properties
        this.setScale(0.5);
        this.setCircle(32);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(0.1);
        this.body.setDrag(200);
        this.body.setFriction(-10);

        this.isCooldown = false;
        this.cooldownTime = 2000;

        // Add aim cone
        this.aimCone = scene.add.sprite(this.x, this.y, 'cone').setOrigin(0.5, 0.5).setDepth(5).setScale(0.25).setAlpha(0.5);
    }

    update(cursors, keys, spaceKey) {
        let forward = new Phaser.Math.Vector2(Math.sin(this.rotation), -Math.cos(this.rotation));
        let acceleration = 10;
        let maxSpeed = 500;
        let deceleration = 1;
        let reverseSpeed = 150;
        let turnSpeed = 3;
        let driftFactor = 0.05;

        if (spaceKey.isDown) {
            acceleration = 0;
            maxSpeed = 400;
            deceleration = 0.8;
            reverseSpeed = 150;
            turnSpeed = 4;
            driftFactor = 0.96;
        }

        let velocity = new Phaser.Math.Vector2(this.body.velocity.x, this.body.velocity.y);

        if (cursors.up.isDown || keys.up.isDown) {
            velocity.x += forward.x * acceleration;
            velocity.y += forward.y * acceleration;

            if (velocity.length() > maxSpeed) {
                velocity.setLength(maxSpeed);
            }
            this.play('speed');
        } else if (cursors.down.isDown || keys.down.isDown) {
            velocity.x += -forward.x * acceleration;
            velocity.y += -forward.y * acceleration;

            if (velocity.length() > maxSpeed) {
                velocity.setLength(maxSpeed);
            }
            this.play('speed');
        } else {
            velocity.scale(deceleration);
        }

        if (cursors.left.isDown || keys.left.isDown) {
            this.angle -= turnSpeed;
            this.play('idle-left');
        } else if (cursors.right.isDown || keys.right.isDown) {
            this.angle += turnSpeed;
            this.play('idle-right');
        }

        let newForward = new Phaser.Math.Vector2(Math.sin(this.rotation), -Math.cos(this.rotation));
        velocity.lerp(newForward.scale(velocity.length()), 1 - driftFactor);

        this.body.velocity.set(velocity.x, velocity.y);

        if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.play('normal');
        }
    }
}