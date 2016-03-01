function Board(initialMap) {
  'use strict';

  var m_map = [];

  function create() {
    for (var i = 0; i <= 6; i++) {
      m_map[i] = [];
      for (var j = 0; j <= 7; j++) {
        m_map[i][j] = 0;
      }
    }
  }

  // Create Map
  if (!initialMap) {
   create();
  } else if (initialMap.clone) {
    m_map = initialMap.clone();
  } else {
    m_map = initialMap;
  }

  function clone() {
    var arr = [];
    for (var i = 0; i < m_map.length; i++) {
        arr[i] = m_map[i].slice();
    }
    return arr;
  }

  function getValue(x, y) {
    return m_map[x][y];
  }

  function setValue(x, y, value) {
    m_map[x][y] = value;
  }

  function fill(column, value) {
    var tempMap = clone();
    if (tempMap[0][column] !== 0 || column < 0 || column > 6) {
      return -1;
    }

    for (var i = 0; i < 5; i++) {
      if (tempMap[i + 1][column] !== 0) {
        tempMap[i][column] = value;
        return tempMap;
      }
    }

    tempMap[5][column] = value;
    return tempMap;
  };

  function checkPosition(x, y) {
    var toRight = 0;
    var toBottom = 0;
    var toBottomRight = 0;
    var toTopRight = 0;

    var result = {
      winValue: 0,
      chainValue: 0
    };

    for (var k = 0; k <= 3; k++) {
      //from (x,y) to right
      if (y + k < 7) {
        toRight += m_map[x][y + k];
      }
      //from (x,y) to bottom
      if (x + k < 6) {
        toBottom += m_map[x + k][y];
      }

      //from (x,y) to bottom-right
      if (x + k < 6 && y + k < 7) {
        toBottomRight += m_map[x + k][y + k];
      }

      //from (x,y) to top-right
      if (x - k >= 0 && y + k < 7) {
        toTopRight += m_map[x - k][y + k];
      }
    }

    result.chainValue += toRight * toRight * toRight;
    result.chainValue += toBottom * toBottom * toBottom;
    result.chainValue += toBottomRight * toBottomRight * toBottomRight;
    result.chainValue += toTopRight * toTopRight * toTopRight;

    if (Math.abs(toRight) === 4) {
      result.winValue = toRight;
    } else if (Math.abs(toBottom) === 4) {
      result.winValue = toBottom;
    } else if (Math.abs(toBottomRight) === 4) {
      result.winValue = toBottomRight;
    } else if (Math.abs(toTopRight) === 4) {
      result.winValue = toTopRight;
    }

    return result;
  }

  function checkMap() {
    var tmp;
    for (var i = 0; i < 6; ++i) {
      for(var j = 0; j < 7; ++j) {
        tmp = checkPosition(i, j);
        if (tmp.winValue !== 0) {
          return tmp.winValue;
        }
      }
    }
    return 0;
  }

  function AICheck() {
    var tmp;
    var result = {
      winValue: 0,
      chainValue: 0
    };

    for (var i = 0; i < 6; ++i) {
      for(var j = 0; j < 7; ++j) {
        tmp = checkPosition(i, j);
        if (tmp.winValue !== 0) {
          result.winValue = tmp.winValue;
        }
        result.chainValue += tmp.chainValue;
      }
    }
    return result;
  }

  function drawCircle(context, x, y, r, fill) {
    context.save();
    context.fillStyle = fill;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
  };

  function draw(context) {
    var x, y;
    var fgColor;
    for (y = 0; y < 6; y++) {
      for (x = 0; x < 7; x++) {
        fgColor = "transparent";
        if (m_map[y][x] >= 1) {
          fgColor = "#ff4136";
        } else if (m_map[y][x] <= -1) {
          fgColor = "#0074d9";
        }
        drawCircle(context, 75 * x + 100, 75 * y + 50, 25, fgColor);
      }
    }
  }

  function print() {
    var msg = "\n";
    var j = 0;
    for (var i = 0; i < 6; i++) {
      for (j = 0; j < 7; j++) {
        msg += " " + m_map[i][j];
      }
      msg += "\n";
    }
    console.log(msg);
  };

  this.clone = clone;
  this.fill = fill;
  this.check = checkMap;
  this.AICheck = AICheck;
  this.drawCircle = drawCircle;
  this.draw = draw;
  this.print = print;
  this.setValue = setValue;
  this.getValue = getValue;
}