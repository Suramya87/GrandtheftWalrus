class Credits extends Phaser.Scene {
    constructor() {
      super("creditsscene")
    }


    create(){
        
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
             MUSIC:

        `;

        let namesText = `
        Suramya Shakya
       Samuel Webster
        Suramya Shakya
       Samuel Webster
  PIXABOY.com
          Samuel / Suramya
DeltaX-Music
        `;
        let THANKS = `
        THANK YOU TO ALL OF OUR PLAY TESTERS
        AND THANK YOU FOR PLAYING OUR GAME!
        `;
        this.add.text(game.config.width / 2+165,310, namesText, {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#FFFFFF",
            align: "center"
        }).setOrigin(0.5);
        this.add.text(game.config.width / 2-50,600, THANKS, {
            fontFamily: "Orbitron",
            fontSize: "40px",
            color: "#FFFFFF",
            align: "center"
        }).setOrigin(0.5);
        this.add.text(game.config.width / 2 - 165,335, creditsText, {
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
}
}