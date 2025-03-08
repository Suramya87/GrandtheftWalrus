class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene")
    }
    preload(){
        this.load.path = './assets/'
        this.load.image('road', 'sidewalkhigh.png')
        this.load.image('logo', 'GTW logo.png')
        this.load.image('offbutton', 'selectbuttoff.png')
        this.load.image('onbutton', 'selectbutton.png')
        this.load.image('background', 'shaded background.png')

    }

    create(){
        this.HIGHWAY = this.add.tileSprite(0, 0, 1920, 1080, 'road').setOrigin(0,0)
        this.HIGHWAY.setScale(0.5)
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0,0)
        this.logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'logo');
        this.logo.setScale(0.5)

        let playButton = this.add.image(game.config.width / 2, game.config.height / 2 + 40, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(0.5)
        .setInteractive()
        .on('pointerover', () => {
            playButton.setTexture('onbutton'); // Change to hover image
        })
        .on('pointerout', () => {
            playButton.setTexture('offbutton'); // Revert to default image
        })
        .on('pointerdown', () => {
            this.scene.start('playScene'); // Start the game when clicked
        });

        let optionsbutton = this.add.image(game.config.width / 2, game.config.height / 2 + 70, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(0.5)
        .setInteractive()
        .on('pointerover', () => {
            optionsbutton.setTexture('onbutton'); // Change to hover image
        })
        .on('pointerout', () => {
            optionsbutton.setTexture('offbutton'); // Revert to default image
        })
        .on('pointerdown', () => {
            this.scene.start('optionsScene'); // Start the game when clicked
        });

        let creditsbutton = this.add.image(game.config.width / 2, game.config.height / 2 + 100, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(0.5)
        .setInteractive()
        .on('pointerover', () => {
            creditsbutton.setTexture('onbutton'); // Change to hover image
        })
        .on('pointerout', () => {
            creditsbutton.setTexture('offbutton'); // Revert to default image
        })
        .on('pointerdown', () => {
            this.scene.start('creditsscene'); // Start the game when clicked
        });
        

        let playText = this.add.text(playButton.x, playButton.y, 'PLAY', {
            fontFamily: 'Orbitron',
            fontSize: '15px',
            color: '#000000'
        }).setOrigin(0.5);
        let optionText = this.add.text(optionsbutton.x, optionsbutton.y, 'OPTIONS', {
            fontFamily: 'Orbitron',
            fontSize: '11px',
            color: '#000000'
        }).setOrigin(0.5);
        let creditText = this.add.text(creditsbutton.x, creditsbutton.y, 'CREDITS', {
            fontFamily: 'Orbitron',
            fontSize: '11px',
            color: '#000000'
        }).setOrigin(0.5);

    }
    

    update(){
            this.HIGHWAY.tilePositionY -= .5
    }
}