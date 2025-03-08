class Credits extends Phaser.Scene {
    constructor() {
      super("creditsscene")
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
        this.HIGHWAY.setScale(2)
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0,0)
        this.background.setScale(2)

        // Title
        this.add.text(game.config.width / 2, 100, "CREDITS", {
            fontFamily: "Orbitron",
            fontSize: "50px",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        // Credits List
        let creditsText = `
        DIRECTOR:  
            DESIGN: 
           CODING: 
                  ART:
            SOUND: 
       IDEATION:

        `;

        let namesText = `
        Suramya Shakya
       Samuel Webster
        Suramya Shakya
       Samuel Webster
          Samuel / Suramya
          Samuel / Suramya
        `;

        this.add.text(game.config.width / 2+100,300, namesText, {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#FFFFFF",
            align: "center"
        }).setOrigin(0.5);
        this.add.text(game.config.width / 2 - 150,325, creditsText, {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#FFFFFF",
            align: "center"
        }).setOrigin(0.5);


        let backButton = this.add.image(game.config.width / 2, game.config.height / 2 + 350, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(2)
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
            fontSize: '40px',
            color: '#000000'
        }).setOrigin(0.5);
    }
    update(){
        this.HIGHWAY.tilePositionY -= .5
}
}