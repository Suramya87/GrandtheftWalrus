class Options extends Phaser.Scene {
    constructor() {
      super("optionsScene")
    }

    // preload(){
    //     this.load.path = './assets/'
    //     this.load.image('offbutton', 'selectbuttoff.png')
    //     this.load.image('onbutton', 'selectbutton.png')
    //     this.load.image('off', 'settingSelector1.png')
    //     this.load.image('on', 'settingSelector2.png')
    //     this.load.image('back', 'optionsBack.png')


    // }
    init(data) {
        this.previousScene = data.previousScene || "menuScene"; // Default to menu if not specified
    }

    create(data){
        //PAUSE MENU EXAMPLE START HERE----------------------------------------------------------------------------------------
        // Title
        this.backGROUND = this.add.image(game.config.width / 2, game.config.height / 2 - 150,'back')
        this.backGROUND.setScale(3,2)
        this.backGROUND.setDepth(100);
        this.add.text(game.config.width / 2, 100, "OPTIONS", {
            fontFamily: "Orbitron",
            fontSize: "50px",
            color: "#FFFFFF",
        }).setOrigin(0.5).setDepth(101);
        //----------------------------------------------------------------------------------------------------
        //sound control
        // SFX Volume Label


        // Load saved volume or use defaults
        gameSettings.sfxVolume = gameSettings.sfxVolume ?? 0.5;
        gameSettings.musicVolume = gameSettings.musicVolume ?? 0.5;

        // SFX Volume Label
        this.add.text(game.config.width / 4, 165, "SFX Volume", {
            fontFamily: "Orbitron",
            fontSize: "24px",
            color: "#FFFFFF",
        }).setDepth(101);

        // Music Volume Label
        this.add.text(game.config.width / 4, 265, "Music Volume", {
            fontFamily: "Orbitron",
            fontSize: "24px",
            color: "#FFFFFF",
        }).setDepth(102);

        // Slider Graphics
        let sfxBar = this.add.rectangle(game.config.width / 2, 180, 200, 10, 0x555555).setDepth(103);
        let musicBar = this.add.rectangle(game.config.width / 2, 280, 200, 10, 0x555555).setDepth(103);

        // Position knobs based on saved volume values
        let sfxKnobX = sfxBar.x - 100 + gameSettings.sfxVolume * 200;
        let musicKnobX = musicBar.x - 100 + gameSettings.musicVolume * 200;

        let sfxKnob = this.add.rectangle(sfxKnobX, 180, 20, 20, 0xFFFFFF).setInteractive().setDepth(104);
        let musicKnob = this.add.rectangle(musicKnobX, 280, 20, 20, 0xFFFFFF).setInteractive().setDepth(104);

        // Make Sliders Draggable
        this.input.setDraggable(sfxKnob);
        this.input.setDraggable(musicKnob);

        this.input.on("drag", (pointer, obj, dragX) => {
            if (obj === sfxKnob) {
                obj.x = Phaser.Math.Clamp(dragX, sfxBar.x - 100, sfxBar.x + 100);
                gameSettings.sfxVolume = (obj.x - (sfxBar.x - 100)) / 200;
                
                // Set volume for all sound effects
                if (gameSettings.sfx) {
                    gameSettings.sfx.setVolume(gameSettings.sfxVolume);
                }
            }
            
            if (obj === musicKnob) {
                obj.x = Phaser.Math.Clamp(dragX, musicBar.x - 100, musicBar.x + 100);
                gameSettings.musicVolume = (obj.x - (musicBar.x - 100)) / 200;

                // Set volume only for music, NOT global sound
                if (gameSettings.music) {
                    gameSettings.music.setVolume(gameSettings.musicVolume);
                }
            }

            // Save the new volume settings persistently
            localStorage.setItem("sfxVolume", gameSettings.sfxVolume);
            localStorage.setItem("musicVolume", gameSettings.musicVolume);
        });

        // Load settings when opening the menu
        if (localStorage.getItem("sfxVolume")) {
            gameSettings.sfxVolume = parseFloat(localStorage.getItem("sfxVolume"));
        }
        if (localStorage.getItem("musicVolume")) {
            gameSettings.musicVolume = parseFloat(localStorage.getItem("musicVolume"));
        }

                // Load saved settings or use defaults
        gameSettings.autoAim = JSON.parse(localStorage.getItem("autoAim")) ?? false;
        gameSettings.customSounds = JSON.parse(localStorage.getItem("customSounds")) ?? false;

        //----------------------------------------------------------------------------------------------------
        // Auto Aim Mode Checkbox
        let autoAimCheckbox = this.add.sprite(game.config.width / 2, 400, gameSettings.autoAim ? 'on' : 'off').setInteractive();
        // Create label for Auto Aim
        this.add.text(game.config.width / 4, 380, "Auto Aim Mode", {
            fontFamily: "Orbitron",
            fontSize: "24px",
            color: "#FFFFFF",
        }).setDepth(102);

        // // Toggle the checkbox when clicked
        // autoAimCheckbox.on('pointerdown', () => {
        //     // Toggle the state of Auto Aim
        //     gameSettings.autoAim = !gameSettings.autoAim;

        //     // Update the texture based on the new state
        //     autoAimCheckbox.setTexture(gameSettings.autoAim ? 'on' : 'off');

        //     // Save the new state persistently
        //     localStorage.setItem("autoAim", JSON.stringify(gameSettings.autoAim));
        // });

        //----------------------------------------------------------------------------------------------------
        // Custom Sounds Checkbox
        let customSoundsCheckbox = this.add.sprite(game.config.width / 2, 500, gameSettings.customSounds ? 'on' : 'off').setInteractive();
        // Create label for Custom Sounds
        this.add.text(game.config.width / 4, 480, "Custom Sounds:", {
            fontFamily: "Orbitron",
            fontSize: "24px",
            color: "#FFFFFF",
        }).setDepth(104);

        // Toggle the checkbox when clicked
        customSoundsCheckbox.on('pointerdown', () => {
            // Toggle the state of Custom Sounds
            gameSettings.customSounds = !gameSettings.customSounds;

            // Update the texture based on the new state
            customSoundsCheckbox.setTexture(gameSettings.customSounds ? 'on' : 'off');

            // Save the new state persistently
            localStorage.setItem("customSounds", JSON.stringify(gameSettings.customSounds));
        }).setDepth(104);

        //----------------------------------------------------------------------------------------------------
        //buttons
        let backButton = this.add.image(game.config.width / 2, game.config.height / 2 + 250, 'offbutton') // Default button image
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
            this.scene.stop();
            if (this.previousScene === "playScene") {
                this.scene.resume("playScene"); // Resume gameplay if returning from pause
            } else {
                this.scene.start(this.previousScene); // Go back to menu if not from pause
            }
        });
        // let backButton = this.add.image(game.config.width / 2, game.config.height / 2 + 250, 'offbutton')
        //     .setOrigin(0.5)
        //     .setScale(2)
        //     .setInteractive()
        //     .on('pointerover', () => backButton.setTexture('onbutton'))
        //     .on('pointerout', () => backButton.setTexture('offbutton'))
        //     .on('pointerdown', () => {
        //         this.scene.stop();
        //         if (this.previousScene === "playScene") {
        //             this.scene.resume("playScene"); // Resume gameplay if returning from pause
        //         } else {
        //             this.scene.start(this.previousScene); // Go back to menu if not from pause
        //         }
        //     });

        let backText = this.add.text(backButton.x, backButton.y, 'BACK', {
            fontFamily: 'Orbitron',
            fontSize: '40px',
            color: '#000000'
        }).setOrigin(0.5);
        //END OF PAUSE MENU
        //----------------------------------------------------------------------------------------------------
    }
    update(){
}
}

