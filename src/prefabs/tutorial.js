class tutorial extends Phaser.Scene {
    constructor() {
      super("tutorialScene")
    }
    create(){
        //tutorial box
        this.tutorial = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2-20, 'tutorial')
        .setScale(2,3);

        this.add.text(game.config.width / 2, 100, "TUTORIAL", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        this.add.text(380, 210, "W", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#808285",
        }).setOrigin(0.5);
        this.add.text(315, 290, "A", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#808285",
        }).setOrigin(0.5);
        this.add.text(450, 290, "D", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#808285",
        }).setOrigin(0.5);
        this.add.text(510, 220, "OR", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#FFFFFF",
        }).setOrigin(0.5);

        this.add.text(510, 425, "DRIFT", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#808285",
        }).setOrigin(0.5);
        this.add.text(415, 590, "ESC", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#808285",
        }).setOrigin(0.5);
        this.add.text(570, 590, "PAUSE", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#414042",
        }).setOrigin(0.5);
        this.add.text(695, 590, "Z", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#808285",
        }).setOrigin(0.5);
        this.add.text(810, 590, "ZOOM", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#414042",
        }).setOrigin(0.5);
        this.add.text(920, 290, "FIRE", {
            fontFamily: "Orbitron",
            fontSize: "35px",
            color: "#808285",
        }).setOrigin(0.5);

        this.add.text(912, 470, "X", {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#808285",
        }).setOrigin(0.5);
        
        //buttons
        let continuebutton = this.add.image(game.config.width / 2+250, game.config.height / 2 + 300, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(2)
        .setInteractive()
        .on('pointerover', () => {
            continuebutton.setTexture('onbutton'); // Change to hover image
        })
        .on('pointerout', () => {
            continuebutton.setTexture('offbutton'); // Revert to default image
        })
        .on('pointerdown', () => {
            this.scene.start('playScene'); // Start the game when clicked
        });
        let continueText = this.add.text(continuebutton.x, continuebutton.y, 'CONTINUE', {
            fontFamily: 'Orbitron',
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);

        let backbutton = this.add.image(game.config.width / 2-250, game.config.height / 2 + 300, 'offbutton') // Default button image
        .setOrigin(0.5)
        .setScale(2)
        .setInteractive()
        .on('pointerover', () => {
            backbutton.setTexture('onbutton'); // Change to hover image
        })
        .on('pointerout', () => {
            backbutton.setTexture('offbutton'); // Revert to default image
        })
        .on('pointerdown', () => {
            this.scene.start('menuScene'); // Start the game when clicked
        });
        let backText = this.add.text(backbutton.x, backbutton.y, 'BACK', {
            fontFamily: 'Orbitron',
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);
    }

}