class PlayerScene extends Phaser.Scene {
    constructor() {
        super("playerScene");
    }

    create() {
        // Get the map and layers from the MapScene
        const map = this.registry.get('map');
        const footpathLayer = this.registry.get('footpathLayer');

        // Spawn the player
        const spawnPoint = map.findObject('Spawn', (obj) => obj.name === 'Walrus spawn');
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'character', 1).setScale(0.25);
        this.player.body.setCollideWorldBounds(true);
        this.player.setSize(48, 48);
        this.player.setCircle(24);
        this.player.body.setBounce(0.1);
        this.player.body.setDrag(200);
        this.player.body.setFriction(-10);

        // Add collisions
        this.physics.add.collider(this.player, footpathLayer);

        // Share the player with other scenes
        this.registry.set('player', this.player);
    }

    update() {
        // Handle player movement and animations
        if (!this.player) return;

        const cursors = this.input.keyboard.createCursorKeys();
        const keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        let velocity = new Phaser.Math.Vector2(this.player.body.velocity.x, this.player.body.velocity.y);
        let forward = new Phaser.Math.Vector2(Math.sin(this.player.rotation), -Math.cos(this.player.rotation));

        if (cursors.up.isDown || keys.up.isDown) {
            velocity.x += forward.x * 10;
            velocity.y += forward.y * 10;
            this.player.play('speed');
        } else if (cursors.down.isDown || keys.down.isDown) {
            velocity.x -= forward.x * 10;
            velocity.y -= forward.y * 10;
            this.player.play('speed');
        } else {
            velocity.scale(0.95); // Deceleration
        }

        if (cursors.left.isDown || keys.left.isDown) {
            this.player.angle -= 3;
            this.player.play('idle-left');
        } else if (cursors.right.isDown || keys.right.isDown) {
            this.player.angle += 3;
            this.player.play('idle-right');
        }

        this.player.body.velocity.set(velocity.x, velocity.y);
    }
}