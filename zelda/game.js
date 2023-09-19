kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor:[0,0,0,1],
})

const moveSpeed  = 120
const slicerSpeed = 100
const skeletorSpeed = 60


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


scene('game', ({ level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')
    
    const maps = [
        [
        "c@@)@@^@@z",
        "!        $",
        "!    <   $",
        "!     (  $",
        "%        $",
        "!  (     $",
        "!  <     $",
        "!      < $",
        "!        $",
        "x######)#v",
    ],[
      'c@@@@@@@@z',
      '!        $',
      ')     >  )',
      '!  > *   $',
      '!        )',
      '!    >   $',
      ')   *    )',
      '!        $',
      'x########v',
    ]
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
        "%": [sprite("left-door"), "door", solid()],
        "^": [sprite("top-door"),"next-level"],
        "*": [sprite("stairs"), "next-level"],
        "<": [sprite("slicer"), "slicer", "dangerous", {dir: -1}],
        ">": [sprite("skeletor"), "skeletor", "dangerous", {dir: -1, timer: 0}],
        ")": [sprite("laterns"), solid()],
        "(": [sprite("fire-pot"), solid()],

    }

    const gameLevel =  addLevel(maps[level], levelCfg)

    add([sprite('background'), layer('bg')])



    add([
        text("0"),
        pos(1600, 900),
        layer("ui"),
        {
            value: score,
        },
        scale(2),
    ])

    const scoreLabel = add([
        text("level: " + parseInt(level + 1)),
        pos(1600, 930),
        layer("ui"),
        {
            value: level,
        },
        scale(2),
    ])

    const player = add([
        sprite("link-going-right"),
        pos(50,190),
        {
            //right by default
            dir: vec2(1,0)
        }
    ])

    player.action(()=>{
        player.resolve()
    })

    player.overlaps("next-level", ()=>{
        go("game",{
            level: (level + 1) % maps.length,
            score: scoreLabel.value
        })
    })

    keyDown("a", ()=>{
        player.changeSprite("link-going-left"),
        player.move(-moveSpeed,0),
        player.dir = vec2(-1,0)
    })

    keyDown("d", ()=>{
        player.changeSprite("link-going-right"),
        player.move(moveSpeed,0),
        player.dir = vec2(1,0)
    })

    keyDown("w", ()=>{
        player.changeSprite("link-going-up"),
        player.move(0,-moveSpeed),
        player.dir = vec2(0,-1)
    })
    keyDown("s", ()=>{
        player.changeSprite("link-going-down"),
        player.move(0,moveSpeed),
        player.dir = vec2(0,1)
    })

    function attack(p){
        const obj = add([sprite("kaboom"), pos(p), "kaboom"])
        wait(1, () =>{
            destroy(obj)
        })
    }

    player.collides("door", (d)=>{
        destroy(d)
        gameLevel.spawn("!", d.gridPos.sub(0,0))
    })

    keyPress("space", ()=>{
        attack(player.pos.add(player.dir.scale(48)))
        
    })

    collides("kaboom", "skeletor", (k, s)=>{
        camShake(4)
        wait(1,()=>{
            destroy(k)
        })
        destroy(s)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

    action("slicer", (s)=>{
        s.move(s.dir * slicerSpeed,0)
    })
    
    action("skeletor", (s)=>{
        s.move(0,s.dir * skeletorSpeed)
        s.timer -=dt()
        if(s.timer <= 0){
            s.dir *= -1
            s.timer = rand(5)
        }
    })

    collides("skeletor","wall", (s) =>{
        s.dir *= -1
    })

    collides("slicer","wall", (s) =>{
        s.dir *= -1
    })

    player.overlaps("dangerous",(d)=>{
        go('lose', { score: scoreLabel.value})
    })

})

scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)])
  })


start("game", {level: 0, score: 0})