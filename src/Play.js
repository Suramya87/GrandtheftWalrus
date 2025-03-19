
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init() {
        this.playerHealth = 100; 
        this.maxHealth = 100; 
        this.SPEED_MULTIPLIER = 1;
        this.PLAYER_VELOCITY = 350;
        this.followerSpeed = 100;
        this.CHASE_VELOCITY = 600 / this.SPEED_MULTIPLIER;
        this.player_isTouching = false;
        this.player_isTurning = false;
        this.ROTATION_SPEED = 3;
        this.LANES = false;
        this.timeSurvived = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.isGameOver = false;
        this.playerLastPosition = null;

        this.copSpawnTimer = null;
        // this.copSpawnInterval = 200000000000000;
        this.copSpawnInterval = 2000;

        this.activeCops = []; // Store cops in the same scene
        this.ammo = 5;
        this.maxAmmo = 5;
        this.reloadTime = 2000;
        this.isReloading = false;
        this.ammoUI = [];

        
    }

    createUI() {
        // Ammo UI

        for (let i = 0; i < this.maxAmmo; i++) {
            let backing = this.add.image(450 + i * 30, 720, 'shellback')
                .setScale(0.75)
                .setScrollFactor(0)
                .setDepth(9);
            }
        for (let i = 0; i < this.maxAmmo; i++) {
            let bulletIcon = this.add.image(450 + i * 30, 720, 'ammo_ui')
                .setScale(0.75)
                .setScrollFactor(0)
                .setDepth(9);
            this.ammoUI.push(bulletIcon);
        }
    
        // Health Bar UI
        this.healthBarBackground = this.add.image(250, 720, 'HP_bar')
            .setScrollFactor(0)
            .setOrigin(0, 0.5)
            .setDepth(9);
        
        let pauseButton = this.add.image(950, 225,'pause') // Default button image
            .setScrollFactor(0)
            .setOrigin(0, 0.5)
            .setDepth(9)
            .setInteractive()
        .on('pointerover', () => {
            pauseButton.setTexture('unpause'); // Change to hover image
        })
        .on('pointerout', () => {
            pauseButton.setTexture('pause'); // Revert to default image
        })
        .on('pointerdown', () => {
            // this.togglePauseOverlay();
            this.scene.pause();
            this.scene.launch('optionsScene', { previousScene: "playScene" });
            this.scene.bringToTop('optionsScene');

        });
        
        this.healthBar = this.add.rectangle(356, 720, 55, 100, 0xff0000)
            .setScrollFactor(0)
            .setOrigin(0, 0.5)
            .setDepth(8)
            .setAngle(180);
        
}


    create() {

        this.scene.setVisible(false, "backgroundScene"); // Hide the background scene
        if (gameSettings.music) {
        }

        this.copSpawnTimer = this.time.addEvent({
            delay: this.copSpawnInterval, // Initial spawn interval
            callback: this.spawnCop,
            callbackScope: this,
            loop: true
        });

        this.createUI();

        // TILES
        this.death = this.sound.add('crashSound');
        // const map = this.add.tilemap('testJSON');
        // const tileset = map.addTilesetImage('temp_test', 'test');
        // const bgLayer = map.createLayer('BG',tileset,0,0)
        // this.footpathLayer = map.createLayer('Footpath', tileset, 0, 0);
        // this.KILLLayer = map.createLayer('KILL', tileset, 0, 0);

        // this.footpathLayer.setCollisionByProperty({ collides: true });
        // this.KILLLayer.setCollisionByProperty({ collides: true });

        const map = this.add.tilemap('MAPJSON');
        const tileset = map.addTilesetImage('highway', 'MAPMAP');
        // const BDLayer = map.createLayer('GRASS BORDER',tileset,0,0)
        const bgLayer = map.createLayer('ROAD',tileset,0,0)
        this.boarder = map.createLayer('GRASS BORDER',tileset,0,0)
        this.boarder.setCollisionByProperty({ BORDER: true });
        this.WHLayer = map.createLayer('water/houses',tileset,0,0)
        this.WHLayer.setCollisionByProperty({ building: true });
        this.WHLayer.setCollisionByProperty({ wawa: true });

        // COPS
        this.enemySpawns = map.getObjectLayer('COP SPAWN').objects;

        // Player shit
        const Walrus_spawn = map.findObject('PLAYER SPAWN', (obj) => obj.name === 'PLAYER SPAWN');
        this.player = this.physics.add.sprite(Walrus_spawn.x, Walrus_spawn.y, 'character', 1).setScale(0.5);
        this.player.body.setCollideWorldBounds(true);
        this.player.setSize(48, 48);
        this.player.setCircle(24);
        this.player.body.setBounce(0.1);
        this.player.body.setDrag(200);
        this.player.body.setFriction(-10);
        this.isCooldown = false;
        this.cooldownTime = 2000;

        this.walrus = this.add.sprite(this.player.x, this.player.y, 'WALRUS').setOrigin(0.5, 0.5).setDepth(10);

        this.aimCone = this.add.sprite(this.player.x, this.player.y, 'cone').setOrigin(0.5, 0.5).setDepth(5).setScale(0.25).setAlpha(0.5);

        //Carmera shit
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5);
        this.cameras.main.setZoom(1.5);

        this.input.keyboard.on('keydown-Z', () => {
            this.cameras.main.setZoom(this.cameras.main.zoom === 1 ? 1.5 : 1);
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
        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 0) {  // 0 = Left Click, 1 = Middle Click, 2 = Right Click
                this.fireShotgun();
            }
        });
        this.input.keyboard.on('keydown-T', () => this.toggleAutoAim()); // Toggle auto-aim
        // this.createAmmoUI();

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

 
        this.cursors = this.input.keyboard.createCursorKeys();

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        // Player collision with buildings
        // this.physics.add.collider(this.player, this.WHLayer, (player, tile) => {
        //     if (tile.properties.building) {
        //         console.log("damn it")
        //     }
        // });

        // Cops collision with buildings
        // this.activeCops.forEach(cop => {
            // this.physics.add.collider(cop, WHLayer);
        // });

        // Player collision with water
        this.physics.add.overlap(this.player, this.WHLayer, (player, tile) => {
            if (tile.properties.wawa) {
                this.playerHealth = 0; // Instantly kill the player
                this.updateHealthBar();
                this.gameOver();
            }
        });
        this.physics.add.collider(this.player, this.WHLayer, (player, tile) => {
            if (tile.properties.building) {
                console.log("damn it")
            }
        });

        // // Cops collision with water
        // this.activeCops.forEach(cop => {
        //     this.physics.add.overlap(cop, WHLayer, (cop, tile) => {
        //         if (tile.properties.wawa) {
        //             this.destroyCop(cop); // Destroy the cop if it touches water
        //         }
        //     });
        // });
        
        // Player collision with border
        this.physics.add.collider(this.player, this.boarder);

        // Cops collision with border
        this.activeCops.forEach(cop => {
            this.physics.add.collider(cop, BDLayer);
        });

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
        this.timerText = this.add.text(235, 250, 'Time: 0s', { 
            fontSize: '36px', 
            fill: '#fff' 
        }).setScrollFactor(0).setDepth(100);

        // Initialize score UI
        this.score = 0; // Initialize score to 0
        this.scoreText = this.add.text(235, 275, 'Score: 0', {
            fontSize: '36px',
            fill: '#fff'
        }).setScrollFactor(0).setDepth(100);

        console.log("scoreText created:", this.scoreText); 
    
        this.starGroup = this.add.group();
        this.updateStars();
        console.log(this.bullets)

        // Get penguin spawn points from the tilemap
        this.penguinSpawns = map.getObjectLayer('PENGUIN SPAWN').objects;

        // Group to store active penguins
        this.penguins = this.physics.add.group();

        // Spawn penguins on a cooldown
        this.penguinSpawnCooldown = 1000; 
        this.time.addEvent({
            delay: this.penguinSpawnCooldown,
            callback: this.spawnPenguin,
            callbackScope: this,
            loop: true
        });


    }

    toggleAutoAim() {
        console.log(this.autoAim)
        this.autoAim = !this.autoAim;
        // console.log("Auto-Aim: " + (this.autoAim ? "Enabled" : "Disabled"));
    }


    fireShotgun() {
        //sounds:
        
        if (this.isReloading || this.ammo <= 0) return;
    
        this.ammo--;
        this.sound.play('blast')
        this.updateAmmoUI();
    
        const numPellets = 10;
        const spreadAngle = 20;
        let targetAngle = this.getAimDirection();
    
        // Update the aim cone dynamically
        this.updateAimCone(targetAngle);
    
        this.bullets = this.physics.add.group();
    
        // Fire shotgun pellets with spread
        for (let i = 0; i < numPellets; i++) {
            let angleOffset = Phaser.Math.DegToRad(Phaser.Math.Between(-spreadAngle, spreadAngle));
            let bulletAngle = targetAngle + angleOffset;
            let velocity = new Phaser.Math.Vector2(Math.cos(bulletAngle), Math.sin(bulletAngle)).scale(1200);
    
            let bullet = this.bullets.create(this.player.x, this.player.y, 'bullet').setScale(0.1);
            bullet.setVelocity(velocity.x, velocity.y);
            bullet.setRotation(bulletAngle);
            bullet.setDepth(5);
    
            this.time.delayedCall(350, () => bullet.destroy(), [], this);
        }
    
        if (this.ammo === 0) this.reload();
    
        this.physics.add.collider(this.activeCops, this.bullets, (cop, bullet) => {
            this.destroyCop(cop);
            bullet.destroy();
        });

        this.physics.add.collider(this.bullets, this.penguins, (bullet, penguin) => {
            bullet.destroy();
            this.handlePenguinCollision(penguin);
        });
    }
    
    // Determines the aiming direction dynamically
    getAimDirection() {
        if (!this.autoAim) {
            let nearestCop = this.getNearestCop();
            if (nearestCop) {
                return Phaser.Math.Angle.Between(
                    this.player.x, this.player.y,
                    nearestCop.x, nearestCop.y
                );
            }
        }
    
        let pointer = this.input.activePointer;
        let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        return Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
    }
    
    // Updates the aim cone position and rotation dynamically
    updateAimCone(targetAngle) {
        const coneDistance = 20;

        const walrusDistance = 1;
        let coneX = this.player.x + Math.cos(targetAngle) * coneDistance;
        let coneY = this.player.y + Math.sin(targetAngle) * coneDistance;

        let walrusX = this.player.x + Math.cos(targetAngle) * walrusDistance;
        let walrusY = this.player.y + Math.cos(targetAngle) * walrusDistance;
        
        this.walrus.setPosition(walrusX, walrusY);
        this.walrus.setRotation(targetAngle + Phaser.Math.DegToRad(90));
        // walrus
        this.aimCone.setPosition(coneX, coneY);
        this.aimCone.setRotation(targetAngle + Phaser.Math.DegToRad(90));
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

    spawnPenguin() {
        if (this.penguinSpawns.length === 0) {
            console.warn("No penguin spawn points");
            return;
        }
    
        // Choose a random spawn point
        console.log("HENK")
        const spawnPoint = Phaser.Utils.Array.GetRandom(this.penguinSpawns);
        const spawnX = spawnPoint.x + Phaser.Math.Between(-10, 10);
        const spawnY = spawnPoint.y + Phaser.Math.Between(-10, 10);
    
        // Create a new penguin
        // console.log("HENK1")
        const penguin = new Penguin(this, spawnX, spawnY);
        this.penguins.add(penguin);
        // console.log("HENK2")
    
        // Add collision with player
        this.physics.add.collider(this.player, penguin, () => {
            console.log("HENK3")
            this.handlePenguinCollision(penguin);
            // console.log("HONK")
        });
    }
    handlePenguinCollision(penguin) {
        // Award 100 points
        this.score += 100;
        this.updateScoreUI();

        // Destroy the penguin
        penguin.destroyPenguin();
    }

    updateScoreUI() {
        this.scoreText.setText(`Score: ${this.score}`);
    }

    updateAmmoUI() {
        // Iterate through each ammo slot
        this.ammoUI.forEach((icon, index) => {
            if (index < this.ammo) {
                icon.setVisible(true);  // Show the ammo icon if we still have ammo
            } else if (icon.visible) {
                // Eject the shell when ammo is less than the current index and it's visible
                let shell = this.add.image(icon.x, icon.y, 'ammo_ui').setScale(0.75);
                shell.setDepth(10); // Ensure the shell is above the UI layer
                
                // Account for the camera's position by converting to world coordinates
                let worldPosition = this.cameras.main.getWorldPoint(icon.x, icon.y);
                shell.setPosition(worldPosition.x, worldPosition.y);
    

                let velocityX = Phaser.Math.Between(-150, 150);  
                let velocityY = Phaser.Math.Between(-200, -150); 
    
                // Animate the shell flying out of the UI
                this.tweens.add({
                    targets: shell,
                    x: shell.x + velocityX,
                    y: shell.y + velocityY,
                    angle: Phaser.Math.Between(-540, 540), // Random rotation while moving
                    duration: 500,
                    ease: 'Power1',
                    onComplete: () => shell.destroy(), // Destroy the shell after animation
                });
    
                // Hide the original UI bullet (ammo slot)
                icon.setVisible(false);
            }
        });
    }
    updateHealthBar() {
        const healthPercentage = this.playerHealth / this.maxHealth;
        this.healthBar.height  = 50 * healthPercentage; // Calculate new height based on health
    
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
    
        // console.log(`WOOPWOOP: (${spawnX}, ${spawnY})`);
    
        const cop = this.physics.add.sprite(spawnX, spawnY, 'COPS', 0).setScale(0.5).setDepth(10).setAngle(60);
        cop.setSize(56, 64);
        cop.setAngle(Phaser.Math.Between(0, 360));
        cop.setCollideWorldBounds(true);
        cop.body.setDrag(200);
        cop.body.setFriction(0.1);
        cop.body.setBounce(2);
    
        // Add a damage cooldown flag to the cop
        cop.damageCooldown = false;
    
        this.physics.add.collider(cop, this.boarder, () => { 
            // if (tile.properties.building) {
            console.log("BEEP")
            // }
        });
        
        

    
        this.physics.add.collider(cop, this.KILLLayer, () => {
            this.destroyCop(cop);
        });

        this.physics.add.overlap(cop, this.WHLayer, (cop, tile) => {  
                if (tile.properties.wawa) {
                    this.destroyCop(cop); // Destroy the cop if it touches water
                }
            });

            this.physics.add.collider(cop, this.WHLayer, (cop, tile) => {
                if (tile.properties.building) {
                    console.log("BOOP")
                }
                // console.log("BOOP")
        });
    
        this.physics.add.collider(cop, this.player, () => {
            if (!cop.damageCooldown) {
                this.playerHealth -= 10; // Reduce player health by 10 on collision
                this.updateHealthBar(); // Update the health bar
    
                if (this.playerHealth <= 0) {
                    this.gameOver(); // Trigger game over if health drops to 0
                }
    
                // Set damage cooldown
                cop.damageCooldown = true;
                this.time.delayedCall(1000, () => {
                    cop.damageCooldown = false; // Reset cooldown after 1 second
                }, [], this);
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
            // console.log("get gotten");
        }
    }
    


    // update() {
    //     if (this.isGameOver) return;
    
    //     let elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
    //     this.timerText.setText(`Time: ${elapsedTime}s`);
    
    //     if (elapsedTime >= this.lastStarTime + 10 && this.starLevel < this.maxStars) {
    //         this.starLevel++;
    //         this.updateStars();
    //         this.lastStarTime = elapsedTime;
        

    //     this.copSpawnInterval = Math.max(1000, 5000 - (this.starLevel * 500)); // Adjust spawn interval
    //     this.copSpawnTimer.delay = this.copSpawnInterval; // Update the timer delay
    // }
    
    //     if (!this.player || this.isGameOver) return;
    
    //     let forward = new Phaser.Math.Vector2(
    //         Math.sin(this.player.rotation),
    //         -Math.cos(this.player.rotation)
    //     );
    
    //     // console.log("Forward Vector:", forward.x, forward.y);
    
    //     let acceleration = 7;
    //     let maxSpeed = 1000;
    //     let deceleration = 1;
    //     let reverseSpeed = 150;
    //     let turnSpeed = 3;
    //     let driftFactor = 0.05;
    
    //     if (this.spaceKey.isDown) {
    //         acceleration = 0;
    //         maxSpeed = 800;
    //         deceleration = 0.8;
    
    //         reverseSpeed = 150;
    //         turnSpeed = 4;
    //         driftFactor = 0.96;
    //     }
    
    //     let targetAngle = this.getAimDirection();
    //     let velocity = new Phaser.Math.Vector2(this.player.body.velocity.x, this.player.body.velocity.y);
    
    //     if (this.cursors.up.isDown || this.keys.up.isDown) {
    //         velocity.x += forward.x * acceleration;
    //         velocity.y += forward.y * acceleration;
    
    //         if (velocity.length() > maxSpeed) {
    //             velocity.setLength(maxSpeed);
    //         }
    //         this.player.play('speed');
    //     } else {
    //         velocity.scale(deceleration);
    //     }
    
    //     if (this.cursors.left.isDown || this.keys.left.isDown) {
    //         this.player.angle -= turnSpeed;
    //         this.player.play('idle-left');
    //     } else if (this.cursors.right.isDown || this.keys.right.isDown) {
    //         this.player.angle += turnSpeed;
    //         this.player.play('idle-right');
    //     }
    
    //     this.updateAimCone(targetAngle);
    
    //     let newForward = new Phaser.Math.Vector2(Math.sin(this.player.rotation), -Math.cos(this.player.rotation));
    //     velocity.lerp(newForward.scale(velocity.length()), 1 - driftFactor);
    
    //     this.player.body.velocity.set(velocity.x, velocity.y);
    
    //     if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
    //         this.player.play('normal');
    //     }
    
    //     let isDrifting = this.spaceKey.isDown;
    //     let isFast = velocity.length() > 100;
    
    //     // if (isDrifting) {
    //         // console.log("drift");
    //     // }
    
    //     if (isDrifting && isFast) {
    //         this.driftParticles.start();
    //         this.driftParticles.emitParticleAt(
    //             this.player.x - Math.sin(this.player.rotation) * 20,
    //             this.player.y + Math.cos(this.player.rotation) * 20
    //         );
    //         this.ankle_break = true;
    //     } else {
    //         this.driftParticles.stop();
    //         this.ankle_break = false;
    //     }
    
    //     // Update cop behavior
    //     for (let i = this.activeCops.length - 1; i >= 0; i--) {
    //         const cop = this.activeCops[i];
    
    //         if (!this.player) continue;
    
    //         // If the player is drifting, start the cooldown for the cop
    //         if (this.ankle_break && !cop.turnCooldown) {
    //             cop.turnCooldown = true;
    //             this.time.delayedCall(1000, () => {
    //                 cop.turnCooldown = false;
    //             }, [], this);
    //         }
    
    //         // If the cop is in cooldown, set turn speed to zero
    //         if (cop.turnCooldown) {
    //             cop.rotation = cop.rotation; // Maintain current rotation
    //         } else {
    //             // If not in cooldown, update the cop's target and velocity
    //             if (!cop.lastTurnTime || this.time.now > cop.lastTurnTime + (50 / (this.starLevel + 1))) {
    //                 let targetAngle = Phaser.Math.Angle.Between(cop.x, cop.y, this.player.x, this.player.y);
    //                 cop.rotation = Phaser.Math.Angle.RotateTo(cop.rotation, targetAngle, 0.05 * this.starLevel + 0.01);
    //                 cop.lastTurnTime = this.time.now;
    //             }
    //         }
    
    //         const speed = this.CHASE_VELOCITY + (this.CHASE_VELOCITY * (this.starLevel / 20));
    //         cop.setVelocity(Math.cos(cop.rotation) * speed, Math.sin(cop.rotation) * speed);
    
    //         cop.play('not-chillin');
    //     }
    // }
    update() {
        if (this.isGameOver) return;

        // if (this.pauseOverlay.visible) {
        //     this.pauseOverlay.setPosition(this.cameras.main.scrollX + 640, this.cameras.main.scrollY + 480);
        // }
    
        let elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
        this.timerText.setText(`Time: ${elapsedTime}s`);
    
        if (elapsedTime >= this.lastStarTime + 10 && this.starLevel < this.maxStars) {
            this.starLevel++;
            this.updateStars();
            this.lastStarTime = elapsedTime;

            this.copSpawnInterval = Math.max(1000, 5000 - (this.starLevel * 500));
            this.copSpawnTimer.delay = this.copSpawnInterval;
        }
    
        if (!this.player) return;
    
        // Compute movement vectors once
        let sinRotation = Math.sin(this.player.rotation);
        let cosRotation = -Math.cos(this.player.rotation);
        let forward = new Phaser.Math.Vector2(sinRotation, cosRotation);
    
        // Vehicle Physics Variables
        let acceleration = 10,
            maxSpeed = 1000,
            deceleration = 1,
            turnSpeed = 3,
            driftFactor = 0.05;
    
        if (this.spaceKey.isDown) {
            acceleration = 0;
            maxSpeed = 800;
            deceleration = 0.8;
            turnSpeed = 4;
            driftFactor = 0.96;
        }
    
        // Movement Input Handling
        let velocity = new Phaser.Math.Vector2(this.player.body.velocity.x, this.player.body.velocity.y);
    
        if (this.cursors.up.isDown || this.keys.up.isDown) {
            velocity.x += forward.x * acceleration;
            velocity.y += forward.y * acceleration;
            if (velocity.length() > maxSpeed) velocity.setLength(maxSpeed);
            this.player.play('speed');
        } else {
            velocity.scale(deceleration);
        }
    
        let isTurningLeft = this.cursors.left.isDown || this.keys.left.isDown;
        let isTurningRight = this.cursors.right.isDown || this.keys.right.isDown;
    
        if (isTurningLeft) {
            this.player.angle -= turnSpeed;
            this.player.play('idle-left');
        } else if (isTurningRight) {
            this.player.angle += turnSpeed;
            this.player.play('idle-right');
        }

        let targetAngle = this.getAimDirection();
        this.updateAimCone(targetAngle);
   
        let newForward = new Phaser.Math.Vector2(Math.sin(this.player.rotation), -Math.cos(this.player.rotation));
        velocity.lerp(newForward.scale(velocity.length()), 1 - driftFactor);
        this.player.body.velocity.set(velocity.x, velocity.y);
    
        if (!isTurningLeft && !isTurningRight && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.play('normal');
        }
    
        let isDrifting = this.spaceKey.isDown;
        let isFast = velocity.length() > 100;
    
        if (isDrifting && isFast) {
            this.driftParticles.start();
            this.driftParticles.emitParticleAt(
                this.player.x - sinRotation * 20,
                this.player.y + cosRotation * 20
            );
            this.ankle_break = true;
        } else {
            this.driftParticles.stop();
            this.ankle_break = false;
        }
    
        // Optimize Cop Behavior by moving it to a separate function
        this.updateCops();
    }
    
    updateCops() {
        for (let i = this.activeCops.length - 1; i >= 0; i--) {
            const cop = this.activeCops[i];
    
            if (!this.player) continue;
    
            if (this.ankle_break && !cop.turnCooldown) {
                cop.turnCooldown = true;
                this.time.delayedCall(1000, () => cop.turnCooldown = false, [], this);
            }
    
            if (!cop.turnCooldown) {
                if (!cop.lastTurnTime || this.time.now > cop.lastTurnTime + (50 / (this.starLevel + 1))) {
                    let targetAngle = Phaser.Math.Angle.Between(cop.x, cop.y, this.player.x, this.player.y);
                    cop.rotation = Phaser.Math.Angle.RotateTo(cop.rotation, targetAngle, 0.05 * this.starLevel + 0.01);
                    cop.lastTurnTime = this.time.now;
                }
            }
    
            let copSpeed = this.CHASE_VELOCITY * (1 + this.starLevel / 20);
            cop.setVelocity(Math.cos(cop.rotation) * copSpeed, Math.sin(cop.rotation) * copSpeed);
            cop.play('not-chillin');
        }
    }
    
   

updateStars() {
    this.starGroup.clear(true, true);
    // this.starLevel++;


    for (let i = 0; i < this.starLevel; i++) {
        let star = this.add.image(250 + i * 50, 200, 'star')
            .setScale(1) // Adjust scale for zoom
            .setScrollFactor(0)
            .setDepth(100);
        this.starGroup.add(star);
         }
    }

gameOver() {
        this.isGameOver = true;
        this.player.setVisible(false); // Hide the player
        this.cameras.main.shake(500, 0.05); // Add a camera shake effect
        this.time.delayedCall(1000, () => {
            this.scene.pause(); // Pause Play instead of stopping
            this.scene.launch('gameOver'); // Launch Game Over scene as an overlay
        }, [], this);
    }
}

