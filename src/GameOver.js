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
        this.add.text(width / 2, height / 2 - 100, 'Game Over', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Show time survived
        this.add.text(width / 2, height / 2, `Time Survived: ${this.timeSurvived}s`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Show high score
        this.add.text(width / 2, height / 2 + 50, `High Score: ${this.highScore}s`, {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Restart Button
        const restartButton = this.add.text(width / 2, height / 2 + 150, 'Restart', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('playScene'); // Restart the game
        });
    }
}