import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

export function managePixi() {
    const app = new PIXI.Application()
    document.body.appendChild(app.view)

    // create viewport
    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000,

        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })

    // add the viewport to the stage
    app.stage.addChild(viewport)

    // activate plugins
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()

    // add a red box
    const sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    sprite.tint = 0xff0000
    sprite.width = sprite.height = 100
    sprite.position.set(100, 100)
}