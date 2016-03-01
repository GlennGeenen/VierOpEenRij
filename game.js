/*jslint browser:true, plusplus:true, vars: true */
"use strict";

function Game(withAI) {
  var game = this;
  var rejectClick = false;

  function create() {
    game.canvas = document.getElementsByTagName("canvas")[0];
    game.canvas.addEventListener('click', function (e) {
      onClick(game.canvas, e);
    });
    game.context = game.canvas.getContext('2d');

    if (withAI) {
      game.AI = new AI(-1);
    }

    init();
  }

  function init() {
    game.board = new Board();
    game.paused = false;
    game.won = false;
    game.move = 0;

    rejectClick = false;
    drawText('Klik om te spelen');

    clear();
    drawMask();
  };

  function playerMove() {
    if (game.move % 2 === 0) {
      return 1;
    }
    return -1;
  };

  function drawText(message) {
    document.getElementById('message').innerHTML = message;
  }

  function win(player) {
    game.paused = true;
    game.won = true;

    rejectClick = false;

    var msg;
    if (player > 0) {
      msg = "Rood wint";
    } else if (player < 0) {
      msg = "Blauw wint";
    } else {
      msg = "Gelijkspel";
    }
    msg += " - Klik om opnieuw te beginnen";

    drawText(msg);
  };

  function doAction(column, callback) {
    if (game.paused || game.won) {
      return 0;
    }

    if (game.board.getValue(0, column) !== 0 || column < 0 || column > 6) {
      return -1;
    }

    var row = 5;
    for (var i = 0; i < 5; i++) {
      if (game.board.getValue(i + 1, column) !== 0) {
        row = i;
        break;
      }
    }

    function animateCallback() {
      game.board.setValue(row, column, playerMove(game.move));
      game.move++;
      game.board.draw(game.context);
      check();
      // game.board.print();
      game.paused = false;
      callback();
    }

    animate(column, playerMove(game.move), row, 0, animateCallback);
    game.paused = true;
    return 1;
  };

  function check() {
    var result = game.board.check();
    if (result !== 0) {
      return win(result);
    }

    // check if draw
    if ((game.move === 42) && (!game.won)) {
      win(0);
    }
  };

  function drawMask() {
    // draw the mask
    // http://stackoverflow.com/questions/6271419/how-to-fill-the-opposite-shape-on-canvas
    // -->  http://stackoverflow.com/a/11770000/917957

    game.context.save();
    game.context.fillStyle = "#ddd";
    game.context.beginPath();
    var x, y;
    for (y = 0; y < 6; y++) {
      for (x = 0; x < 7; x++) {
        game.context.arc(75 * x + 100, 75 * y + 50, 25, 0, 2 * Math.PI);
        game.context.rect(75 * x + 150, 75 * y, -100, 100);
      }
    }
    game.context.fill();
    game.context.restore();
  };

  function clear() {
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  };

  function animate(column, move, toRow, curPos, callback) {
    var fgColor = "transparent";
    if (move >= 1) {
      fgColor = "#ff4136";
    } else if (move <= -1) {
      fgColor = "#0074d9";
    }

    if (toRow * 75 >= curPos) {
      clear();
      game.board.draw(game.context);
      game.board.drawCircle(game.context, 75 * column + 100, curPos + 50, 25, fgColor);
      drawMask();
      return window.requestAnimationFrame(function onAnimate() {
        animate(column, move, toRow, curPos + 25, callback);
      });
    }

    callback();
  };

  function onRegion(coord, x, radius) {
    if ((coord[0] - x)*(coord[0] - x) <=  radius * radius) {
      return true;
    }
    return false;
  };

  function handleClick(rect, x, y) {
    var valid;
    for (var j = 0; j < 7; j++) {
      if (onRegion([x, y], 75 * j + 100, 25)) {
        game.paused = false;
        valid = doAction(j, function actionCallback() {
          if (withAI) {
            game.AI.move(game.board, doAction, function aiMoved() {
              rejectClick = false;
            });
          } else {
            rejectClick = false;
          }
        });

        // give user retry if action is invalid
        if (valid === 1) {
          rejectClick = true;
        }

        break; //because there will be no 2 points that are clicked at a time
      }
    }
  }

  function onClick(canvas, e) {
    if (rejectClick) {
      return false;
    }

    if (game.won) {
      init();
      return false;
    }

    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left; // - e.target.scrollTop,
    var y = e.clientY - rect.top; // - e.target.scrollLeft;
    handleClick(rect, x, y);
  };

  create();
}

document.addEventListener('DOMContentLoaded', function () {
  new Game(true);
});
