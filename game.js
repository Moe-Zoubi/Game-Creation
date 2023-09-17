kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0,0,0,1],
})

const moveSpeed = 120
const jumpForce = 360

loadSprite("coin", "/game-icons/2 - wbKxhcd.png")
loadSprite("mob-shroom", "/game-icons/3 - KPO3fR9.png")
loadSprite("brick-wall", "/game-icons/1 - pogC9x5.png")
loadSprite("block", "/game-icons/20 - M6rwarW.png")
loadSprite("mario", "/game-icons/6 - Wb1qfhK.png")
loadSprite("mushroom", "/game-icons/7 - 0wMd92p.png")
loadSprite("suprise", "/game-icons/9 - gesQ1KP.png")
loadSprite("unboxed", "/game-icons/10 - bdrLpi6.png")
loadSprite("pipe-top-left", "/game-icons/14 - ReTPiWY.png")
loadSprite("pipe-top-right", "/game-icons/13 - hj2GK4n.png")
loadSprite("pipe-bottom-left", "/game-icons/11 - c1cYSbt.png")
loadSprite("pipe-bottom-right", "/game-icons/12 - nqQ79eI.png")

scene("game", ()=>{
    layers(["bg","obj","ui"],"obj")

    const map = [
        "                                       ",
        "                                       ",
        "                                       ",
        "                                       ",
        "                                       ",
        "                                       ",
        "    %   =*=%=                          ",
        "                                       ",
        "                      -+               ",
        "             ^   ^    ()               ",
        "=============================   =======",
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        "=" : [sprite("block"),solid()],
        "$": [sprite("coin")],
        "%": [sprite("suprise"), solid(), "coin-suprise"],
        "*": [sprite("suprise"), solid(), "mushroom-suprise"],
        "}": [sprite("unboxed"),solid()],
        "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
        ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
        "-": [sprite("pipe-top-left"), solid(), scale(0.5)],
        "+": [sprite("pipe-top-right"), solid(), scale(0.5)],
        "^": [sprite("mob-shroom"),solid()],
        "#": [sprite("mushroom"),solid()]
    }
    
    const gameLevel = addLevel(map, levelCfg)


    const scoreLabel = add([
        text("test"),
        pos(30,6),
        layer("ui"),
        {
            value: "test",
        }
    ])

    add([text("level " + "test", pos(4,6))])

    function big(){
        let timer = 0
        let isBig = false
        return{
            update(){
                if(isBig){
                    timer -=dt()
                    if(timer <=0){
                        this.smallify()
                    }
                }
            },
            isBig(){
                return isBig
            },
            smallify(){
                this.scale = vec2(1)
                timer = 0
                isBig = false
            },
            beggify(time){
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }

    const player = add([
        sprite("mario"), solid(),
        pos(30, 0),
        body(),
        big(),
        origin("bot")
    ])

    

    keyDown("left", ()=>{
        player.move(-moveSpeed,0)
    })
    keyDown("right", ()=>{
        player.move(moveSpeed,0)
    })
    keyPress("space",()=>{
        if(player.grounded()){
            player.jump(jumpForce)
        }
    })
})

start("game")