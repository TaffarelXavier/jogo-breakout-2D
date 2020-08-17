/**
 * FASE 1:
 * 10 BLOCOS EM LINHAS
 *  2 BLOCOS EM COLUNAS
 *
 * FASE 2:
 * 10 BLOCOS EM LINHAS
 *  3 BLOCOS EM COLUNAS
 *
 * FASE 3:
 * 20 BLOCOS EM LINHAS
 *  2 BLOCOS EM COLUNAS
 *
 *  * FASE 3:
 * 20 BLOCOS EM LINHAS
 *  2 BLOCOS EM COLUNAS
 */
var canvas = document.getElementById('myCanvas');
var btnIniciarJogo = document.getElementById('iniciar-jogo');
var htmlFase = document.getElementById('fase');
var pausarSomColisao = document.getElementById('pausar-som-em-colisao');
var ctx = canvas.getContext('2d');
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var iniciarJogo = false;
var brickRowCount = 0; // 20
var brickColumnCount = 0; //30
var brickWidth = 20;
var brickHeight = 20;
var brickPadding = 1;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;
var bricks = [];

const LS = window.localStorage;

// Essas instruções abaixo servem para persistir alguns dados no localStorage do navegador.
if (!LS.getItem('fase')) {
  definirBackground('4127298.jpg');
  definirAcoesParaCadaFase();
} else {
  if (LS.getItem('fase') == '1') {
    definirBackground('4127298.jpg', 'hsl(15, 0%, 0%)');
  } else if (LS.getItem('fase') == '2') {
    definirBackground('sun3.jpg', '#fff');
    canvas.classList.add('tremer');
  } else if (LS.getItem('fase') == '3') {
    definirBackground('galaxy2.jpg', '#111');
  } else if (LS.getItem('fase') == '4') {
    definirBackground('moon-1859616_1920.jpg', '#111');
  }
  if (LS.getItem('fase') !== '5') {
    htmlFase.innerHTML = 'FASE ' + LS.getItem('fase');
  } else {
    // Vencedor
    canvas.style.display = 'none';
    htmlFase.innerHTML =
      'ParabÉns, você chegou ao final do jogo.<br/>Você é muito fera!!!!!! ';
    definirBackground('balloon2.jpg');
  }
}
/**
 * Define as acoes das fases de cada jogo:
 * @param {*} fase
 * @param {*} quantidadeDeBlocosPorLinha
 * @param {*} quantidadeDeBlocosPorColuna
 */
function definirAcoesParaCadaFase(
  fase = 1,
  quantidadeDeBlocosPorLinha = 10,
  quantidadeDeBlocosPorColuna = 2,
  vidas = 3
) {
  LS.setItem('fase', fase);
  LS.setItem('vidas', vidas);
  LS.setItem('brickRowCount', quantidadeDeBlocosPorLinha);
  LS.setItem('brickColumnCount', quantidadeDeBlocosPorColuna);
}

function definirBackground(fileName, canvasBg) {
  let _html = document.getElementsByTagName('body')[0];
  _html.style.background = `#fff url('/assets/imagens/${fileName}') no-repeat`;

  if (LS.getItem('fase') !== '4') {
    _html.style.backgroundSize = 'cover !important';
  } else {
    // _html.style.backgroundSize = 'cover';
  }
  // _html.style.backgroundPosition = 'center center';
  canvas.style.background = canvasBg;
}

