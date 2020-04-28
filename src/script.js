var numberGuessingGame = (function() {
  const APP_DATA_KEY = "number-guessing-game"
    , startScreen = document.getElementById("startScreen")
    , gameScreen = document.getElementById("gameScreen")
    , endScreen = document.getElementById("endScreen")
    , historyScreen = document.getElementById("historyScreen")
    , numberInput = document.getElementById("numberInput")
    , guessBtn = document.getElementById("guessBtn")
    , difficultySelect = document.getElementById("difficultySelect")
    , lastGuessResponse = document.getElementById("lastGuessResponse")
    , VIEW = { START: 1, GAME: 2, END: 3, HISTORY: 4 }
    , difficulty = {
      "Easy": [1, 10]
      , "Medium": [1, 100]
      , "Hard": [1, 1000]
      , "Insane": [1, 10000]
      , "Nightmare": [1, 1000000]
    }
    , difficultyIcon = {
      "Easy": "far fa-laugh-beam"
      , "Medium": "far fa-smile"
      , "Hard": "far fa-grin-beam-sweat"
      , "Insane": "far fa-grin-squint-tears"
      , "Nightmare": "fas fa-poo"
    }
    , MAX_HISTORY = 10
  ;
  let data = {
    "currentView": VIEW.START
    , "selectedDifficulty": "Easy"
    , "currentGame": null
    , "history": []
  };
  window.onload = function() {
    loadData();
    data['currentView'] = VIEW.START;
    initUi();
    render();
  };
  function initUi() {
    const startBtns = document.querySelectorAll(".startBtn");
    const gotoStartScreenBtns = document.querySelectorAll(".gotoStartScreenBtn");
    if (startBtns) {
      let i, size = startBtns.length;
      for (i = 0; i < size; i++) {
        startBtns[i].onclick = startGame;
      }
    }
    if (gotoStartScreenBtns) {
      let i, size = gotoStartScreenBtns.length;
      for (i = 0; i < size; i++) {
        gotoStartScreenBtns[i].onclick = gotoStartScreen;
      }
    }
    guessBtn.onclick = function() {
      guess();
    };
    numberInput.onkeyup = function(e) {
      if (e.keyCode === 13) {
          e.preventDefault();
          guess();
      }
      this.value = this.value.replace(/\D/g, '');
    };
    let arr = [];
    for (let diff in difficulty) {
      HtmlUtil.addArrToArr([
        '<option value="', diff, '">', diff, ' (', difficulty[diff][0], '-', difficulty[diff][1], ')</option>'
      ], arr);
    }
    difficultySelect.innerHTML = arr.join("");
    difficultySelect.onchange = function() {
      data['selectedDifficulty'] = difficultySelect.value;
      render();
    };
    difficultySelect.value = data['selectedDifficulty'];
    HtmlUtil.trigger(difficultySelect, "change");
  }
  function render() {
    const isStart = data['currentView'] === VIEW.START
      , isGame = data['currentView'] === VIEW.GAME
      , isEnd = data['currentView'] === VIEW.END
      , isHistory = data['currentView'] === VIEW.HISTORY
    ;
    startScreen.style.display = isStart ? '' : 'none';
    gameScreen.style.display = isGame ? '' : 'none';
    endScreen.style.display = isEnd ? '' : 'none';
    historyScreen.style.display = isHistory ? '' : 'none';

    //game screen
    let screen = null;
    switch (data['currentView']) {
      case VIEW.START: screen = startScreen; break;
      case VIEW.GAME: screen = gameScreen; break;
      case VIEW.END: screen = endScreen; break;
      case VIEW.HISTORY: screen = historyScreen; break;
    }
    if (!screen) {
      console.error("currentView value NOT FOUND.");
      return;
    }
    if (!data['currentGame']) {
      return;
    }
    let response = ""
      , number = data['currentGame']['number']
      , guessedNum = data['currentGame']['guessedNumber'];
    if (guessedNum) {
      const guesses = data['currentGame']['guesses'];
      if (guessedNum < number) {
        response += "Your guess: " + guessedNum + " was too low!";
      }
      else if (guessedNum > number) {
        response += "Your guess: " + guessedNum + " was too high!";
      }
      else if (guessedNum === number) {
        response += "Your guess: " + guessedNum + " was CORRECT!";
      }
    }
    lastGuessResponse.innerHTML = response;
    if (isGame || isEnd) {
      let prevGuesses = screen.querySelector('.prevGuesses');
      const guesses = data['currentGame']['guesses'];
      if (guesses && guesses.length > 0) {
        prevGuesses.innerHTML = '<strong>Previous Guesses:</strong> ' + guesses.join(", ")
          + ' (' + guesses.length + ')';
      }
      else {
        prevGuesses.innerHTML = "";
      }
      const timeMs = screen.querySelector('.timeMs')
        , difficultyDiv = screen.querySelector('.difficulty')
      ;
      if (timeMs) {
        timeMs.innerHTML = "<strong>Time:</strong> " + (data['currentGame']['timeMs'] / 1000) + " second(s)";
      }
      if (difficultyDiv) {
        const diff = data['currentGame']['difficulty'];
        difficultyDiv.innerHTML = "<strong>Difficulty:</strong> " + diff
          + ' (' + difficulty[diff][0] + '-' + difficulty[diff][1] + ') <i class="' + difficultyIcon[diff] + '"></i>';
      }
    }
    renderHistory(screen);
    numberInput.focus();
  }
  function gotoStartScreen() {
    data['currentView'] = VIEW.START;
    difficultySelect.value = data['selectedDifficulty'];
    HtmlUtil.trigger(difficultySelect, "change");
    render();
  }
  function startGame() {
    const selectedDiff = data['selectedDifficulty'];
    numberInput.value = "";
    data['currentView'] = VIEW.GAME;
    data['currentGame'] = {
      'number': randRange(difficulty[selectedDiff][0], difficulty[selectedDiff][1])
      , 'guessedNumber': null
      , 'difficulty': selectedDiff
      , 'guesses': []
      , 'startDate': new Date()
      , 'timeMs': 0
    };
    render();
  }
  function guess() {
    const guessedInput = numberInput.value;
    if (guessedInput) {
      data['currentGame']['guessedNumber'] = parseInt(guessedInput, 10);
      data['currentGame']['guesses'].push(data['currentGame']['guessedNumber']);
      //data['currentGame']['guesses'].sort();
    }
    else {
      data['currentGame']['guessedNumber'] = null;
    }
    numberInput.focus();
    if (data['currentGame']['guessedNumber'] === data['currentGame']['number']) {
      endGame();
    }
    else {
      render();
    }
  }
  function endGame() {
    data['currentView'] = VIEW.END;
    data['currentGame']['timeMs'] = (new Date()).getTime() - data['currentGame']['startDate'].getTime();
    data['history'].push(data['currentGame']);
    data['history'].sort(function(a, b) {
      const aDate = new Date(a.startDate).getTime()
        , bDate = new Date(b.startDate).getTime();
      return bDate - aDate;
    });
    saveData();
    render();
  }
  function renderHistory(screen) {
    const playerHistory = screen.querySelector(".playerHistory");
    if (!playerHistory) {
      return;
    }
    const diff = data['selectedDifficulty'];
    const filteredList = data['history'].filter(item => { return item['difficulty'] === diff; });
    let arr = [], i, size = filteredList.length, item;
    HtmlUtil.addArrToArr([
      //'<h4><strong>Difficulty:</strong> ', diff, ' <i class="', difficultyIcon[diff], '"></i></h4>'
      '<table class="table"><thead>'
      , '<th>Date</th>'
      , '<th>Difficulty</th>'
      , '<th>Guesses</th>'
      , '<th>Time</th>'
      , '</thead><tbody>'
    ], arr);
    if (size > 0) {
      for (i = 0; i < size; i++) {
        item = filteredList[i];
        HtmlUtil.addArrToArr([
          '<tr>'
          , '<td>', DateUtil.format(new Date(item['startDate']), "M/dd/yyyy HH:mm"), '</td>'
          , '<td>', ' <i class="' + difficultyIcon[item['difficulty']] + '"></i></td>' //, item['difficulty']
          , '<td><div title="', item['guesses'].join(", "), '">'
            , item['guesses'].length, '</div></td>'
          , '<td>', (item['timeMs'] / 1000), 's</td>'
          , '</tr>'
        ], arr);
      }
    }
    else {
      arr.push('<tr><td colspan="4">No records found.</td></tr>');
    }
    arr.push('</tbody></table>');
    playerHistory.innerHTML = arr.join("");
  }
  function loadData() {
    const localData = window.localStorage.getItem(APP_DATA_KEY);
    if (localData) {
      const parsedData = JSON.parse(localData);
      if (parsedData) {
        data = parsedData;
      }
    }
  }
  function saveData() {
    window.localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  }
  function clearData() {
    window.localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  }
  function rand(max) {
    return Math.floor(Math.random() * max);
  }
  function randRange(min, max) {
    return Math.floor(Math.random() * Math.abs(max - min)) + min;
  }
})();