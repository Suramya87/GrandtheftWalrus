class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        this.timeSurvived = data.timeSurvived || 0;
        this.highScore = data.highScore || 0;
    }

    create() {
        // Add "Game Over" text
        
            this.background = this.add.tileSprite(0, 0, 640, 480, 'background')
            .setOrigin(0, 0)
            .setScale(2);
            this.logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2-150, 'wasted')
            .setScale(1.5);
        // Show time survived
        this.add.text(width / 2, height / 2, `Time Survived: ${this.timeSurvived}s`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);

        // Show high score
        this.add.text(width / 2, height / 2 + 50, `High Score: ${this.highScore}s`, {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);

        // Restart Button

        let playButton = this.add.image(game.config.width / 2, game.config.height / 2 + 250, 'offbutton') // Default button image
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
        let playText = this.add.text(playButton.x, playButton.y, 'RESTART', {
            fontFamily: 'Orbitron',
            fontSize: '35px',
            color: '#000000'
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
            this.scene.resume('playScene'); // Start the game when clicked
            this.scene.stop('playScene');
            this.scene.start('backgroundScene'); // Start the game when clicked
        });

        let backText = this.add.text(backButton.x, backButton.y, 'BACK', {
            fontFamily: 'Orbitron',
            fontSize: '40px',
            color: '#000000'
        }).setOrigin(0.5);
    }
}