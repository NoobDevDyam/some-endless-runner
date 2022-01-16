import Phaser from 'phaser'

// import constant keys
import * as Paths from '../constants/Paths'
import * as Scenes from '../constants/SceneKeys'
import * as Objects from '../constants/ObjectKeys'
import * as Animations from '../constants/Animations'

// import random words API
const randomWords = require('random-words')

export default class Game extends Phaser.Scene {
  init() {
    this.score = 0
    this.enemy = undefined
  }

  preload() {
    // load ground
    this.load.image(Objects.ground, Paths.groundImg)
    // load sprites
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
      frameWidth: 32,
      frameHeight: 32
    })

    // TODO: Add BGM
    // add bgm
    this.load.audio(Objects.music, Paths.music)
    // add sfx
    this.load.audio(Objects.enemyDeath, Paths.enemyDeath)
    this.load.audio(Objects.typing, Paths.typing)
    this.load.audio(Objects.playerDeath, Paths.playerDeath)
  }

  create() {
    // load bgm
    this.music = this.sound.add(Objects.music, { loop: true })
    // load sfx
    this.explosion = this.sound.add(Objects.enemyDeath, { loop: false })
    this.typing = this.sound.add(Objects.typing, { loop: false })
    this.death = this.sound.add(Objects.playerDeath, { loop: false })

    // set volume so it's not way too dank
    this.sound.volume = 0.3

    // play bgm
    this.music.play()

    // load parallax scene as background
    this.scene.run(Scenes.Parallax)
    this.scene.sendToBack(Scenes.Parallax)

    // add ground
    this.ground = this.add.image(400, 435, Objects.ground)
    this.physics.add.existing(this.ground, true)

    // add player
    this.player = this.createPlayer()
    // add enemy
    this.enemy = this.createEnemyGroup(this.createEnemy())

    // add collider between player and ground
    this.physics.add.collider(this.player, this.ground)
    // add collider between enemy and ground
    this.physics.add.collider(this.enemy, this.ground)
    // add collider between player and enemy
    // detect if enemy has hit the player
    this.physics.add.collider(this.player, this.enemy, this.hitEnemy, null, this)

    // add scoretext
    this.scoreLabel = this.add.text(400, 50, this.score, {
      fontSize: 36,
      color: 0xff0000
    })

    // add text for instructions
    this.add.text(400, 100, 'Type the word to DESTROY your enemies').setOrigin(0.5)
    this.wordInputLabel = this.add.text(400, 225, '', {
      fontSize: 48,
      color: 0x0000ff
    }).setOrigin(0.5)

    // keyboard input
    this.input.keyboard.on('keydown', (event) => {
      if (event.keyCode === 8 && this.wordInputLabel.text.length > 0) {
        this.wordInputLabel.text = this.wordInputLabel.text
          .substring(0, this.wordInputLabel.text.length - 1) // delete last typed letter
      } else if (event.keyCode > 57 && event.keyCode <= 90) {
        this.wordInputLabel.text += event.key
        this.typing.play()
      }
    })
  }

  update() {
    // change speed when player kills enemy
    this.speed = 1
    // play player animation
    this.player.anims.play(Animations.playerIdle, true)
    // iterate over each child and play their animations
    this.enemy.children.iterate((child) => {
      child.anims.play(Animations.enemy, true)
    })

    // delay the movement of the enemy when starting the game
    this.time.delayedCall(1500, () => this.moveEnemy(this.speed))

    this.wordInput = this.wordInputLabel.text

    // some debug stuff because im dumb without them
    console.log(`Text: ${this.wordInput}`)
    console.log(`Word: ${this.word}`)
    console.log(`Score: ${this.score}`)

    // check if the word typed is equal to the word given
    if (this.wordInput === this.word
      && this.word.length === this.wordInput.length) {
      this.player.anims.play(Animations.playerShooting, true)
      this.explosion.play()
      this.killEnemy()
      // update score
      this.scoreLabel.text = this.score
    } else {
      console.log('not equal')
    }

    // check if enemy count is zero
    if (this.enemy.countActive(true) === 0) {
      this.enemy.add(this.createEnemy())
    }

    // inscrease enemy speed when score reaches certain threshhold.
    if (this.score > 25) {
      this.speed = 3
    } else if (this.score > 15) {
      this.speed = 2.5
    } else if (this.score > 10) {
      this.speed = 2
    } else if (this.score > 5) {
      this.speed = 1.5
    }
  }

  // method called to kill / destroy enemy
  killEnemy() {
    this.score += 1
    this.enemy.children.iterate((child) => {
      // disable the enemy
      child.destroy()
    })
    this.wordInputLabel.text = ''
    this.wordLabel.text = ''
    console.log('enemy killed')
  }

  /**
   * @param {Phaser.GameObjects.Sprite} player
  */

  hitEnemy() {
    this.music.stop()
    this.death.play()
    this.scene.start(Scenes.GameOver)
  }

  /** @param {number} speed */

  moveEnemy(speed) {
    this.enemy.children.iterate((child) => {
      // eslint-disable-next-line no-param-reassign
      child.x -= speed
    })
  }

  // we declare all player animations here
  // we also create the player here, this function returns the player sprite and gameobject
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
        frames: this.anims.generateFrameNumbers(Objects.playerShooting, { start: 0, end: 1 }),
        frameRate: 10,
      }
    )

    return player
  }

  // we create an enemy and add that enemy to a group to get more enemies
  createEnemy() {
    this.word = this.createWord()

    const enemy = this.add.sprite(750, 225, Objects.enemy).setScale(2)

    this.wordLabel = this.add.text(400, 150, this.word, {
      fontSize: 38
    }).setOrigin(0.5)

    this.anims.create(
      {
        key: Animations.enemy,
        frames: this.anims.generateFrameNumbers(Objects.enemy, { start: 0, end: 3 }),
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

    return enemy
  }

  createEnemyGroup(enemy) {
    const enemyGroup = this.physics.add.group()

    enemyGroup.add(enemy)
    return enemyGroup
  }

  // TODO: Use an API To generate random words. -- DONE
  // eslint-disable-next-line class-methods-use-this
  createWord() {
    let length = 3

    // change length of generated words with inscreased score
    if (this.score > 50) {
      length = 10
    } else if (this.score > 20) {
      length = 8
    } else if (this.score > 10) {
      length = 7
    } else if (this.score > 5) {
      length = 5
    }

    // generate an array of 10 words
    const words = randomWords({ exactly: 10, maxLength: length })
    const testWords = [
      'PASS',
      'SOFTWARE',
      'DEVELOPMENT',
      'PLEASE',
      'COFFEE',
      'GRAPHICS',
      'LAPTOP',
      'ELECTRON',
      'COMPUTER',
      'NINJA',
      'SLEEP'
    ]
    const wordIndex = Phaser.Math.Between(0, words.length - 1)

    return words[wordIndex]
  }
}
