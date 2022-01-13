import Phaser from 'phaser'

// import constant keys
import * as Scenes from '../constants/SceneKeys'

export default class Credits extends Phaser.Scene {
  create() {
    this.add.text(400, 50, 'Music by Josh Kirwin').setOrigin(0.5)
    this.add.text(400, 100, 'sfx by Kenny').setOrigin(0.5)
    this.add.text(400, 150, 'Images by Vaca Roxa').setOrigin(0.5)
    this.add.text(400, 200, 'Developed by Jam :)').setOrigin(0.5)
    this.add.text(400, 400, 'Press [SPACE] to Start').setOrigin(0.5)

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start(Scenes.Game)
    })
  }
}
