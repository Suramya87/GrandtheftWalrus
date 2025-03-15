class CopsScene extends Phaser.Scene {
    constructor() {
        super("copsScene");
    }

    create() {
        // Get the map and player from other scenes
        const map = this.registry.get('map');
        const player = this.registry.get('player');
        const footpathLayer = this.registry.get('footpathLayer');

        // Store active cops
        this.activeCops = [];
        this.enemySpawns = map.getObjectLayer('COPS').objects;

        // Share cops with other scenes
        this.registry.set('activeCops', this.activeCops);
    }

    spawnCop() {
        const spawnPoint = Phaser.Utils.Array.GetRandom(this.enemySpawns);
        const cop = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'COPS', 0).setScale(0.25);
        cop.setSize(56, 64);
        cop.setCollideWorldBounds(true);
        cop.body.setDrag(200);
        cop.body.setFriction(0.1);
        cop.body.setBounce(2);

        this.physics.add.collider(cop, this.registry.get('footpathLayer'));
        this.physics.add.collider(cop, this.registry.get('player'), () => {
            console.log("Player hit by cop!");
        });

        this.activeCops.push(cop);
    }

    update() {
        const player = this.registry.get('player');
        if (!player) return;

        // Update cop behavior
        this.activeCops.forEach(cop => {
            const targetAngle = Phaser.Math.Angle.Between(cop.x, cop.y, player.x, player.y);
            cop.rotation = Phaser.Math.Angle.RotateTo(cop.rotation, targetAngle, 0.05);
            cop.setVelocity(Math.cos(cop.rotation) * 200, Math.sin(cop.rotation) * 200);
        });
    }
}