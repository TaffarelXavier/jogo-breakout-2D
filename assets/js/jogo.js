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

// Declaração das variáveis:
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
var quantidadeTijolosLinhas = 0; // 20
var quantidadeTijolosColunas = 0; //30
var comprimentoTijolo = 20;
var alturaTijolo = 20;
var margemTijolo = 1;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var pontos = 0;
var _vidas = 3;
var tijolos = [];

// Declaração da variável do objeto LocalStorage
// Esta variável serve para persistir alguns dados no LocalStorage
const LS = window.localStorage;

/* Essas instruções abaixo servem para persistir 
alguns dados no localStorage do navegador.
E também ler, em caso de atualização da página.*/

if (!LS.getItem('fase')) {
  definirBackgroundTela('4127298.jpg');
  definirAcoesParaCadaFase();
} else {
  if (LS.getItem('fase') == '1') {
    definirBackgroundTela('4127298.jpg', 'hsl(15, 0%, 0%)');
  } else if (LS.getItem('fase') == '2') {
    definirBackgroundTela('sun3.jpg', '#fff');
    canvas.classList.add('tremer');
  } else if (LS.getItem('fase') == '3') {
    definirBackgroundTela('galaxy2.jpg', '#111');
  } else if (LS.getItem('fase') == '4') {
    definirBackgroundTela('moon-1859616_1920.jpg', '#111');
  }
  if (LS.getItem('fase') !== '5') {
    htmlFase.innerHTML = 'FASE ' + LS.getItem('fase');
  } else {
    // Vencedor
    canvas.style.display = 'none';
    htmlFase.innerHTML =
      'ParabÉns, você chegou ao final do jogo.<br/>Você é muito fera!!!!!! ';
    definirBackgroundTela('balloon2.jpg');
  }
}

/**
 * Define as ações das fases de cada jogo:
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
  LS.setItem('quantidadeTijolosLinhas', quantidadeDeBlocosPorLinha);
  LS.setItem('quantidadeTijolosColunas', quantidadeDeBlocosPorColuna);
}

/**
 * Esta função define o fundo da tela para cada cena.
 */
function definirBackgroundTela(fileName, canvasBg) {
  let _html = document.getElementsByTagName('body')[0];
  _html.style.background = `#fff url('/assets/imagens/${fileName}') no-repeat`;

  if (LS.getItem('fase') !== '4') {
    _html.style.backgroundSize = 'cover !important';
  }
  canvas.style.background = canvasBg;
}

/**
 * Desenha os tijolos no canvas.
 */
