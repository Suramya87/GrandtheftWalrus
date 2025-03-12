
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
        this.ammo = 5;
        this.maxAmmo = 5;
        this.reloadTime = 2000;
        this.isReloading = false;
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
        this.load.image('smoke', './assets/smoke.png')
        this.load.image('bullet', './assets/bullet.png');
        this.load.image('ammo_ui', './assets/shotgunshell.png');


    }

    create() {
        // this.bullets = this.physics.add.group({
        //     classType: Phaser.Physics.Arcade.Image,
        //     runChildUpdate: true // This ensures child objects (bullets) are updated in the physics world
        // });
        this.scene.setVisible(false, "backgroundScene"); // Hide the background scene
        if (gameSettings.music) {
            gameSettings.music.stop(); // Stops the music
        }

        // TILES
        this.death = this.sound.add('death');
        const map = this.add.tilemap('testJSON');
        const tileset = map.addTilesetImage('temp_test', 'test');
        const bgLayer = map.createLayer('BG',tileset,0,0)
        this.footpathLayer = map.createLayer('Footpath', tileset, 0, 0);
        this.KILLLayer = map.createLayer('KILL', tileset, 0, 0);

        this.footpathLayer.setCollisionByProperty({ collides: true });
        // this.KILLLayer.setCollisionByProperty({ collides: true });

        // COPS
        this.enemySpawns = map.getObjectLayer('COPS').objects;

        // Player shit
        const Walrus_spawn = map.findObject('Spawn', (obj) => obj.name === 'Walrus spawn');
        this.player = this.physics.add.sprite(Walrus_spawn.x, Walrus_spawn.y, 'character', 1).setScale(0.25);
        this.player.body.setCollideWorldBounds(true);
        this.player.setSize(48, 48);
        this.player.setCircle(24);
        this.player.body.setBounce(0.1);
        this.player.body.setDrag(200);
        this.player.body.setFriction(-10);
        this.isCooldown = false;
        this.cooldownTime = 2000;

        //Carmera shit
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5);
        this.cameras.main.setZoom(1);

        this.input.keyboard.on('keydown-Z', () => {
            this.cameras.main.setZoom(this.cameras.main.zoom === 1 ? 3 : 1);
        });

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // NEUUUUUUU
        this.physics.add.collider(this.player, this.footpathLayer);

        this.driftParticles = this.add.particles(0, 0, 'smoke', {
            speed: { min: 10, max: 50 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 500,
            frequency: 10,
            blendMode: 'ADD'
        });
    
        this.driftParticles.setDepth(5);
        this.driftParticles.setScrollFactor(1);
        this.driftParticles.stop();

        this.input.keyboard.on('keydown-O', () => {
            if (this.starLevel < this.maxStars) {
                this.starLevel++;
                this.updateStars();
            }
        });

        this.input.keyboard.on('keydown-I', () => {
            if (this.starLevel > 1) {
                this.starLevel--;
                this.updateStars();
            }
        });
        this.input.keyboard.on('keydown-P', () => {
            // this.starLevel++;
            this.spawnCop();
        });

        this.input.keyboard.on('keydown-X', () => this.fireShotgun());
        this.input.keyboard.on('keydown-T', () => this.toggleAutoAim()); // Toggle auto-aim
        this.createAmmoUI();

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

        this.startTime = this.time.now;  
        this.starLevel = 1;  
        this.maxStars = 7;   
        this.starUpdateTime = 5000; 
    
        // Get camera viewport size considering zoom
    
        // UI elements (scaled & positioned for zoom)
        this.timerText = this.add.text(435, 350, 'Time: 0s', { 
            fontSize: '18px', 
            fill: '#fff' 
        }).setScrollFactor(0).setDepth(100);
    
        this.starGroup = this.add.group();
        this.updateStars();
        console.log(this.bullets)

        // this.physics.add.collider(this.activeCops, this.bullets, (cop, bullet) => {
        //     this.destroyCop(cop); 
        //     bullet.destroy(); 
        //     console.log("sdfgh")
        // });

    }

    toggleAutoAim() {
        console.log(this.autoAim)
        this.autoAim = !this.autoAim;
        console.log("Auto-Aim: " + (this.autoAim ? "Enabled" : "Disabled"));
    }

    createAmmoUI() {
        this.ammoUI = [];
        for (let i = 0; i < this.maxAmmo; i++) {
            let bulletIcon = this.add.image(450 + i * 20, 600, 'ammo_ui')
                .setScale(0.5)
                .setScrollFactor(0);
            this.ammoUI.push(bulletIcon);
        }
    }

    fireShotgun() {

        if (this.isReloading || this.ammo <= 0) return;

        this.ammo--;
        this.updateAmmoUI();

        let numPellets = 7;
        let spreadAngle = 20;
        let targetAngle = this.player.rotation;

        if (this.autoAim) {
            let nearestCop = this.getNearestCop();
            if (nearestCop) {
                targetAngle = Phaser.Math.Angle.Between(
                    this.player.x, this.player.y,
                    nearestCop.x, nearestCop.y
                );
            }
        } else {
            let pointer = this.input.activePointer;
            let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            targetAngle = Phaser.Math.Angle.Between(
                this.player.x, this.player.y,
                worldPoint.x, worldPoint.y
            );
        }

        this.bullets = this.physics.add.group();
        console.log(this.bullets)

        // https://www.reddit.com/r/gamemaker/comments/msdfc3/how_to_make_bullets_with_automatic_spread/
        // I had to credit this because this was the only method I was able to get working for the shot spread 
        // Was super helpful
        for (let i = 0; i < numPellets; i++) {
            let angleOffset = Phaser.Math.Between(-spreadAngle, spreadAngle);
            let bulletAngle = targetAngle + Phaser.Math.DegToRad(angleOffset);
            let velocity = new Phaser.Math.Vector2(Math.cos(bulletAngle), Math.sin(bulletAngle)).scale(600);

            let bullet = this.bullets.create(this.player.x, this.player.y, 'bullet').setScale(0.1);
            bullet.setVelocity(velocity.x, velocity.y);
            bullet.setRotation(bulletAngle);
            bullet.setDepth(5); // Ensure it's in front of the player

            this.time.delayedCall(250, () => bullet.destroy(), [], this);
        }

        if (this.ammo === 0) {
            this.reload();
        }

        this.physics.add.collider(this.activeCops, this.bullets, (cop, bullet) => {
            this.destroyCop(cop); // Handle cop destruction
            bullet.destroy(); // Destroy the bullet
            console.log("sdfgh")
        });
    }

    getNearestCop() {
        let nearestCop = null;
        let shortestDistance = Infinity;

        this.activeCops.forEach(cop => {
            let distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                cop.x, cop.y
            );
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestCop = cop;
            }
        });

        return nearestCop;
    }

    updateAmmoUI() {
        this.ammoUI.forEach((icon, index) => {
            icon.setVisible(index < this.ammo);
        });
    }

    reload() {
        this.isReloading = true;
        this.time.delayedCall(this.reloadTime, () => {
            this.ammo = this.maxAmmo;
            this.updateAmmoUI();
            this.isReloading = false;
        }, [], this);
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
    
        const cop = this.physics.add.sprite(spawnX, spawnY, 'COPS', 0).setScale(0.25).setDepth(10).setAngle(60);
        cop.setSize(56, 64);
        cop.setAngle(Phaser.Math.Between(0, 360));
        cop.setCollideWorldBounds(true);
        cop.body.setDrag(200);
        cop.body.setFriction(0.1);
        cop.body.setBounce(2)
    
        this.physics.add.collider(cop, this.footpathLayer, () => {
            console.log("BOOP");
        });
        

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
                this.activeCops.splice(index, 1); 
            }
            cop.destroy(); 
            this.death.play();
            console.log("get gotten");
        }
    }
    


    update() {

        if (this.isGameOver) return;

        let elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
        this.timerText.setText(`Time: ${elapsedTime}s`);
    
        if (elapsedTime >= this.lastStarTime + 10 && this.starLevel < this.maxStars) {
            this.starLevel++;
            this.updateStars();
            this.lastStarTime = elapsedTime;
        }

        if (!this.player || this.isGameOver) return;

        let forward = new Phaser.Math.Vector2(
            Math.sin(this.player.rotation),
            -Math.cos(this.player.rotation)
        );
    
        let acceleration = 10;  
        let maxSpeed = 500;     
        let deceleration = 1;
        let reverseSpeed = 150;  
        let turnSpeed = 3;      
        let driftFactor = 0.05; 
        
        if (this.spaceKey.isDown){
            acceleration = 0;  
            maxSpeed = 400;     
            deceleration = 0.8;

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
            velocity.x += -forward.x * acceleration;
            velocity.y += -forward.y * acceleration;
    
            if (velocity.length() > maxSpeed) {
                velocity.setLength(maxSpeed);
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

        // let isDrifting = Math.abs(velocity.angle() - this.player.rotation) > 0.2; // Checks if turning
        let isDrifting = this.spaceKey.isDown;
        let isFast = velocity.length() > 100; 
        if (isDrifting) {
            console.log("drift")
        }
    
        if (isDrifting && isFast) {
            this.driftParticles.start();
            this.driftParticles.emitParticleAt(
                this.player.x - Math.sin(this.player.rotation) * 20,
                this.player.y + Math.cos(this.player.rotation) * 20
            );
        } else {
            this.driftParticles.stop();
        }

        for (let i = this.activeCops.length - 1; i >= 0; i--) {
            const cop = this.activeCops[i];

            if (!this.player) continue;

            //dumbass cops at the moment but they will be breaking ankles at 5 stars

            if (!cop.lastTurnTime || this.time.now > cop.lastTurnTime + (50 / (this.starLevel + 1))) {
                let targetAngle = Phaser.Math.Angle.Between(cop.x, cop.y, this.player.x, this.player.y);
                cop.rotation = Phaser.Math.Angle.RotateTo(cop.rotation, targetAngle, 0.05 * this.starLevel + 0.01);
                cop.lastTurnTime = this.time.now;
            }

            const speed = this.CHASE_VELOCITY + (this.CHASE_VELOCITY * (this.starLevel/20 ));
            cop.setVelocity(Math.cos(cop.rotation) * speed, Math.sin(cop.rotation) * speed);

            cop.play('not-chillin');
        }
        
    }


updateStars() {
    this.starGroup.clear(true, true);
    // this.starLevel++;


    for (let i = 0; i < this.starLevel; i++) {
        let star = this.add.image(440 + i * 12, 340, 'star')
            .setScale(0.3) // Adjust scale for zoom
            .setScrollFactor(0)
            .setDepth(100);
        this.starGroup.add(star);
         }
    }

}