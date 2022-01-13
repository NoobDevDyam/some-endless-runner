import Phaser from 'phaser'

// import constant keys
import * as Scenes from '../constants/SceneKeys'

export default class GameOver extends Phaser.Scene {
  create() {
    this.add.text(400, 225, 'GAME OVER!', {
      fontSize: 48
    }).setOrigin(0.5)
    this.add.text(400, 400, 'Press [SPACE] to Try Again').setOrigin(0.5)

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start(Scenes.Game)
    })
  }
}