// class Options extends Phaser.Scene {
//     constructor() {
//         super("optionsScene");
//     }

//     init(data) {
//         this.previousScene = data.previousScene || "menuScene"; // Default to menu if not specified
//     }

//     create() {
//         this.backGROUND = this.add.image(game.config.width / 2, game.config.height / 2 - 150, 'back')
//             .setScale(3, 2);
//         this.add.text(game.config.width / 2, 100, "OPTIONS", {
//             fontFamily: "Orbitron",
//             fontSize: "50px",
//             color: "#FFFFFF",
//         }).setOrigin(0.5);

//         // Load saved settings or set defaults
//         gameSettings.sfxVolume = gameSettings.sfxVolume ?? 0.5;
//         gameSettings.musicVolume = gameSettings.musicVolume ?? 0.5;
//         gameSettings.autoAim = JSON.parse(localStorage.getItem("autoAim")) ?? false;
//         gameSettings.customSounds = JSON.parse(localStorage.getItem("customSounds")) ?? false;

//         // Sliders
//         this.add.text(game.config.width / 4, 165, "SFX Volume", { fontFamily: "Orbitron", fontSize: "24px", color: "#FFFFFF" });
//         this.add.text(game.config.width / 4, 265, "Music Volume", { fontFamily: "Orbitron", fontSize: "24px", color: "#FFFFFF" });

