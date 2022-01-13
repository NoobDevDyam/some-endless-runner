/* eslint-disable indent */
/* eslint-disable function-paren-newline */
/* eslint-disable function-call-argument-newline */
import Phaser from 'phaser'

// import constant keys
import * as Paths from '../constants/Paths'
import * as Objects from '../constants/ObjectKeys'

export default class ParallaxBackground extends Phaser.Scene {
  preload() {
    this.load.image(Objects.firstCloud, Paths.firstCloudImg)
    this.load.image(Objects.secondCloud, Paths.secondCloudImg)
    this.load.image(Objects.background, Paths.backgroundImg)
  }

  create() {
    this.add.image(400, 225, Objects.background).setScale(2)
    this.secondCloud = this.add.tileSprite(0, -100, 800, 450, Objects.secondCloud).setScale(2)
    this.firstCloud = this.add.tileSprite(0, -50, 800, 500, Objects.firstCloud).setScale(2)

    this.secondCloud.blendMode = Phaser.BlendModes.DARKEN
  }

  update() {
    this.secondCloud.tilePositionX += 0.3
    this.firstCloud.tilePositionX += 0.5
  }
}
