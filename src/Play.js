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
        this.ROTATION_SPEED = 3;
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

        this.load.audio('death', './assets/rumblestripSound.wav'); 

        this.load.image('off', './assets/settingSelector1.png')
        this.load.image('on', './assets/settingSelector2.png')
        this.load.image('back', './assets/asset 11.png')
        this.load.image('X', './assets/Xbutt.png')
        this.load.image('pause', './assets/pause.png')
        this.load.image('offbutton', './assets/selectbuttoff.png')
        this.load.image('onbutton', './assets/selectbutton.png')
        this.load.image('unpause', './assets/unpause.png')
        this.load.image('star', './assets/star.png')


    }

    create() {
        this.scene.setVisible(false, "backgroundScene"); // Hide the background scene
        if (gameSettings.music) {
            gameSettings.music.stop(); // Stops the music
        }


        this.death = this.sound.add('death');
        const map = this.add.tilemap('testJSON');
        const tileset = map.addTilesetImage('temp_test', 'test');
        const bgLayer = map.createLayer('BG',tileset,0,0)
        this.footpathLayer = map.createLayer('Footpath', tileset, 0, 0);
        this.KILLLayer = map.createLayer('KILL', tileset, 0, 0);

        this.footpathLayer.setCollisionByProperty({ collides: true });
        // this.KILLLayer.setCollisionByProperty({ collides: true });

    
        this.enemySpawns = map.getObjectLayer('COPS').objects;

      
        const Walrus_spawn = map.findObject('Spawn', (obj) => obj.name === 'Walrus spawn');
        this.player = this.physics.add.sprite(Walrus_spawn.x, Walrus_spawn.y, 'character', 1).setScale(0.25);
        this.player.body.setCollideWorldBounds(true);
        this.player.setSize(56, 64);
        this.player.body.setBounce(0.1);
        this.player.body.setDrag(200);
        this.player.body.setFriction(-10);
        this.isCooldown = false;
        this.cooldownTime = 2000;

    
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5);
        this.cameras.main.setZoom(3);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        
        this.physics.add.collider(this.player, this.footpathLayer);

      
        this.input.keyboard.on('keydown-P', () => {
            this.spawnCop();
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

 
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
    
        const cop = this.physics.add.sprite(spawnX, spawnY, 'COPS', 0).setScale(0.25).setDepth(10);
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
            this.death.play();
            console.log("get gotten");
        }
    }
    
    

    update() {

        if (!this.player || this.isGameOver) return;

        let forward = new Phaser.Math.Vector2(
            Math.sin(this.player.rotation),
            -Math.cos(this.player.rotation)
        );
    
        let acceleration = 10;  
        let maxSpeed = 500;     
        let deceleration = 0.99; 
        let reverseSpeed = 150;  
        let turnSpeed = 3;      
        let driftFactor = 0.05; 
        
        if (this.spaceKey.isDown){
            acceleration = 0;  
            maxSpeed = 400;     
            deceleration = 0.00000001; 
            reverseSpeed = 150;  
            turnSpeed = 4;      
            driftFactor = 0.96; 

        
    }

        let velocity = new Phaser.Math.Vector2(this.player.body.velocity.x, this.player.body.velocity.y);

        if (this.cursors.up.isDown) {
            velocity.x += forward.x * acceleration;
            velocity.y += forward.y * acceleration;
    
            if (velocity.length() > maxSpeed) {
                velocity.setLength(maxSpeed);
            }
            this.player.play('speed');
        } 
        else if (this.cursors.down.isDown) {
            velocity.x -= forward.x * (acceleration * 1.5);
            velocity.y -= forward.y * (acceleration * 1.5);
    
            if (velocity.length() > reverseSpeed) {
                velocity.setLength(reverseSpeed);
            }
            this.player.play('speed');
        }
        else {
            velocity.scale(deceleration); 
        }
    
        if (this.cursors.left.isDown) {
            this.player.angle -= turnSpeed;
            this.player.play('idle-left');
        } 
        else if (this.cursors.right.isDown) {
            this.player.angle += turnSpeed;
            this.player.play('idle-right');
        }
    
        // drifting velocity
        
        let newForward = new Phaser.Math.Vector2(Math.sin(this.player.rotation),-Math.cos(this.player.rotation));
        velocity.lerp(newForward.scale(velocity.length()), 1 - driftFactor);
    
        this.player.body.velocity.set(velocity.x, velocity.y);
    
        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.play('normal');
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
