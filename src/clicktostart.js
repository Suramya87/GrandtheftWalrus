class clicktostart extends Phaser.Scene {
    constructor() {
      super("clicktostartScene")
    }

    preload(){
        // Click to start
        this.load.path = './assets/'
        this.load.audio('vicecity', 'vice-city-vibes-grand-theft-auto-style-soundtrack-301060.mp3')
        this.load.image('road', 'sidewalkhigh.png')
        this.load.image('background', 'shaded background.png')
        this.load.image('cabinet', 'cabinet.png')
        this.load.image('gun', 'gun.png')
        this.load.image('gunflash', 'gunflash.png')
        this.load.image('buttons', 'buttons.png')
        this.load.image('logo', 'GTW logo.png')
        this.load.image('offbutton', 'selectbuttoff.png')
        this.load.image('onbutton', 'selectbutton.png')

        // this.load.path = './assets/'
        // Menu
        this.load.image('logo', 'GTW logo.png')
        this.load.image('offbutton', 'selectbuttoff.png')
        this.load.image('onbutton', 'selectbutton.png')
        this.load.audio('vicecity', 'vice-city-vibes-grand-theft-auto-style-soundtrack-301060.mp3')
        this.load.image('tutorial', 'tutorialmenu.png')


        // Moving things
        this.load.spritesheet('character', 'player anims.png', { frameWidth: 64,frameHeight: 128 });
        this.load.spritesheet('COPS', 'copcarANIMS.png', { frameWidth: 128,frameHeight: 64 });
        this.load.spritesheet('PENGUIN', 'penguin.png', { frameWidth: 32,frameHeight: 32 });


        // Maps
        this.load.image('test', 'kidnap.png');
        this.load.tilemapTiledJSON('testJSON', 'temp_test.json');

        this.load.image('MAPMAP', 'highwaysheet.png');
        this.load.tilemapTiledJSON('MAPJSON', 'MAP MAP.json');
        // this.load.spritesheet('COPS', 'copcarANIMS.png', { frameWidth: 128,frameHeight: 64 });
        
        this.load.audio('rumble', 'rumblestripSound.wav'); 

        // UI
        this.load.image('off', 'settingSelector1.png')
        this.load.image('on', 'settingSelector2.png')
        this.load.image('back', 'optionsBack.png')
        this.load.image('X', 'Xbutt.png')
        this.load.image('pause', 'pause.png')
        this.load.image('offbutton', 'selectbuttoff.png')
        this.load.image('onbutton', 'selectbutton.png')
        this.load.image('unpause', 'unpause.png')
        this.load.image('star', 'star.png')
        this.load.image('smoke', 'smoke.png')
        this.load.image('bullet', 'bullet.png');
        this.load.image('ammo_ui', 'shotgunshell.png');
        this.load.image('shellback', 'shotguninstert.png');

        this.load.image('cone', 'cone.png');
        this.load.image('WALRUS', 'walrus.png');
        this.load.image('HP_bar','speedometer.png')
        this.load.image('wasted', 'WALRUSED.png')

        // credit 
        this.load.image('offbutton', 'selectbuttoff.png')
        this.load.image('onbutton', 'selectbutton.png')
        

        //play sound effects:
        this.load.audio('drift', 'drift sound.mp3')
        this.load.audio('blast', 'shotgunblast.mp3')
        this.load.audio('rumble', 'rumblestripSound.wav')
        this.load.audio('police', 'policesiren.mp3')
        this.load.audio('crashSound', 'crash sound.wav')
        this.load.audio('reload', 'reload.mp3')

        //custom
        this.load.audio('chkchk', 'chkchk.m4a')
        this.load.audio('blam', 'BLAM.m4a')
        this.load.audio('crash', 'crash.m4a')
        this.load.audio('deathsound', 'death sound1.m4a')



    }

    create(){

        this.HIGHWAY = this.add.tileSprite(0, 0, 1920, 1080, 'road')
            .setOrigin(0, 0)
            .setScale(2);

        this.background = this.add.tileSprite(0, 0, 640, 480, 'background')
            .setOrigin(0, 0)
            .setScale(2);
        
        this.logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2-100, 'logo')
            .setScale(1);
        let startText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'ARM YOUR SELF', {
                fontFamily: 'Orbitron',
                fontSize: '45px',
                color: '#FFFFFF'
            }).setOrigin(0.5);
        
            this.tweens.add({
                targets: startText,
                alpha: { from: 1, to: 0 }, // Fade out (1 -> 0)
                duration: 1000, // 1 second fade duration
                yoyo: true, // Fade back in after fading out
                repeat: -1, // Loop infinitely
                ease: 'Sine.easeInOut' // Smooth easing for a gradual effect
            });
        
        this.cabinet = this.add.image(this.cameras.main.width / 2+18, this.cameras.main.height / 2 - 190, 'cabinet')
            .setScale(1.5,1);
        this.buttons = this.add.image(this.cameras.main.width / 2-300, this.cameras.main.height / 2+350, 'buttons')

       

        let gunselect = this.add.image(game.config.width / 2+300, game.config.height / 2+410, 'gun') // Default button image
        .setOrigin(0.5)
        .setScale(1)
        .setInteractive()
        .on('pointerover', () => {
            gunselect.setTexture('gunflash'); // Change to hover image
        })
        .on('pointerout', () => {
            gunselect.setTexture('gun'); // Revert to default image
        })
        .on('pointerdown', () => {
            this.scene.start('backgroundScene'); // Start the game when clicked
        });

    }
    update() {
        this.HIGHWAY.tilePositionY -= .5; // Scroll faster
    }
}