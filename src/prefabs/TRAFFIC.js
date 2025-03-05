class TRAFFIC extends Phaser.Scene {
    constructor() {
        super("TRAFFIC");
    }

    init(data) {
        this.player = data.player;
        this.roadPositions = data.roadPositions;
        this.height = data.height;
        this.trafficGroup = this.physics.add.group();
        this.trafficArray = [];  // Array to track traffic objects
    }

    create() {
        this.anims.create({ 
            key: 'bus', 
            frameRate: 0, 
            repeat: -1 ,
            frames: this.anims.generateFrameNumbers('cars', { 
                start: 0, 
                end: 0 
            }) 
        });
        this.anims.create({ 
            key: 'car', 
            frameRate: 0, 
            repeat: -1 ,
            frames: this.anims.generateFrameNumbers('cars', { 
                start: 1, 
                end: 1 
            }) 
        });
        this.anims.create({ 
            key: 'car-left', 
            frameRate: 0, 
            repeat: -1 ,
            frames: this.anims.generateFrameNumbers('cars', { 
                start: 2, 
                end: 2 
            }) 
        });
        this.anims.create({ 
            key: 'car-right', 
            frameRate: 0, 
            repeat: -1 ,
            frames: this.anims.generateFrameNumbers('cars', { 
                start: 3, 
                end: 3 
            }) 
        });
        this.anims.create({ 
            key: 'mf', 
            frameRate: 15, 
            repeat: -1 ,
            frames: this.anims.generateFrameNumbers('Biker', { 
                start: 0, 
                end: 1 
            }), 
        });

        this.spawnTraffic();
        
        // Collision with player
        this.physics.add.collider(this.trafficArray, this.player, () => {
            console.log("Collision! Player hit traffic.");
        });


        // Traffic spawns at random intervals
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000), 
            callback: () => this.spawnTraffic(),
            loop: true
        });
    }

    spawnTraffic() {
        const laneX = Phaser.Math.RND.pick(this.roadPositions);
        // const trafficType = Phaser.Math.RND.pick(["bus"]);//, "car", "biker"]);
        const trafficType = Phaser.Math.RND.pick(["bus", "car", "biker"]);
        let traffic;

        if (trafficType === "bus") {
            traffic = this.physics.add.sprite(laneX, -500, 'cars',0).setScale(4);
            traffic.setCollideWorldBounds(false);
            traffic.body.setBounce(1); 
            traffic.setImmovable(true);
            traffic.setSize(43, 100);
            // traffic.setMass(10);
            // traffic.setDrag(1000, 1000);
            traffic.setVelocity(0, 100);
            console.log(`Bus position: ${traffic.x}, ${traffic.y}`);
        } 
        else if (trafficType === "car") {
            traffic = this.physics.add.sprite(laneX, 100, 'cars',1).setScale(3);
            // traffic.play('car');
            traffic.setSize(47, 61);
            traffic.setVelocity(0, 200);
            this.time.addEvent({
                delay: Phaser.Math.Between(3000, 3000),
                callback: () => {
                    if (traffic.active) {
                    const direction = Phaser.Math.RND.pick([-1, 1]);
                    traffic.setVelocityX(50 * direction);
                    traffic.play(direction === -1 ? 'car-left' : 'car-right');
                    }
                },
                loop: true
            });
        } 
        else if (trafficType === "biker") {
            traffic = this.physics.add.sprite(laneX, 100, 'Biker',0).setScale(3);
            traffic.play('mf');
            traffic.setSize(40, 40);
            traffic.setVelocity(0, 300);
            this.time.addEvent({
                delay: Phaser.Math.Between(1500, 1500),
                callback: () => {
                    if (traffic.active) {
                    const direction = Phaser.Math.RND.pick([-1, 1]);
                    traffic.setVelocityX(75 * direction);
                }
                },
                loop: true
            });
        }

        // Add the traffic to the group and array for tracking
        // this.trafficGroup.add(traffic);
        this.trafficArray.push(traffic);  // Store the traffic in the array
    }

    update() {
        // Iterate over the trafficArray to check and remove off-screen traffic
        for (let i = this.trafficArray.length - 1; i >= 0; i--) {
            const traffic = this.trafficArray[i];
            
            // Check if the traffic object has moved off-screen (y > height + 100)
            if (traffic.y > this.height + 200) {
                console.log('Traffic removed');
                traffic.destroy();  // Destroy the traffic object
                // this.trafficGroup.remove(traffic);  // Remove from the trafficGroup
                this.trafficArray.splice(i, 1);  // Remove from the trafficArray
            }
        }
    }
}
