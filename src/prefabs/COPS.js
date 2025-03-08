class COPS extends Phaser.Scene {
    constructor() {
        super("DA_POLICE");
    }

    // init(data) {
    //     this.player = data.player;
    //     this.CHASE_VELOCITY = data.CHASE_VELOCITY;
    //     this.followerSpeed = data.followerSpeed;
    //     this.activeCops = [];
    // }

    init(data) {
        this.player = data.player;
        this.CHASE_VELOCITY = data.CHASE_VELOCITY;
        this.followerSpeed = data.followerSpeed;
        this.enemySpawns = data.enemySpawns || []; // Receive spawn points
        this.activeCops = [];
    }

    create() {
        // Load the tilemap ONCE in create()
        this.map = this.scene.get('playScene').make.tilemap({ key: 'testJSON' });
        this.footpathLayer = this.map.getLayer('Footpath').tilemapLayer; // Get footpath layer

        
        // Define animations for cops
        this.anims.create({
            key: 'chillin',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('COPS', { start: 0, end: 0 })
        });

        this.anims.create({
            key: 'not-chillin',
            frameRate: 15,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('COPS', { start: 1, end: 4 })
        });

        this.anims.create({
            key: 'imma-head-out',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('COPS', { start: 5, end: 5 })
        });
    }

    // addCop() {
    //     let playScene = this.scene.get('playScene');
    
    //     // Find the spawn point for the cops
    //     const cop_spawn = this.map.findObject('COPS', (obj) => obj.name === 'One');
    
    //     if (!cop_spawn) {
    //         console.warn("Cop spawn point not found!");
    //         return;
    //     }
    
    //     // Directly use the object's world coordinates from Tiled
    //     let spawnX = cop_spawn.x;
    //     let spawnY = cop_spawn.y;
    
    //     // Apply a small random offset to prevent stacking
    //     spawnX += Phaser.Math.Between(-10, 10);
    //     spawnY += Phaser.Math.Between(-10, 10);
    
    //     console.log(`Cop spawned at: (${spawnX}, ${spawnY})`);
    
    //     // Create cop sprite
    //     const cop = this.physics.add.sprite(spawnX, spawnY, 'COPS', 0).setScale(0.5).setDepth(10);
    //     cop.setSize(56, 64);
    //     cop.setAngle(Phaser.Math.Between(0, 360));
    
    //     // Ensure cops are within world bounds
    //     cop.setCollideWorldBounds(true);
    
    //     // Add collision with footpath layer
    //     this.physics.add.collider(cop, this.footpathLayer);
    
    //     // Add collision with player
    //     this.physics.add.collider(cop, this.player, () => {
    //         console.log("Player caught by cop!");
    //         if (playScene.LANES) {
    //             playScene.gameOver();
    //         }
    //     });
    
    //     // Add collision between cops
    //     this.activeCops.forEach(otherCop => {
    //         this.physics.add.collider(cop, otherCop);
    //     });
    
    //     this.activeCops.push(cop);
    // }
    addCop() {
        let playScene = this.scene.get('playScene');

        // Apply a small random offset to prevent stacking
        // spawnX += Phaser.Math.Between(-10, 10);
        // spawnY += Phaser.Math.Between(-10, 10);
        const zoom = this.cameras.main.zoom;
        console.log(zoom)
        const adjustedX = this.enemySpawns.x  // Adjust for camera zoom
        const adjustedY = this.enemySpawns.y ; // Adjust for camera zoom

        console.log(`Cop spawned at: (${adjustedX}, ${adjustedY})`);

        // Create cop sprite
        const cop = this.physics.add.sprite(adjustedX, adjustedY, 'COPS', 0).setScale(1).setDepth(10);
        cop.setSize(56, 64);
        cop.setAngle(Phaser.Math.Between(0, 360));

        // Ensure cops are within world bounds
        cop.setCollideWorldBounds(true);

        // Add collision with footpath layer
        this.physics.add.collider(cop, this.footpathLayer);

        // Add collision with player
        this.physics.add.collider(cop, this.player, () => {
            console.log("Player caught by cop!");
            if (playScene.LANES) {
                playScene.gameOver();
            }
        });
        console.log(this.activeCops)

        // Add collision between cops
        this.activeCops.forEach(otherCop => {
            this.physics.add.collider(cop, otherCop);
        });

        this.activeCops.push(cop);
    }
    

    update() {
        for (let i = this.activeCops.length - 1; i >= 0; i--) {
            const cop = this.activeCops[i];

            if (!this.player) continue;

            // Calculate movement direction like the player
            let targetAngle = Phaser.Math.Angle.Between(cop.x, cop.y, this.player.x, this.player.y);
            cop.rotation = Phaser.Math.Angle.RotateTo(cop.rotation, targetAngle, 0.05); // Smooth turn

            // Move forward in the direction the cop is facing
            const speed = this.CHASE_VELOCITY;
            cop.setVelocity(Math.cos(cop.rotation) * speed, Math.sin(cop.rotation) * speed);

            cop.play('not-chillin');

            // Remove cops that go off-screen
            // if (cop.y > this.map.heightInPixels + 100) {
                // console.log('Cop removed');
                // cop.destroy();
                // this.activeCops.splice(i, 1);
            // }
        }
    }
}
