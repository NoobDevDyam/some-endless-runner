import Phaser from 'phaser'

// import constant keys
import * as Scenes from './src/constants/SceneKeys'

// import Scenes
import Game from './src/scenes/Game'
import GameOver from './src/scenes/GameOver'
import Parallax from './src/scenes/ParallaxBackground'
import Title from './src/scenes/TitleScreen'
import Credits from './src/scenes/Credits'

const config = {
  // phaser game config
  width: 800,
  height: 450,
  type: Phaser.AUTO,
  // backgroundColor: '#616161',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: true
    }
  }
}

const game = new Phaser.Game(config)

// add scene using defined key + scene file
game.scene.add(Scenes.Game, Game)
game.scene.add(Scenes.GameOver, GameOver)
game.scene.add(Scenes.Parallax, Parallax)
game.scene.add(Scenes.Title, Title)
game.scene.add(Scenes.Credits, Credits)

game.scene.start(Scenes.Title)
