kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor:[0,0,1,1],
})

loadSprite("link-going-left", "/zelda/icon-images/14 - 1Xq9biB.png")
loadSprite("link-going-right", "/zelda/icon-images/15 - yZIb8O2.png")
loadSprite("link-going-down", "/zelda/icon-images/11 - r377FIM.png")
loadSprite("link-going-up", "/zelda/icon-images/16 - UkV0we0.png")
loadSprite("left-wall", "/zelda/icon-images/25 - rfDoaa1.png")
loadSprite("top-wall", "/zelda/icon-images/24 - QA257Bj.png")
loadSprite("bottom-wall", "/zelda/icon-images/2 - vWJWmvb.png")
loadSprite("right-wall", "/zelda/icon-images/26 - SmHhgUn.png")
loadSprite("bottom-left-wall", "/zelda/icon-images/3 - awnTfNC.png")
loadSprite("bottom-right-wall", "/zelda/icon-images/1 - 84oyTFy.png")
loadSprite("top-left-wall", "/zelda/icon-images/22 - xlpUxIm.png")
loadSprite("top-right-wall", "/zelda/icon-images/23 - z0OmBd1.jpg")
loadSprite("top-door", "/zelda/icon-images/21 - U9nre4n.png")
loadSprite("left-door", "/zelda/icon-images/4 - okdJNls.png")
loadSprite("fire-pot", "/zelda/icon-images/6 - I7xSp7w.png")
loadSprite("laterns", "/zelda/icon-images/10 - wiSiY09.png")
loadSprite("slicer", "/zelda/icon-images/18 - c6JFi5Z.png")
loadSprite("skeletor", "/zelda/icon-images/17 - Ei1VnX8.png")
loadSprite("kaboom", "/zelda/icon-images/9 - o9WizfI.png")
loadSprite("stairs", "/zelda/icon-images/19 - VghkL08.png")
loadSprite("background", "/zelda/icon-images/5 - u4DVsx6.png")


scene("game",({level, score})=>{

    layers[("bg", "obj", "ui"), "obj"]
    
    const map = [
        "c@@@@@@@@@@@@)@@@@@@@^@@@@@@@@z",
        "!                             $",
        "!    <                        $",
        "!                  (          $",
        "%     (                   <   $",
        "!                             $",
        "!                             $",
        "!       <                     $",
        "!                             $",
        "!                   <         $",
        "!     (                       $",
        "!                             $",
        "!                  (          $",
        "!              <              $",
        "!                             $",
        "!    <                        $",
        "!                             $",
        "x########)#############)######v",
    ]

    const levelCfg = {
        width: 48,
        height: 48,
        "!": [sprite("left-wall"), solid(), "wall"],
        "$": [sprite('right-wall'), solid(), "wall"],
        "@": [sprite('top-wall'), solid(), "wall"],
        "#": [sprite('bottom-wall'), solid(), "wall"],
        "z": [sprite('top-right-wall'), solid(), "wall"],
        "x": [sprite('bottom-left-wall'), solid(), "wall"],
        "c": [sprite('top-left-wall'), solid(), "wall"],
        "v": [sprite('bottom-right-wall'), solid(), "wall"],
        "%": [sprite("left-door"), solid()],
        "^": [sprite("top-door")],
        "*": [sprite("stairs")],
        "<": [sprite("slicer")],
        ">": [sprite("skeletor")],
        ")": [sprite("laterns"), solid()],
        "(": [sprite("fire-pot"), solid()],

    }

    addLevel(map, levelCfg)
    // add([sprite("background"), layers("bg")])
    add([
        text("0"),
        pos(50, 900),
        layer("ui"),
        {
            value: score,
        },
        scale(2),
    ])

    add([
        text("level: " + parseInt(level + 1)),
        pos(50, 930),
        layer("ui"),
        {
            value: level,
        },
        scale(2),
    ])


})


start("game", {level: 0, score: 0})