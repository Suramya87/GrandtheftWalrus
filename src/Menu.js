class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene")
    }
    preload(){
        this.load.path = './assets/'
        this.load.image('logo', 'GTW logo.png')
        this.load.image('offbutton', 'selectbuttoff.png')
        this.load.image('onbutton', 'selectbutton.png')
        this.load.audio('vicecity', 'vice-city-vibes-grand-theft-auto-style-soundtrack-301060.mp3')

    }

    create(){
        if (!gameSettings.music) {
            gameSettings.music = this.sound.add("vicecity", { 
                volume: gameSettings.musicVolume, 
                loop: true 
            });
            gameSettings.music.play();
        }
    
        // LOGO
        this.logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'logo')
            .setScale(2);
        let playButton = this.add.image(game.config.width / 2, game.config.height / 2 + 150, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(2)
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

        let optionsbutton = this.add.image(game.config.width / 2, game.config.height / 2 + 250, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(2)
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

        let creditsbutton = this.add.image(game.config.width / 2, game.config.height / 2 + 350, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(2)
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
            fontSize: '35px',
            color: '#000000'
        }).setOrigin(0.5);
        let optionText = this.add.text(optionsbutton.x, optionsbutton.y, 'OPTIONS', {
            fontFamily: 'Orbitron',
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);
        let creditText = this.add.text(creditsbutton.x, creditsbutton.y, 'CREDITS', {
            fontFamily: 'Orbitron',
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);

    }
    

    update(){
    }
}