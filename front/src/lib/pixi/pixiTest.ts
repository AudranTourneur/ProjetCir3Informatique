import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

export function managePixi(div: HTMLDivElement) {
    const app = new PIXI.Application()
    div.appendChild(app.view)

    // create viewport
    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 600,
        worldHeight: 600,
        passiveWheel: false,
        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })

    // add the viewport to the stage
    app.stage.addChild(viewport)

    // activate plugins
    viewport
        .drag()
        .decelerate()
        .pinch()
        .wheel()

    // add a red box
    const sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    sprite.tint = 0xff0000
    sprite.width = sprite.height = 100
    sprite.position.set(100, 100)

    setInterval(() => {
        //viewport.scale.set(viewport.scale.x * .99, viewport.scale.y * .99)
    }, 100)

    const texture = PIXI.Texture.from("/Etage_2_clean.png");

    const sprite2 = viewport.addChild(new PIXI.Sprite(texture))
}