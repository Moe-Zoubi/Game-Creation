kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
  })
  

  const moveSpeed  = 120
  const jumpForce  = 360
  const gaintJumpForce   = 460
  let currentJumpForce   = jumpForce 
  const fallDeath  = 400
  let enemySpeed  = 20
  
  let isJumping = true
  
  loadSprite('coin', '/game-icons/2 - wbKxhcd.png')
  loadSprite('mob-shroom', '/game-icons/3 - KPO3fR9.png')
  loadSprite('brick', '/game-icons/1 - pogC9x5.png')
  loadSprite('block', '/game-icons/20 - M6rwarW.png')
  loadSprite('mario', '/game-icons/6 - Wb1qfhK.png')
  loadSprite('mushroom', '/game-icons/7 - 0wMd92p.png')
  loadSprite('surprise', '/game-icons/9 - gesQ1KP.png')
  loadSprite('unboxed', '/game-icons/10 - bdrLpi6.png')
  loadSprite('pipe-top-left', '/game-icons/14 - ReTPiWY.png')
  loadSprite('pipe-top-right', '/game-icons/13 - hj2GK4n.png')
  loadSprite('pipe-bottom-left', '/game-icons/11 - c1cYSbt.png')
  loadSprite('pipe-bottom-right', '/game-icons/12 - nqQ79eI.png')
  
  loadSprite('blue-block', '/game-icons/19 - fVscIbn.png')
  loadSprite('blue-brick', '/game-icons/15 - 3e5YRQd.png')
  loadSprite('blue-steel', '/game-icons/17 - gqVoI2b.png')
  loadSprite('blue-mob-shroom', '/game-icons/16 - SvV4ueD.png')
  loadSprite('blue-surprise', '/game-icons/18 - RMqCc1G.png')
  
  
  
  scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')
  
    const maps = [
      [
        '1                                      1',
        '1                                      1',
        '1                                      1',
        '1                                      1',
        '1                                      1',
        '1     %   =*=%=                        1',
        '1                                      1',
        '1                            -+        1',
        '1                    ^   ^   ()        1',
        '1==============================   =====1',
      ],
      [
        '£                                                       £',
        '£                                                       £',
        '£                                                       £',
        '£                                                       £',
        '£                                                       £',
        '£        @@v@@@                          x   x          £',
        '£                                    x   x   x          £',
        '£                                x   x   x   x    x   -+£',
        '£                     z   z  x   x   x   x   x    x   ()£',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   !   !   !   !    !!!!!!!',
      ],
      [
        '1                                                         1',
        '1                                                         1',
        '1                                                         1',
        '1                                                         1',
        '1                                                         1',
        '1     %   =*=%=                                           1',
        '1                                   =                     1',
        '1                                  ==                   -+1',
        '1                       ^  ^   ^  ===                   ()1',
        '1========  ===  =======================     ==============1',
      ]
    ]
  
    const levelCfg = {
      width: 20,
      height: 20,
      '=': [sprite('block'), solid()],
      '1': [sprite('brick'), solid(),"walls"],
      '$': [sprite('coin'), 'coin'],
      '%': [sprite('surprise'), solid(), 'coin-surprise'],
      '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
      '}': [sprite('unboxed'), solid()],
      '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
      ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
      '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
      '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
      '^': [sprite('mob-shroom'), solid(), 'mob'],
      '#': [sprite('mushroom'), solid(), 'mushroom', body()],
      '!': [sprite('blue-block'), solid(), scale(0.5)],
      '£': [sprite('blue-brick'), solid(), scale(0.5), "walls"],
      'z': [sprite('blue-mob-shroom'), solid(), scale(0.5), 'mob'],
      '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
      'v': [sprite('blue-surprise'), solid(), scale(0.5), 'mushroom-surprise'],
      'x': [sprite('blue-steel'), solid(), scale(0.5), "walls"],
  
    }
  
    const gameLevel = addLevel(maps[level], levelCfg)
  
    const scoreLabel = add([
      text(score),
      pos(30, 6),
      layer('ui'),
      {
        value: score,
      }
    ])
  
    add([text('level ' + parseInt(level + 1) ), pos(40, 6)])
    
    function big() {
      let timer = 0
      let isBig = false
      return {
        update() {
          if (isBig) {
            currentJumpForce   = gaintJumpForce  
            timer -= dt()
            if (timer <= 0) {
              this.smallify()
            }
          }
        },
        isBig() {
          return isBig
        },
        smallify() {
          this.scale = vec2(1)
          currentJumpForce   = jumpForce 
          timer = 0
          isBig = false
        },
        biggify(time) {
          this.scale = vec2(2)
          timer = time
          isBig = true     
        }
      }
    }
  
    const player = add([
      sprite('mario'), solid(),
      pos(30, 0),
      body(),
      big(),
      origin('bot')
    ])
  
    action('mushroom', (m) => {
      m.move(20, 0)
    })
    
    action('coin', (m) => {
      m.move(20, 0)
    })

    player.on("headbump", (obj) => {
      if (obj.is('coin-surprise')) {
        gameLevel.spawn('$', obj.gridPos.sub(0, 1))
        destroy(obj)
        gameLevel.spawn('}', obj.gridPos.sub(0,0))
      }
      if (obj.is('mushroom-surprise')) {
        gameLevel.spawn('#', obj.gridPos.sub(0, 1))
        destroy(obj)
        gameLevel.spawn('}', obj.gridPos.sub(0,0))
      }
    })
  
    player.collides('mushroom', (m) => {
      destroy(m)
      player.biggify(6)
    })
  
    player.collides('coin', (c) => {
      destroy(c)
      scoreLabel.value++
      scoreLabel.text = scoreLabel.value
    })
    
    collides('mob', 'walls', () => {
      enemySpeed *= -1
    })

    collides('mob', 'pipe', () => {
      enemySpeed *= -1
    })


    action('mob', (d) => {
      d.move(-enemySpeed , 0)
    })
  
    player.collides('mob', (d) => {
      if (isJumping) {
        destroy(d)
      } else if(player.isBig()){
        destroy(d)
        player.smallify()
      }else{
        go('lose', { score: scoreLabel.value})
      }
    })
  
    player.action(() => {
      camPos(player.pos)
      if (player.pos.y >= fallDeath ) {
        go('lose', { score: scoreLabel.value})
      }
    })
  
    player.collides('pipe', () => {
      keyPress('s', () => {
        go('game', {
          level: (level + 1) % maps.length,
          score: scoreLabel.value
        })
      })
    })
  
    keyDown('a', () => {
      player.move(-moveSpeed , 0)
    })
  
    keyDown('d', () => {
      player.move(moveSpeed , 0)
    })
  
    player.action(() => {
      if(player.grounded()) {
        isJumping = false
      }
    })
  
    keyPress('space', () => {
      if (player.grounded()) {
        isJumping = true
        player.jump(currentJumpForce  )
      }
    })
  })
  
  scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)])
  })
  
  start("game", { level: 0, score: 0})