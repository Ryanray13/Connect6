/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Connect6', function() {

  'use strict';

  beforeEach(function() {
    browser.get('http://localhost:9000/app/game.min.html');
  });

  function getDiv(row, col) {
    return element(by.id('e2e_test_div_' + row + 'x' + col));
  }

  function getImg(row, col) {
    return element(by.id('e2e_test_img_' + row + 'x' + col));
  }

  function expectPiece(row, col, pieceKind) {
    var piece = pieceKind === 'X' ? "black" : pieceKind === 'O' ? "white" : '';
    expect(getImg(row, col).isDisplayed()).toEqual(pieceKind === "" ? false : true);
    expect(getImg(row, col).getAttribute("src")).toEqual(
      pieceKind === "" ? null : "http://localhost:9000/app/imgsrc/" + piece + ".png");
  }

  function expectBoard(board) {
    for (var row = 0; row < 19; row++) {
      for (var col = 0; col < 19; col++) {
        expectPiece(row, col, board[row][col]);
      }
    }
  }

  function clickDivAndExpectPiece(row, col, pieceKind) {
    getDiv(row, col).click();
    expectPiece(row, col, pieceKind);
  }

  // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
  // or a number representing the playerIndex (-2 for viewer, 0 for Black player, 1 for White player, etc)
  function setMatchState(matchState, playMode) {
    browser.executeScript(function(matchStateInJson, playMode) {
      var stateService = window.e2e_test_stateService;
      stateService.setMatchState(angular.fromJson(matchStateInJson));
      stateService.setPlayMode(angular.fromJson(playMode));
      angular.element(document).scope().$apply(); // to tell angular that things changes.
    }, JSON.stringify(matchState), JSON.stringify(playMode));
  }

    /** Get the board needed, params is the list of pieces {pos:[row, col], piece:''} */
  function getBoard(pieces) {
    var board = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];

    //set all the pieces 
    var i;
    var pos;
    var piece;
    if (pieces) {
      for (i = 0; i < pieces.length; i++) {
        pos = pieces[i].pos;
        piece = pieces[i].piece;
        board[pos[0]][pos[1]] = piece;
      }
    }
    return board;
  }

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Connect6');
  });

  it('should have an empty Connect6 board', function () {
    expectBoard(getBoard());
  });

  it('should show X if I click in 0x0', function () {
    clickDivAndExpectPiece(0, 0, "X");
    expectBoard(
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']]);
  });

  it('should ignore clicking on a non-empty cell', function () {
    clickDivAndExpectPiece(0, 0, "X");
    clickDivAndExpectPiece(0, 0, "X"); // clicking on a non-empty cell doesn't do anything.
    clickDivAndExpectPiece(1, 1, "O");
    expectBoard(
        [['X', '', ''],
         ['', 'O', ''],
         ['', '', '']]);
  });

  it('should end game if X wins', function () {
    for (var col = 0; col < 3; col++) {
      clickDivAndExpectPiece(1, col, "X");
      getDiv(2, col).click();
      // After the game ends, player "O" click (in cell 2x2) will be ignored.
      expectPiece(2, col, col === 2 ? "" : "O");
    }
    expectBoard(
        [['', '', ''],
         ['X', 'X', 'X'],
         ['O', 'O', '']]);
  });

  it('should end the game in tie', function () {
    clickDivAndExpectPiece(0, 0, "X");
    clickDivAndExpectPiece(1, 0, "O");
    clickDivAndExpectPiece(0, 1, "X");
    clickDivAndExpectPiece(1, 1, "O");
    clickDivAndExpectPiece(1, 2, "X");
    clickDivAndExpectPiece(0, 2, "O");
    clickDivAndExpectPiece(2, 0, "X");
    clickDivAndExpectPiece(2, 1, "O");
    clickDivAndExpectPiece(2, 2, "X");
    expectBoard(
        [['X', 'X', 'O'],
         ['O', 'O', 'X'],
         ['X', 'O', 'X']]);
  });

  var delta1 = {row: 1, col: 0};
  var board1 =
      [['X', 'O', ''],
       ['X', '', ''],
       ['', '', '']];
  var delta2 = {row: 1, col: 1};
  var board2 =
      [['X', 'O', ''],
       ['X', 'O', ''],
       ['', '', '']];
  var delta3 = {row: 2, col: 0};
  var board3 =
      [['X', 'O', ''],
       ['X', 'O', ''],
       ['X', '', '']];
  var delta4 = {row: 2, col: 1};
  var board4 =
      [['X', 'O', ''],
       ['X', 'O', ''],
       ['', 'X', '']];

  var matchState2 = {
    turnIndexBeforeMove: 1,
    turnIndex: 0,
    endMatchScores: null,
    lastMove: [{setTurn: {turnIndex: 0}},
          {set: {key: 'board', value: board2}},
          {set: {key: 'delta', value: delta2}}],
    lastState: {board: board1, delta: delta1},
    currentState: {board: board2, delta: delta2},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };
  var matchState3 = {
    turnIndexBeforeMove: 0,
    turnIndex: -2,
    endMatchScores: [1, 0],
    lastMove: [{endMatch: {endMatchScores: [1, 0]}},
         {set: {key: 'board', value: board3}},
         {set: {key: 'delta', value: delta3}}],
    lastState: {board: board2, delta: delta2},
    currentState: {board: board3, delta: delta3},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };
  var matchState4 = {
    turnIndexBeforeMove: 0,
    turnIndex: 1,
    endMatchScores: null,
    lastMove: [{setTurn: {turnIndex: 1}},
         {set: {key: 'board', value: board4}},
         {set: {key: 'delta', value: delta4}}],
    lastState: {board: board2, delta: delta2},
    currentState: {board: board4, delta: delta4},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };

  it('can start from a match that is about to end, and win', function () {
    setMatchState(matchState2, 'passAndPlay');
    expectBoard(board2);
    clickDivAndExpectPiece(2, 0, "X"); // winning click!
    clickDivAndExpectPiece(2, 1, ""); // can't click after game ended
    expectBoard(board3);
  });

  it('cannot play if it is not your turn', function () {
    // Now make sure that if you're playing "O" (your player index is 1) then
    // you can't do the winning click!
    setMatchState(matchState2, 1); // playMode=1 means that yourPlayerIndex=1.
    expectBoard(board2);
    clickDivAndExpectPiece(2, 0, ""); // can't do the winning click!
    expectBoard(board2);
  });

  it('can start from a match that ended', function () {
    setMatchState(matchState3, 'passAndPlay');
    expectBoard(board3);
    clickDivAndExpectPiece(2, 1, ""); // can't click after game ended
  });

  it('should make an AI move after at most 1.5 seconds', function () {
    setMatchState(matchState4, 'playAgainstTheComputer');
    browser.sleep(1500);
    expectBoard(
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['O', 'X', '']]);
    clickDivAndExpectPiece(2, 2, "X"); // Human-player X did a very stupid move!
    browser.sleep(1500); // AI will now make the winning move
    expectBoard(
        [['X', 'O', 'O'],
         ['X', 'O', ''],
         ['O', 'X', 'X']]);
    clickDivAndExpectPiece(1, 2, ""); // Can't make a move after game is over
  });
});
