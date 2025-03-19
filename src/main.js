// Code Practice: Crash_Campus
// Date: 01/31/2025

"use strict"



// let config = {
    // type: Phaser.AUTO, 
    // scene: [ MainMenu, Play],
// }
// let game = new Phaser.Game(config)
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
    // width: 480,
    // height: 360,
    // width: 640,
    // height: 480,
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
  }


let game = new Phaser.Game(config)
let cursors
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
let { height, width } = game.config

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT