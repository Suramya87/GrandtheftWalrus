// Code Practice: Crash_Campus
// Date: 01/31/2025

"use strict"



////////////////////////TECHNICAL EXECUTION//////////////////////////
// 1) physics systems: This game contains hit boxes movable/imoveble objects and even a drag mechanic
// 2) cameras: This game contains a following camera
// 3) particle effects: while drifting there are some particle effects (we wanted to do more but the game was already feeling like a bit much to handle)
// 4) text objects: we have small text objects on the UI of the game
// 5) the animation manager: there are animations for the player, cop cars and the penguin
// 6) the tween manager: The slugs shells use tweens to make their animation possible
// 7) timers: there are things like penguing and cop spawns and star level that rely on the use of timers
// 8) tilemaps: the whole map of teh game was made using tiled.
let gameSettings = {
  sfxVolume: .5,  // Default max volume
  musicVolume: .5,
  music: null, // To store persistent music
  background: null, // Store background reference
  autoaim: false,
  customSounds: false
};


let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 960,
    render:{
      pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade:{
            debug: false,
        },
    },
    
    zoom:1,

    scene: [clicktostart, backgroundScene, Menu, Credits, Options, tutorial, Play, GameOver, ]
    // scene: [clicktostart, Play, GameOver, ]
  }


let game = new Phaser.Game(config)
let cursors
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
let { height, width } = game.config

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT