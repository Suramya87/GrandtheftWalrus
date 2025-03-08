class Options extends Phaser.Scene {
    constructor() {
      super("optionsScene")
    }

    preload(){
        this.load.path = './assets/'
        this.load.image('road', 'sidewalkhigh.png')
        this.load.image('offbutton', 'selectbuttoff.png')
        this.load.image('onbutton', 'selectbutton.png')
        this.load.image('background', 'shaded background.png')

    }

    create(){
        this.HIGHWAY = this.add.tileSprite(0, 0, 1920, 1080, 'road').setOrigin(0,0)
        this.HIGHWAY.setScale(0.5)
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0,0)


        // Title
        this.add.text(game.config.width / 2, 50, "OPTIONS", {
            fontFamily: "Orbitron",
            fontSize: "20px",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        let backButton = this.add.image(game.config.width / 2, game.config.height / 2 + 100, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(0.5)
        .setInteractive()
        .on('pointerover', () => {
            backButton.setTexture('onbutton'); // Change to hover image
        })
        .on('pointerout', () => {
            backButton.setTexture('offbutton'); // Revert to default image
        })
        .on('pointerdown', () => {
            this.scene.start('menuScene'); // Start the game when clicked
        });

        let backText = this.add.text(backButton.x, backButton.y, 'BACK', {
            fontFamily: 'Orbitron',
            fontSize: '20',
            color: '#000000'
        }).setOrigin(0.5);

    }
    update(){
        this.HIGHWAY.tilePositionY -= .5
}
}