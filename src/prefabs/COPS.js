class COPS extends Phaser.Scene {
    constructor() {
        super("DA_POLICE");
    }

    init(data) {
        
        this.overrideMovement = true;
        this.player = data.player;
        this.SPEED_MULTIPLIER = data.SPEED_MULTIPLIER;
        this.roadPositions = data.roadPositions;
        this.height = data.height;
        this.CHASE_VELOCITY = data.CHASE_VELOCITY;
        this.followerSpeed = data.followerSpeed;
        this.CHASE = false;
        this.reposition = false;
        this.PATROL_COOLDOWN = 100;
        this.trailway = 200 
        
        this.activeCops = []; // Array to store active cops
    }

    create() {
        // Create animations for the cops
        this.anims.create({
            key: 'chillin',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('COPS', {
                start: 0,
                end: 0
            })
        });

        this.anims.create({
            key: 'not-chillin',
            frameRate: 15,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('COPS', {
                start: 1,
                end: 4
            })
        });
        this.anims.create({
            key: 'imma-head-out',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('COPS', {
                start: 5,
                end: 5
            })
        });
    }

    addCop() {
        let playScene = this.scene.get('playScene'); 
        // Randomly spawn the cop in one of the road positions
        const spawnX = Phaser.Math.RND.pick(this.roadPositions); // Random X position
        const spawnY = -50; // Spawn above the screen

        // Create the cop sprite at the random position
        const cop = this.physics.add.sprite(spawnX, spawnY, 'COPS', 0).setScale(3);
        cop.setSize(56, 64);

        // Add collision between cop and player
        this.physics.add.collider(cop, this.player, () => {
            if (this.scene.get('playScene').LANES) {
                playScene.gameOver();
            }
        });
        // Add collision between this cop and other cops
        this.activeCops.forEach(otherCop => {
            this.physics.add.collider(cop, otherCop);
        });

        // Add the cop to the activeCops array
        this.activeCops.push(cop);


        // // Set initial target position
        cop.TARGET_X = Phaser.Math.RND.pick(this.roadPositions);
        cop.TARGET_Y = Phaser.Math.Between(0, this.height);
        const shiftTime = Phaser.Math.Between(2000, 30000);
        this.time.delayedCall(shiftTime, () => { // Change 3000 to desired delay (in ms)
            console.log(shiftTime)
            if (cop.active) {
                cop.overrideMovement = true;
                cop.setVelocity(0, 0)
                cop.setVelocity(0, 300); // Move straight down
                cop.play('imma-head-out');
                console.log('Cop movement overridden: Moving straight down.');
            }
        });
        return cop; // Return the cop sprite for further manipulation if needed
    }


    update() {

        // Update logic for each active cop
        for (let i = this.activeCops.length - 1; i >= 0; i--) {
            const cop = this.activeCops[i];

            if (!cop.overrideMovement && this.scene.get('playScene').LANES && !this.CHASE) {
                cop.play('not-chillin');
                this.CHASE = true;
                cop.TARGET_X = Phaser.Math.RND.pick(this.roadPositions);
                cop.TARGET_Y = Phaser.Math.Between(0, this.height);
            }

            if (!cop.overrideMovement && this.scene.get('playScene').LANES && this.CHASE) {
                const direction = new Phaser.Math.Vector2(
                    this.player.x - cop.x,
                    this.player.y - cop.y
                );

                direction.normalize();
                cop.setVelocity(
                    direction.x * this.CHASE_VELOCITY,
                    direction.y * this.CHASE_VELOCITY
                );
            } else if (!cop.overrideMovement && !this.scene.get('playScene').LANES) {
                this.CHASE = false;
                this.reposition = false;
                cop.play('chillin');
                const direction = new Phaser.Math.Vector2(
                    cop.TARGET_X - cop.x,
                    cop.TARGET_Y - cop.y
                );

                direction.normalize();
                cop.setVelocity(
                    direction.x * this.followerSpeed,
                    direction.y * this.followerSpeed / 2
                );
            }

            // Destroy the cop if it goes off-screen
            if (cop.y > this.height + 100) {
                console.log('Cop removed');
                cop.destroy();
                this.activeCops.splice(i, 1);
            }
        }
    }
}