import { state } from '../state/state'
import { levels } from '../dsl/dsl.json'
import { Level, Response } from 'state/stateTypes'

export class DialogScene extends Phaser.Scene {
  private storyText: Phaser.GameObjects.Text | null

  constructor() {
    super({
      key: 'Dialog',
    })
    this.storyText = null
  }

  init(): void {}

  preload(): void {}

  create(): void {
    const currentLevel: Level = levels[state.currentLevelIndex] as Level

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.5)')
    this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'dialog')

    const padding = 40
    const dialogWidth = 900
    const dialogHeight = 500

    this.storyText = this.add.text(
      this.sys.canvas.width / 2 + padding - dialogWidth / 2,
      this.sys.canvas.height / 2 + padding - dialogHeight / 2,
      `${currentLevel.story?.statement}`,
      {
        fontFamily: 'Ethnocentric',
        wordWrap: { width: dialogWidth - padding * 2 },
      },
    )
    this.storyText.updateText()

    currentLevel.story?.responses?.forEach((response: Response, i: number) => {
      const responseText = this.add.text(
        this.sys.canvas.width / 2 + padding - dialogWidth / 2,
        this.sys.canvas.height / 2 + padding - dialogHeight / 2 + (this.storyText?.height || 50) + 50 * (i + 1),
        `${i + 1}- ${response.response}`,
        {
          fontFamily: 'Ethnocentric',
          wordWrap: { width: dialogWidth - padding * 2 },
        },
      )
      responseText.updateText()
      responseText.setInteractive({ cursor: 'pointer' })
      responseText.on('pointerover', () => responseText.setTint(0x6155ff))
      responseText.on('pointerout', () => responseText.setTint(0xffffff))
      responseText.on('pointerdown', async () => {})
    })
  }

  update(): void {}
}