function iniciarTijolosCanvas() {
  quantidadeTijolosColunas = LS.getItem('quantidadeTijolosColunas');
  quantidadeTijolosLinhas = LS.getItem('quantidadeTijolosLinhas');

  for (var c = 0; c < quantidadeTijolosColunas; c++) {
    tijolos[c] = [];
    for (var r = 0; r < quantidadeTijolosLinhas; r++) {
      tijolos[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}
// Chama a função iniciarTijolosCanvas
iniciarTijolosCanvas();

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
  for (var c = 0; c < quantidadeTijolosColunas; c++) {
    for (var r = 0; r < quantidadeTijolosLinhas; r++) {
      var b = tijolos[c][r]; //
      if (b.status == 1) {
        //
        if (
          x > b.x &&
          x < b.x + comprimentoTijolo &&
          y > b.y &&
          y < b.y + alturaTijolo
        ) {
          tocarSomEmColisao();
          dy = -dy;
          b.status = 0;
          pontos++; // Incrementa os pontos
          if (pontos == quantidadeTijolosLinhas * quantidadeTijolosColunas) {
            if (LS.getItem('fase')) {
              if (LS.getItem('fase') !== '4') {
                alert('Ótimo! Você passou da fase ' + LS.getItem('fase') + '.');
                if (LS.getItem('fase') == 1) {
                  definirAcoesParaCadaFase(2, 10, 3, 4); // Número da fase, quant de blocos por linha, quant de colunas e vidas respectivamente
                  definirBackgroundTela();
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

function desenharBola() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function desenharPrancha() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function desenharTijolos() {
  for (var c = 0; c < quantidadeTijolosColunas; c++) {
    for (var r = 0; r < quantidadeTijolosLinhas; r++) {
      if (tijolos[c][r].status == 1) {
        var brickX = 0;

        if (parseInt(LS.getItem('fase'), 10) == 1) {
          brickX = r * (comprimentoTijolo + margemTijolo) + brickOffsetLeft + 100; //
        } else if (parseInt(LS.getItem('fase'), 10) == 2) {
          brickX = r * (comprimentoTijolo + margemTijolo) + brickOffsetLeft + 110; //
        } else if (parseInt(LS.getItem('fase'), 10) == 3) {
          brickX = r * (comprimentoTijolo + margemTijolo) + brickOffsetLeft + 54; //
        } else if (parseInt(LS.getItem('fase'), 10) == 4) {
          brickX = r * (comprimentoTijolo + margemTijolo) + brickOffsetLeft + 54; //
        }

        var brickY = c * (alturaTijolo + margemTijolo) + brickOffsetTop;
        tijolos[c][r].x = brickX;
        tijolos[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, comprimentoTijolo, alturaTijolo);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function tocarSomEmColisao() {
  if (pausarSomColisao.checked) {
    // Caso a caixa seja, em controles, seja marcada. Por padrão, checked é true
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
  ctx.fillText('PONTOS: ' + pontos, 8, 20);
}

function desenharMsgGameOver() {
  ctx.font = '16px myFirstFont';
  ctx.fillStyle = '#0095DD';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, 240);
  cancelAnimationFrame(criarDesenhos);
  tocarGameOver();
  btnIniciarJogo.style.display = 'block';
}

function desenharCaixaVidas() {
  ctx.font = '16px myFirstFont';
  ctx.fillStyle = '#0095DD';
  let vidas = LS.getItem('vidas');
  if (!vidas) {
    // Se a variável vidas não existir no localStorage,
    // define a quantidade de vidas com o valor da variável _vidas.
    ctx.fillText('VIDAS: ' + _vidas, canvas.width - 90, 20);
  } else {
    ctx.fillText('VIDAS: ' + vidas, canvas.width - 90, 20);
  }
}

/**
 * Esta função é o coração do sistema, pois ela define a questão
 * da bola andar na tela. E outras funções.
 *
 * @param {*} comFrame
 */
function criarDesenhos(comFrame) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharTijolos();
  desenharBola();
  desenharPrancha();
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
    requestAnimationFrame(criarDesenhos);
  }
}
// Chama a função
criarDesenhos();

/**
 * Função para tremer a tela do canvas
 * @param {*} oncomplete
 * @param {*} distance
 * @param {*} time
 */
function tremer(oncomplete, distance = 5, time = 500) {
  var start = new Date().getTime();
  animate();

  function animate() {
    var now = new Date().getTime();
    // Obtenha a hora atual
    var elapsed = now - start;
    // Há quanto tempo começamos
    var fraction = elapsed / time;
    // Qual fração do tempo total?
    if (fraction < 1) {
      var x = distance * Math.sin(fraction * 4 * Math.PI);
      canvas.style.left = x + 'px';
      // Nosso objetivo é uma animação suave de 40 quadros / segundo.
      setTimeout(animate, Math.min(25, time - elapsed));
    } else {
      // Caso contrário, a animação está completa
      if (oncomplete) oncomplete(e);
      // Invocar callback de conclusão
    }
  }
}

// Chama a função
tremer();

// Evento do botão principal para iniciar o jogo.
btnIniciarJogo.onclick = function () {
  if (LS.getItem('fase') != 5) {
    btnIniciarJogo.style.display = 'none';
    htmlFase.style.display = 'none';
    tocarSomBackground();
    criarDesenhos(true);
  } else {
    LS.removeItem('quantidadeTijolosLinhas');
    LS.removeItem('quantidadeTijolosColunas');
    LS.removeItem('fase');
    LS.removeItem('vidas');
    window.location.reload();
  }
};

// Eventos do teclado para mover a prancha
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