function iniciarBlocos() {
  brickColumnCount = LS.getItem('brickColumnCount');
  brickRowCount = LS.getItem('brickRowCount');

  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

iniciarBlocos();

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function detectarColisao() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        //
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          tocarSomEmColisao();
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            if (LS.getItem('fase')) {
              if (LS.getItem('fase') !== '4') {
                alert('Ótimo! Você passou da fase ' + LS.getItem('fase') + '.');
                if (LS.getItem('fase') == 1) {
                  definirAcoesParaCadaFase(2, 10, 3, 4); //Número da fase; quant de blocos por linha; quant de colunas, vidas respectivamente
                  definirBackground();
                } else if (LS.getItem('fase') == 2) {
                  definirAcoesParaCadaFase(3, 15, 3, 5);
                } else if (LS.getItem('fase') == 3) {
                  definirAcoesParaCadaFase(4, 15, 4, 6);
                }
              } else {
                LS.getItem('5');
              }
            }
            window.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = 0;

        if (parseInt(LS.getItem('fase'), 10) == 1) {
          brickX = r * (brickWidth + brickPadding) + brickOffsetLeft + 100; //
        } else if (parseInt(LS.getItem('fase'), 10) == 2) {
          brickX = r * (brickWidth + brickPadding) + brickOffsetLeft + 110; //
        } else if (parseInt(LS.getItem('fase'), 10) == 3) {
          brickX = r * (brickWidth + brickPadding) + brickOffsetLeft + 54; //
        } else if (parseInt(LS.getItem('fase'), 10) == 4) {
          brickX = r * (brickWidth + brickPadding) + brickOffsetLeft + 54; //
        }

        var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function tocarSomEmColisao() {
  if (pausarSomColisao.checked) {
    var audio = new Audio('assets/sounds/NFF-deflate.wav');
    audio.volume = 0.1;
    audio.play();
  }
}

function tocarSomBackground() {
  var pausarSomFundo = document.getElementById('pausar-som-fundo');
  if (pausarSomFundo.checked) {
    var audio = new Audio('assets/sounds/alien-spaceship_daniel_simion.mp3');
    audio.volume = 0.1; // 0.01
    audio.loop = true;
    audio.play();
  }
}

function tocarGameOver() {
  var audio = new Audio('assets/sounds/NFF-dematerialized.wav');
  audio.volume = 0.1;
  audio.play();
}

function desenharCaixaPontos() {
  ctx.font = '16px myFirstFont';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('PONTOS: ' + score, 8, 20);
}

function desenharMsgGameOver() {
  ctx.font = '16px myFirstFont';
  ctx.fillStyle = '#0095DD';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, 240);
  cancelAnimationFrame(draw);
  tocarGameOver();
  btnIniciarJogo.style.display = 'block';
}

function desenharCaixaVidas() {
  ctx.font = '16px myFirstFont';
  ctx.fillStyle = '#0095DD';
  let vidas = LS.getItem('vidas');
  if (!vidas) {
    // Se a variável vidas não existir no localStorage
    ctx.fillText('VIDAS: ' + lives, canvas.width - 90, 20);
  } else {
    ctx.fillText('VIDAS: ' + vidas, canvas.width - 90, 20);
  }
}

function draw(comFrame) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  desenharCaixaPontos();
  desenharCaixaVidas();
  detectarColisao();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      let vidas = parseInt(LS.getItem('vidas'));
      vidas--; //Decrementa as vidas
      LS.setItem('vidas', vidas);
      if (!vidas) {
        desenharMsgGameOver();
        LS.setItem('vidas', 3);
        setTimeout(function () {
          window.location.reload();
        }, 2000);
        return;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  if (comFrame) {
    requestAnimationFrame(draw);
  }
}

draw();

function shake(oncomplete, distance = 5, time = 500) {
  var start = new Date().getTime();
  animate();

  function animate() {
    var now = new Date().getTime();
    // Get current time
    var elapsed = now - start;
    // How long since we started
    var fraction = elapsed / time;
    // What fraction of total time?
    if (fraction < 1) {
      var x = distance * Math.sin(fraction * 4 * Math.PI);
      canvas.style.left = x + 'px';
      // We're aiming for a smooth 40 frames/second animation.
      setTimeout(animate, Math.min(25, time - elapsed));
    } else {
      // Otherwise, the animation is complete
      if (oncomplete) oncomplete(e);
      // Invoke completion callback
    }
  }
}

shake();

btnIniciarJogo.onclick = function () {
  if (LS.getItem('fase') != 5) {
    btnIniciarJogo.style.display = 'none';
    htmlFase.style.display = 'none';
    tocarSomBackground();
    draw(true);
  } else {
    LS.removeItem('brickRowCount');
    LS.removeItem('brickColumnCount');
    LS.removeItem('fase');
    LS.removeItem('vidas');
    window.location.reload();
  }
};