//         let sfxBar = this.add.rectangle(game.config.width / 2, 180, 200, 10, 0x555555);
//         let musicBar = this.add.rectangle(game.config.width / 2, 280, 200, 10, 0x555555);
//         let sfxKnob = this.createKnob(sfxBar, gameSettings.sfxVolume, 180);
//         let musicKnob = this.createKnob(musicBar, gameSettings.musicVolume, 280);

//         // // Auto Aim Checkbox
//         // let autoAimCheckbox = this.createCheckbox(game.config.width / 2, 400, gameSettings.autoAim, "Auto Aim Mode", 380, "autoAim");

//         // Custom Sounds Checkbox
//         let customSoundsCheckbox = this.createCheckbox(game.config.width / 2, 500, gameSettings.customSounds, "Custom Sounds:", 480, "customSounds");

//         // BACK Button (returns to either the menu or pause)
//         let backButton = this.add.image(game.config.width / 2, game.config.height / 2 + 250, 'offbutton')
//             .setOrigin(0.5)
//             .setScale(2)
//             .setInteractive()
//             .on('pointerover', () => backButton.setTexture('onbutton'))
//             .on('pointerout', () => backButton.setTexture('offbutton'))
//             .on('pointerdown', () => {
//                 this.scene.stop();
//                 if (this.previousScene === "playScene") {
//                     this.scene.resume("playScene"); // Resume gameplay if returning from pause
//                 } else {
//                     this.scene.start(this.previousScene); // Go back to menu if not from pause
//                 }
//             });

//         this.add.text(backButton.x, backButton.y, 'BACK', { fontFamily: 'Orbitron', fontSize: '40px', color: '#000000' }).setOrigin(0.5);
//     }

//     // Creates slider knobs for volume controls
//     createKnob(bar, volume, y) {
//         let knobX = bar.x - 100 + volume * 200;
//         let knob = this.add.rectangle(knobX, y, 20, 20, 0xFFFFFF).setInteractive();
//         this.input.setDraggable(knob);

//         this.input.on("drag", (pointer, obj, dragX) => {
//             if (obj === knob) {
//                 obj.x = Phaser.Math.Clamp(dragX, bar.x - 100, bar.x + 100);
//                 let newVolume = (obj.x - (bar.x - 100)) / 200;
//                 if (y === 180) {
//                     gameSettings.sfxVolume = newVolume;
//                     if (gameSettings.sfx) gameSettings.sfx.setVolume(newVolume);
//                 } else {
//                     gameSettings.musicVolume = newVolume;
//                     if (gameSettings.music) gameSettings.music.setVolume(newVolume);
//                 }
//                 localStorage.setItem(y === 180 ? "sfxVolume" : "musicVolume", newVolume);
//             }
//         });

//         return knob;
//     }

//     // Creates checkboxes for settings
//     createCheckbox(x, y, isChecked, label, labelY, settingKey) {
//         this.add.text(game.config.width / 4, labelY, label, { fontFamily: "Orbitron", fontSize: "24px", color: "#FFFFFF" });
//         let checkbox = this.add.sprite(x, y, isChecked ? 'on' : 'off').setInteractive();
//         checkbox.on('pointerdown', () => {
//             gameSettings[settingKey] = !gameSettings[settingKey];
//             checkbox.setTexture(gameSettings[settingKey] ? 'on' : 'off');
//             localStorage.setItem(settingKey, JSON.stringify(gameSettings[settingKey]));
//         });
//         return checkbox;
//     }
// }

