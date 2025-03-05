// Code Practice: Crash_Campus
// Date: 01/31/2025

"use strict"

// let config = {
    // type: Phaser.AUTO, 
    // scene: [ MainMenu, Play],
// }

// let game = new Phaser.Game(config)

let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    // width: 640,
    // height: 480,
    // width: 1280,
    // height: 960,
    render:{
      pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade:{
            debug: true,
        },
    },
    zoom:5,
    scene: [ Play ,GameOver, COPS, TRAFFIC]
  }

let game = new Phaser.Game(config)
let cursors
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
let { height, width } = game.config

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT