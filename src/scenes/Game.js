import Phaser from 'phaser'

// import constant keys
import * as Paths from '../constants/Paths'
import * as Scenes from '../constants/SceneKeys'
import * as Objects from '../constants/ObjectKeys'
import * as Animations from '../constants/Animations'

export default class Game extends Phaser.Scene {
  preload() {
    // load ground
    this.load.image(Objects.ground, Paths.groundImg)
    this.load.spritesheet(Objects.playerIdle, Paths.playerIdleSprite, {
      frameWidth: 31,
      frameHeight: 43
    })
    this.load.spritesheet(Objects.playerShooting, Paths.playerShootingSprite, {
      frameWidth: 44,
      frameHeight: 43
    })
    this.load.spritesheet(Objects.enemy, Paths.enemySprite, {
      frameWidth: 16,
      frameHeight: 12
    })
    this.load.spritesheet(Objects.explosion, Paths.explosionSprite, {
      frameWidth: 16,
      frameHeight: 12
    })
  }

  create() {
    // load parallax scene as background
    this.scene.run(Scenes.Parallax)
    this.scene.sendToBack(Scenes.Parallax)

    // add ground
    this.ground = this.add.image(400, 435, Objects.ground)
    this.physics.add.existing(this.ground, true)

    // add player
    this.player = this.createPlayer()
    // add enemy
    this.enemy = this.createEnemy()

    // add collider between player and ground
    this.physics.add.collider(this.player, this.ground)
    // add collider between enemy and ground
    this.physics.add.collider(this.enemy, this.ground)

    // create listener for cursorkeys
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    // change speed when player kills enemy
    let speed = 1
    this.player.anims.play(Animations.playerIdle, true)
    this.enemy.anims.play(Animations.enemy, true)

    this.time.delayedCall(1500, () => this.moveEnemy(speed))

    if (this.enemy.x === this.player.x + 41) {
      this.hitEnemy()
    }
  }

  /**
   * @param {Phaser.GameObjects.Sprite} player
  */

  hitEnemy() {
    this.scene.start(Scenes.GameOver)
  }

  /** @param {number} speed */

  moveEnemy(speed) {
    this.enemy.x -= speed
  }

  createPlayer() {
    const player = this.add.sprite(50, 225, Objects.playerIdle)
    this.physics.add.existing(player)

    this.anims.create(
      {
        key: Animations.playerIdle,
        frames: this.anims.generateFrameNumbers(Objects.playerIdle, { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
      }
    )
    this.anims.create(
      {
        key: Animations.playerShooting,
        frames: this.anims.generateFrameNumbers(Objects.playerShooting, { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
      }
    )
    this.anims.create(
      {
        key: Animations.explosion,
        frames: this.anims.generateFrameNumbers(Objects.explosion, { start: 0, end: 8 }),
        frameRate: 10,
      }
    )

    return player
  }

  createEnemy() {
    const enemy = this.add.sprite(750, 225, Objects.enemy).setScale(2)
    this.physics.add.existing(enemy)

    this.anims.create(
      {
        key: Animations.enemy,
        frames: this.anims.generateFrameNumbers(Objects.enemy, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      }
    )

    return enemy
  }
}
