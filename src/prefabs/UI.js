class UIScene extends Phaser.Scene {
    constructor() {
        super("uiScene");
    }

    create() {
        // Timer
        this.timerText = this.add.text(435, 350, 'Time: 0s', { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);

        // Stars
        this.starGroup = this.add.group();
        this.registry.set('starGroup', this.starGroup);

        // Ammo UI
        this.ammoUI = [];
        for (let i = 0; i < 5; i++) {
            const bulletIcon = this.add.image(450 + i * 20, 600, 'ammo_ui').setScale(0.5).setScrollFactor(0);
            this.ammoUI.push(bulletIcon);
        }
    }

    update() {
        // Update timer
        const elapsedTime = Math.floor((this.time.now - this.registry.get('startTime')) / 1000);
        this.timerText.setText(`Time: ${elapsedTime}s`);

        // Update ammo UI
        const ammo = this.registry.get('ammo');
        this.ammoUI.forEach((icon, index) => {
            icon.setVisible(index < ammo);
        });
    }
}