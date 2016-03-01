function AI(aiMoveValue) {
  var ai = this;
  ai.moveValue = aiMoveValue;

  function value(board, depth, alpha, beta) {

    var checkObject = board.AICheck();
    var winValue = checkObject.winValue;

    if (winValue === 4 * ai.moveValue) {
      // AI wins
      return {
        value: 999999 - depth * depth,
        move: -1
      };
    } else if (winValue === -4 * ai.moveValue) {
      // AI loses
      return {
        value: -999999 + depth * depth,
        move: -1
      };
    }

    // if slow (or memory consumption is high), lower the value
    if (depth >= 4) {
      var returnValue = checkObject.chainValue * ai.moveValue;
      returnValue -= depth * depth;
      return {
        value: returnValue,
        move: -1
      };
    }

    if (depth % 2 === 0) {
      return minState(board, depth + 1, alpha, beta);
    }
    return maxState(board, depth + 1, alpha, beta);
  }

  function choose(choice) {
    return choice[Math.floor(Math.random() * choice.length)];
  }

  function maxState(board, depth, alpha, beta) {
    var v = -100000000007;
    var tempObject = null;
    var tempState = null;
    var moveQueue = [];

    for (var j = 0; j < 7; j++) {
      tempState = board.fill(j, ai.moveValue);
      if (tempState !== -1) {
        tempObject = value(new Board(tempState), depth, alpha, beta);
        if (tempObject.value > v) {
          v = tempObject.value;
          moveQueue = [];
          moveQueue.push(j);
        } else if (tempObject.value === v) {
          moveQueue.push(j);
        }

        // alpha-beta pruning
        if (v > beta) {
          return {
            value: v,
            move: choose(moveQueue)
          };
        }
        alpha = Math.max(alpha, v);
      }
    }

    return {
      value: v,
      move: choose(moveQueue)
    };
  }

  function minState(board, depth, alpha, beta) {
    var v = 100000000007;
    var tempObject = null;
    var tempState = null;
    var moveQueue = [];

    for (var j = 0; j < 7; j++) {
      tempState = board.fill(j, ai.moveValue * -1);

      if (tempState !== -1) {
        tempObject = value(new Board(tempState), depth, alpha, beta);
        if (tempObject.value < v) {
          v = tempObject.value;
          moveQueue = [];
          moveQueue.push(j);
        } else if (tempObject.value === v) {
          moveQueue.push(j);
        }

        // alpha-beta pruning
        if (v < alpha) {
          return {
            value: v,
            move: choose(moveQueue)
          };
        }
        beta = Math.min(beta, v);
      }
    }

    return {
      value: v,
      move: choose(moveQueue)
    };
  }

  function move (board, doAction, callback) {
    var choiceValue = maxState(board, 0, -100000000007, 100000000007);
    var choice = choiceValue.move;

    var done = doAction(choice, callback);

    // if fail, then random
    while (done < 0) {
      console.error("Falling back to random agent");
      choice = Math.floor(Math.random() * 7);
      done = doAction(choice, callback);
    }
  }

  this.move = move;
};
