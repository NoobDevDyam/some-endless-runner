import Phaser from 'phaser'

// import constant keys
import * as Paths from '../constants/Paths'
import * as Scenes from '../constants/SceneKeys'
import * as Objects from '../constants/ObjectKeys'
import * as Animations from '../constants/Animations'

export default class Game extends Phaser.Scene {
  init() {
    this.score = 0
  }

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
      frameWidth: 32,
      frameHeight: 32
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
    this.enemy = this.createEnemyGroup(this.createEnemy())

    // add collider between player and ground
    this.physics.add.collider(this.player, this.ground)
    // add collider between enemy and ground
    this.physics.add.collider(this.enemy, this.ground)
    // add collider between player and enemy
    // detect if enemy has hit the player
    this.physics.add.collider(this.player, this.enemy, this.hitEnemy, null, this)

    // add scoretext
    this.scoreLable = this.add.text(400, 50, this.score, {
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
          .substring(0, this.wordInputLabel.text.length - 1)
      } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
        this.wordInputLabel.text += event.key
        // BUG playing really fast, updates to idle immediately
        this.player.anims.play(Animations.playerShooting, true)
      }
    })
  }

  update() {
    // change speed when player kills enemy
    this.speed = 1
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
      // update score
      this.killEnemy()
      this.scoreLable.text = this.score
    } else {
      console.log('not equal')
    }

    // check if enemy count is zero
    if (this.enemy.countActive(true) === 0) {
      this.enemy.add(this.createEnemy())
    }

    // inscrease enemy speed when score reaches certain threshhold.
    if (this.score > 15) {
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
        frames: this.anims.generateFrameNumbers(Objects.playerShooting, { start: 1, end: 2 }),
        frameRate: 10,
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

    return enemy
  }

  createEnemyGroup(enemy) {
    const enemyGroup = this.physics.add.group()

    enemyGroup.add(enemy)
    return enemyGroup
  }

  // eslint-disable-next-line class-methods-use-this
  // TODO: Use an API To generate random words.
  createWord() {
    const words = [
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
