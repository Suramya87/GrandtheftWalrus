class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init() {
        this.SPEED_MULTIPLIER = 1;
        this.PLAYER_VELOCITY = 350;
        this.followerSpeed = 100 / this.SPEED_MULTIPLIER;
        this.CHASE_VELOCITY = 200 / this.SPEED_MULTIPLIER;
        this.player_isTouching = false;
        this.player_isTurning = false;
        this.ROTATION_SPEED = 2;
        this.LANES = false;
        this.timeSurvived = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.isGameOver = false;

        this.activeCops = []; // Store cops in the same scene
    }

    preload() {
        this.load.spritesheet('character', './assets/testcar2.png', { frameWidth: 128 });
        this.load.image('test', './assets/kidnap.png');
        this.load.tilemapTiledJSON('testJSON', './assets/temp_test.json');
        this.load.spritesheet('COPS', './assets/POLICE2.png', { frameWidth: 100 });
    }

    create() {
        const map = this.add.tilemap('testJSON');
        const tileset = map.addTilesetImage('temp_test', 'test');
        const bgLayer = map.createLayer('BG',tileset,0,0)
        this.footpathLayer = map.createLayer('Footpath', tileset, 0, 0);
        this.KILLLayer = map.createLayer('KILL', tileset, 0, 0);

        this.footpathLayer.setCollisionByProperty({ collides: true });
        this.KILLLayer.setCollisionByProperty({ collides: true });

    
        this.enemySpawns = map.getObjectLayer('COPS').objects;

      
        const Walrus_spawn = map.findObject('Spawn', (obj) => obj.name === 'Walrus spawn');
        this.player = this.physics.add.sprite(Walrus_spawn.x, Walrus_spawn.y, 'character', 1).setScale(0.5);
        this.player.body.setCollideWorldBounds(true);
        this.player.setSize(56, 64);
        this.player.body.setBounce(2);
        this.isCooldown = false;
        this.cooldownTime = 2000;

    
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5);
        this.cameras.main.setZoom(3);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        
        this.physics.add.collider(this.player, this.footpathLayer);

      
        this.input.keyboard.on('keydown-SPACE', () => {
            this.spawnCop();
        });

 
        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'normal',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 0
            })
        });

        this.anims.create({
            key: 'speed',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('character', {
                start: 1,
                end: 1
            })
        });

        this.anims.create({
            key: 'idle-left',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('character', {
                start: 2,
                end: 2
            })
        });

        this.anims.create({
            key: 'idle-right',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('character', {
                start: 3,
                end: 3
            })
        });
        // Create cop animations
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

    spawnCop() {
        if (this.enemySpawns.length === 0) {
            console.warn("No police");
            return;
        }
    
        const spawnPoint = Phaser.Utils.Array.GetRandom(this.enemySpawns);
        const spawnX = spawnPoint.x + Phaser.Math.Between(-10, 10);
        const spawnY = spawnPoint.y + Phaser.Math.Between(-10, 10);
    
        console.log(`WOOPWOOP: (${spawnX}, ${spawnY})`);
    
        const cop = this.physics.add.sprite(spawnX, spawnY, 'COPS', 0).setScale(0.5).setDepth(10);
        cop.setSize(56, 64);
        cop.setAngle(Phaser.Math.Between(0, 360));
        cop.setCollideWorldBounds(true);
        cop.body.setDrag(200);
        cop.body.setFriction(0.1);
    
        this.physics.add.collider(cop, this.footpathLayer, () => {
            console.log("BOOP");
        });
        
        // Add collision between cop and KILL layer
        this.physics.add.collider(cop, this.KILLLayer, () => {
            this.destroyCop(cop);
        });
    
        this.physics.add.collider(cop, this.player, () => {
            console.log("Get rekt");
            if (this.LANES) {
                this.gameOver();
            }
        });
    
        this.activeCops.forEach(otherCop => {
            this.physics.add.collider(cop, otherCop);
        });
    
        this.activeCops.push(cop);
    }

    destroyCop(cop) {
        if (cop && cop.active) {
            const index = this.activeCops.indexOf(cop);
            if (index > -1) {
                this.activeCops.splice(index, 1); // Remove from array
            }
            cop.destroy(); // Destroy sprite
            console.log("Cop eliminated!");
        }
    }
    
    

    update() {
        //player
        if (!this.player.destroyed) {
            let playerVelocity = new Phaser.Math.Vector2(0, 0);

            if (this.cursors.up.isDown) {
                this.SPEED_MULTIPLIER = 2;
                playerVelocity.y = -Math.cos(this.player.rotation) * this.PLAYER_VELOCITY;
                playerVelocity.x = Math.sin(this.player.rotation) * this.PLAYER_VELOCITY;
                this.player.play('speed');

            } else if (this.cursors.down.isDown) {
                this.SPEED_MULTIPLIER = 0.5;
                playerVelocity.y = Math.cos(this.player.rotation) * (this.PLAYER_VELOCITY * 0.5);
                playerVelocity.x = -Math.sin(this.player.rotation) * (this.PLAYER_VELOCITY * 0.5);
                this.player.play('speed');
            }

            if (this.cursors.left.isDown) {
                this.player.angle -= this.ROTATION_SPEED;
                this.player.play('idle-left');
            } else if (this.cursors.right.isDown) {
                this.player.angle += this.ROTATION_SPEED;
                this.player.play('idle-right');
            }

            if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
                this.player_isTurning = false;
                this.player.play('normal');
            }


            this.player.setVelocity(playerVelocity.x, playerVelocity.y);
        }


        for (let i = this.activeCops.length - 1; i >= 0; i--) {
            const cop = this.activeCops[i];

            if (!this.player) continue;

            let targetAngle = Phaser.Math.Angle.Between(cop.x, cop.y, this.player.x, this.player.y);
            //dumbass cops at the moment but they will be breaking ankles at 5 stars
            cop.rotation = Phaser.Math.Angle.RotateTo(cop.rotation, targetAngle, 0.013);

            const speed = this.CHASE_VELOCITY;
            cop.setVelocity(Math.cos(cop.rotation) * speed, Math.sin(cop.rotation) * speed);

            cop.play('not-chillin');
        }
    }
}
