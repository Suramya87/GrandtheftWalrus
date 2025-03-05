class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init() {
        this.SPEED_MULTIPLIER = 1;
        this.PLAYER_VELOCITY = 350;
        this.followerSpeed = 100 / this.SPEED_MULTIPLIER;
        this.CHASE_VELOCITY = 500 / this.SPEED_MULTIPLIER;
        this.player_isTouching = false;
        this.player_isTurning = false;
        this.ROTATION_SPEED = 2;
        this.LANES = false;
        this.laneHeight = 960;
        this.laneWidth = 8;
        this.timeSurvived = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.isGameOver = false;
            
    }

    preload() {
        this.load.spritesheet('character', './assets/testcar2.png', {
            frameWidth: 128
        });
        this.load.image('test','./assets/kidnap.png')
        this.load.tilemapTiledJSON('testJSON','./assets/temp_test.json');

    }

    create() {
        const map = this.add.tilemap('testJSON')
        const tileset =  map.addTilesetImage('temp_test','test')
        
        const bgLayer = map.createLayer('Tile Layer 1',tileset,0,0)
        const FootpathLayer = map.createLayer('Footpath',tileset,0,0)
        
        FootpathLayer.setCollisionByProperty({collides: true})
        // TreesLayer.setCollisionByProperty({collides: true})
        
        const Walrus_spawn = map.findObject('Spawn', (obj) => obj.name === 'Walrus spawn')
        


        const PLAYER = () => {
            this.player = this.physics.add.sprite(Walrus_spawn.x, Walrus_spawn.x, 'character', 1).setScale(0.5);
            this.player.body.setCollideWorldBounds(true);
            this.player.setSize(56, 64);
            this.player.body.setBounce(2)
            // this.player.body.setDamping(true).setDrag(0.5)
            this.isCooldown = false;
            this.cooldownTime = 2000;
            this.player_isTouching = false;

        };
        
        PLAYER();
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels)
        this.cameras.main.startFollow(this.player,true,0.25,0.25)

        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels)

        this.physics.add.collider(this.player, FootpathLayer)

        // Start updating time survived every second
        this.timeEvent = this.time.addEvent({
            delay: 1000, // Every second
            callback: () => {
                this.timeSurvived++;
                this.timeText.setText(`Time: ${this.timeSurvived}s`);
            },
            loop: true
        });

        // Display time survived
        this.timeText = this.add.text(20, 20, `Time: ${this.timeSurvived}s`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        // Display high score
        this.highScoreText = this.add.text(20, 60, `High Score: ${this.highScore}s`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
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

        cursors = this.input.keyboard.createCursorKeys();
    }
    gameOver() {
        if (!this.isGameOver) {
            this.isGameOver = true;  // Prevent multiple triggers
    
            // Store high score if this is the best run
            if (this.timeSurvived > this.highScore) {
                this.highScore = this.timeSurvived;
                localStorage.setItem('highScore', this.highScore);
            }
    
            // Transition to the Game Over screen
            this.scene.start('gameOver', { 
                timeSurvived: this.timeSurvived, 
                highScore: this.highScore 
            });
        }
    }
    
    update() {

        if (!this.player.destroyed) {
            if (!this.physics.world.overlap(this.player, this.lanes)) {
                this.player_isTouching = false;
            }

            // let playerVector = new Phaser.Math.Vector2(0, 0);
            let playerVelocity = new Phaser.Math.Vector2(0, 0);

            if (cursors.up.isDown) {
                this.SPEED_MULTIPLIER = 2
                // playerVector.y = -1;
                playerVelocity.y = -Math.cos(this.player.rotation) * this.PLAYER_VELOCITY;
                playerVelocity.x = Math.sin(this.player.rotation) * this.PLAYER_VELOCITY;
                this.player.play('speed');
            } else if (cursors.down.isDown) {
                this.SPEED_MULTIPLIER = 0.5
                // playerVector.y = 1;
                playerVelocity.y = Math.cos(this.player.rotation) * (this.PLAYER_VELOCITY * 0.5);
                playerVelocity.x = -Math.sin(this.player.rotation) * (this.PLAYER_VELOCITY * 0.5);
                this.player.play('speed');
            }

            if (cursors.left.isDown) {
                // playerVector.x = -1;
                this.player.angle -= this.ROTATION_SPEED; // Rotate counter-clockwise
                this.player.play('idle-left');
                this.player_isTurning = true;
            } else if (cursors.right.isDown) {
                // playerVector.x = 1;
                this.player.angle += this.ROTATION_SPEED; // Rotate clockwise
                this.player.play('idle-right');
                this.player_isTurning = true;
            }

            if (!cursors.right.isDown && !cursors.left.isDown) {
                this.player_isTurning = false;
                
            }

            if (!cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
                this.SPEED_MULTIPLIER = 1
                this.player.play('normal');
            }

            if (this.player_isTouching && !this.player_isTurning) {
                this.LANES = true;
            }

            this.player.setVelocity(playerVelocity.x, playerVelocity.y);
            // playerVector.normalize();
            // this.player.setVelocity(this.PLAYER_VELOCITY * playerVector.x, this.PLAYER_VELOCITY * playerVector.y);
        
        if (this.player.y > height + 100) {
            this.gameOver();
          }
    
        }

    }
}
// update() {
//     if (this.isGameOver) return;

//     let playerVelocity = new Phaser.Math.Vector2(0, 0);

//     // Rotate left/right
//     if (this.cursors.left.isDown) {
//         this.player.angle -= this.ROTATION_SPEED; // Rotate counter-clockwise
//     } else if (this.cursors.right.isDown) {
//         this.player.angle += this.ROTATION_SPEED; // Rotate clockwise
//     }

//     // Move forward/backward based on the car's angle
//     if (this.cursors.up.isDown) {
//         playerVelocity.x = Math.cos(this.player.rotation) * this.PLAYER_VELOCITY;
//         playerVelocity.y = Math.sin(this.player.rotation) * this.PLAYER_VELOCITY;
//     } else if (this.cursors.down.isDown) {
//         playerVelocity.x = -Math.cos(this.player.rotation) * (this.PLAYER_VELOCITY * 0.5);
//         playerVelocity.y = -Math.sin(this.player.rotation) * (this.PLAYER_VELOCITY * 0.5);
//     }

//     this.player.setVelocity(playerVelocity.x, playerVelocity.y);

//     if (this.player.y > this.physics.world.bounds.height + 100) {
//         this.gameOver();
//     }
// }
// }