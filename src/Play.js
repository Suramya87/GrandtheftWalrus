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
        this.LANES = false;
        // this.roadPositions = [169, 410, 650, 895, 1144];
        // this.lanePositions = [285, 530, 773, 1014];
        this.laneHeight = 960;
        this.laneWidth = 8;
        this.timeSurvived = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.isGameOver = false;
            
    }

    preload() {
        // this.load.image('Lines', './assets/trafficLines.png');
        // this.load.image('Strips', './assets/rumbleStrips.png');
        // this.load.image('Black', './assets/blacktopBG.png');
        // this.load.audio('death', './assets/STAY_IN_THE_LANE.mp3');
        // this.load.spritesheet('cars', './assets/cars.png', {
        //     frameWidth: 100
        // });
        // this.load.spritesheet('Biker', './assets/Biker.png', {
        //     frameWidth: 100
        // });
        // this.load.spritesheet('COPS', './assets/POLICE2.png', {
        //     frameWidth: 100
        // });
        this.load.spritesheet('character', './assets/testcar2.png', {
            frameWidth: 128
        });
        this.load.image('test','./assets/kidnap.png')
        this.load.tilemapTiledJSON('testJSON','./assets/temp_test.json');

    }

    create() {
        // this.lanes = this.physics.add.group();
        // for (let i = 0; i < this.lanePositions.length; i++) {
        //     const lane = this.physics.add.sprite(this.lanePositions[i], 480, 'Black', 0);
        //     lane.setSize(this.laneWidth, this.laneHeight);
        //     lane.setImmovable(true);
        //     this.lanes.add(lane);
        // }

        // this.black = this.add.tileSprite(0, 0, 640, 480, 'Black').setOrigin(0, 0).setScale(2);
        // this.lines = this.add.tileSprite(0, 0, 640, 480, 'Lines').setOrigin(0, 0).setScale(2);
        // this.strips = this.add.tileSprite(0, 0, 640, 480, 'Strips').setOrigin(0, 0).setScale(2);
                //tilemapTiledJSON
        const map = this.add.tilemap('testJSON')
        const tileset =  map.addTilesetImage('temp_test','test')
        
        const bgLayer = map.createLayer('Tile Layer 1',tileset,0,0)
        const FootpathLayer = map.createLayer('Footpath',tileset,0,0)
        
        FootpathLayer.setCollisionByProperty({collides: true})
        // TreesLayer.setCollisionByProperty({collides: true})
        
        const Walrus_spawn = map.findObject('Spawn', (obj) => obj.name === 'Walrus spawn')
        
        // add slime
        // this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0)
        // this.slime.body.setCollideWorldBounds(true)


        const PLAYER = () => {
            this.player = this.physics.add.sprite(Walrus_spawn.x, Walrus_spawn.x, 'character', 1).setScale(0.5);
            this.player.body.setCollideWorldBounds(true);
            this.player.setSize(56, 64);
            this.player.body.setBounce(2)
            // this.player.body.setDamping(true).setDrag(0.5)
            this.isCooldown = false;
            this.cooldownTime = 2000;
            this.player_isTouching = false;

            // this.physics.add.overlap(this.player, this.lanes, () => {
            //     this.player_isTouching = true;

            //     if (!this.isCooldown && this.LANES) {
            //         // this.scene.get('DA_POLICE').play('not-chillin');
            //         this.sound.play('death', { volume: 0.1 });
            //         console.log('death');
            //         this.isCooldown = true;
            //         this.time.delayedCall(this.cooldownTime, () => {
            //             this.isCooldown = false;
            //         });
            //     }
            // });
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

        // this.scene.launch('TRAFFIC', {
        //     player: this.player,
        //     roadPositions: this.roadPositions,
        //     height: this.cameras.main.height
        // });

        // // Start the PoliceScene and pass necessary data
        // this.scene.launch('DA_POLICE', {
        //     player: this.player,
        //     roadPositions: this.roadPositions,
        //     height: this.cameras.main.height,
        //     CHASE_VELOCITY: this.CHASE_VELOCITY,
        //     followerSpeed: this.followerSpeed
        // });

        // // Add a key listener to spawn a cop (for testing)
        // this.input.keyboard.on('keydown-SPACE', () => {
        //     this.scene.get('DA_POLICE').addCop();
        // });
        
        // // Spawn cops at random intervals
        // this.time.addEvent({
        //     delay: Phaser.Math.Between(20000, 50000), // Random delay between 2 and 5 seconds
        //     callback: () => {
        //         this.scene.get('DA_POLICE').addCop();
        //         },
        //     loop: true
        // });

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

            // this.strips.tilePositionY -= 2 * this.SPEED_MULTIPLIER;
            // this.lines.tilePositionY -= 2 * this.SPEED_MULTIPLIER;
            let playerVector = new Phaser.Math.Vector2(0, 0);
            // playerVector.y = 0.1;

            // if (!this.player_isTouching) {
            //     this.LANES = false;
            // }

            if (cursors.up.isDown) {
                this.SPEED_MULTIPLIER = 2
                // this.strips.tilePositionY -= 4;
                // this.lines.tilePositionY -= 4;
                playerVector.y = -1;
                this.player.play('speed');
            } else if (cursors.down.isDown) {
                this.SPEED_MULTIPLIER = 0.5
                // this.strips.tilePositionY += 1;
                // this.lines.tilePositionY += 1;
                playerVector.y = 1;
                this.player.play('speed');
            }

            if (cursors.left.isDown) {
                playerVector.x = -1;
                this.player.play('idle-left');
                this.player_isTurning = true;
            } else if (cursors.right.isDown) {
                playerVector.x = 1;
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

            playerVector.normalize();
            this.player.setVelocity(this.PLAYER_VELOCITY * playerVector.x, this.PLAYER_VELOCITY * playerVector.y);
        
        if (this.player.y > height + 100) {
            this.gameOver();
          }
    
        }

    }
}