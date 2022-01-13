import Phaser from 'phaser'

// import constant keys
import * as Paths from '../constants/Paths'
import * as Scenes from '../constants/SceneKeys'
import * as Objects from '../constants/ObjectKeys'

export default class TitleScreen extends Phaser.Scene {
  init() {
    this.cache.destroy()
  }

  preload() {
    this.load.image(Objects.title, Paths.titleImg)
  }

  create() {
    this.add.image(400, 180, Objects.title).setScale(0.5)
    this.add.text(400, 280, 'Press [SPACE] to Start').setOrigin(0.5)
    this.add.text(400, 300, 'Press [C] for Credits').setOrigin(0.5)

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start(Scenes.Game)
    })
    this.input.keyboard.once('keydown-C', () => {
      this.scene.start(Scenes.Credits)
    })
  }
}
