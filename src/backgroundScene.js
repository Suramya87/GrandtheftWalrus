class backgroundScene extends Phaser.Scene {
    constructor() {
        super({ key: "backgroundScene", active: true });
    }
    preload(){
        this.load.path = './assets/'
        this.load.image('road', 'sidewalkhigh.png')
        this.load.image('background', 'shaded background.png')
    }
    create() {
        this.HIGHWAY = this.add.tileSprite(0, 0, 1920, 1080, 'road')
            .setOrigin(0, 0)
            .setScale(2);

        this.background = this.add.tileSprite(0, 0, 640, 480, 'background')
            .setOrigin(0, 0)
            .setScale(2);
        
            this.scene.launch("menuScene");
    }

    update() {
        this.HIGHWAY.tilePositionY += .5; // Scroll faster
    }
}
