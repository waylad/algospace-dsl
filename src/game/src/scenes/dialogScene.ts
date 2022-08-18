import { state } from '../state/state'
import { levels } from '../dsl/dsl.json'

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
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.5)');
    this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'dialog')

    this.storyText = this.add.text(40, 20, `Hello`, {
      fontFamily: 'Ethnocentric',
    })
    this.storyText.updateText()
  }

  update(): void {}
}
