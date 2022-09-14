/**
 * TODO
 * - create favicons
 * - enable star-rating.
 * - check if no response bug exists.
 */
var numberGuessingGame = (() => {
  const APP_DATA_KEY = "number-guessing-game"
    , startScreen = document.getElementById("startScreen")
    , gameScreen = document.getElementById("gameScreen")
    , endScreen = document.getElementById("endScreen")
    , historyScreen = document.getElementById("historyScreen")
    , numberInput = document.getElementById("numberInput")
    , guessBtn = document.getElementById("guessBtn")
    , difficultySelect = document.getElementById("difficultySelect")
    , lastGuessResponse = document.getElementById("lastGuessResponse")
    , increaseIncrementBtn = document.getElementById("increaseIncrementBtn")
    , decreaseIncrementBtn = document.getElementById("decreaseIncrementBtn")
    , addBtn = document.getElementById("addBtn")
    , subtractBtn = document.getElementById("subtractBtn")
  ;
  const cache = {
    "incrementBy": 1
  }
  let data = {
    "currentView": Config.VIEW.START
    , "currentSubView": Config.SUB_VIEW.HISTORY
    , "selectedDifficulty": "Easy"
    , "currentGame": null
    , "history": []
  };
  window.onload = function() {
    loadData();
    data['currentView'] = Config.VIEW.START;
    initUi();
    render();
  };
  function initUi() {
    const startBtns = document.querySelectorAll(".startBtn");
    const switchSubViewBtn = document.querySelector(".switchSubViewBtn");
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
    if (switchSubViewBtn) {
      switchSubViewBtn.onclick = () => {
        const isAchView = data["currentSubView"] && data["currentSubView"] === Config.SUB_VIEW.ACHIEVEMENTS;
        data["currentSubView"] = isAchView ? Config.SUB_VIEW.HISTORY : Config.SUB_VIEW.ACHIEVEMENTS;
        switchSubViewBtn.title = "See " + (isAchView ? "Achievements" : "History");
        switchSubViewBtn.innerHTML = `<i class="fas fa-${isAchView ? 'medal' : 'history'} fa-fw"></i>`;
        render();
      };
    }
    guessBtn.onclick = function() {
      guess();
    };
    numberInput.onkeyup = function(e) {
      if (e.keyCode === 13) {
          e.preventDefault();
          guess();
      }
      e.target.value = e.target.value.replace(/\D/g, '');
    };
    let arr = [];
    for (let diff in Config.DIFFICULTY_LEVELS) {
      HtmlUtil.addArrToArr([
        '<option value="', diff, '">', diff, ' ('
        , Config.DIFFICULTY_LEVELS[diff][0], '-'
        , Num.format(Config.DIFFICULTY_LEVELS[diff][1]), ')</option>'
      ], arr);
    }
    difficultySelect.innerHTML = arr.join("");
    difficultySelect.onchange = function() {
      data['selectedDifficulty'] = difficultySelect.value;
      render();
    };
    difficultySelect.value = data['selectedDifficulty'];
    HtmlUtil.trigger(difficultySelect, "change");
    increaseIncrementBtn.onclick = () => changeIncrement(true);
    decreaseIncrementBtn.onclick = () => changeIncrement(false);
    addBtn.onclick = () => add();
    subtractBtn.onclick = () => subtract();
  }
  const changeIncrement = increase => {
    const incrementBy = cache["incrementBy"];
    const diff = data['currentGame']['difficulty'];
    const maxIncrement = Config.DIFFICULTY_LEVELS[diff][1] / 10;
    if (increase) {
      if (incrementBy < maxIncrement) {
        cache["incrementBy"] = incrementBy * 10;
      }
    }
    else if (incrementBy > 1) {
      cache["incrementBy"] = incrementBy / 10;
    }
    increaseIncrementBtn.disabled = cache["incrementBy"] === maxIncrement;
    decreaseIncrementBtn.disabled = cache["incrementBy"] === 1;
    const incrementStr = Num.format(cache["incrementBy"]);
    addBtn.innerHTML = "+" + incrementStr;
    subtractBtn.innerHTML = "-" + incrementStr;
  };
  const add = () => {
    let num = parseInt(numberInput.value || 0, 10);
    const sum = num + cache["incrementBy"];
    const difficulty = data['currentGame']['difficulty'];
    const maxValue = Config.DIFFICULTY_LEVELS[difficulty][1];
    numberInput.value = sum < maxValue ? sum : maxValue;
    //console.log("add num=" + num + ", incrementBy=" + cache["incrementBy"] + ", sum=" + sum);
  };
  const subtract = () => {
    let num = parseInt(numberInput.value || 0, 10);
    let difference = num - parseInt(cache["incrementBy"], 10);
    numberInput.value = difference < 0 ? 0 : difference;
    //console.log("subtract num=" + num + ", decrementBy=" + cache["incrementBy"] + ", difference=" + difference);
  };
  function render() {
    const isStart = data['currentView'] === Config.VIEW.START
      , isGame = data['currentView'] === Config.VIEW.GAME
      , isEnd = data['currentView'] === Config.VIEW.END
      , isHistory = data['currentView'] === Config.VIEW.HISTORY
    ;
    startScreen.style.display = isStart ? '' : 'none';
    gameScreen.style.display = isGame ? '' : 'none';
    endScreen.style.display = isEnd ? '' : 'none';
    historyScreen.style.display = isHistory ? '' : 'none';
    //game screen
    let screen = null;
    switch (data['currentView']) {
      case Config.VIEW.START: screen = startScreen; break;
      case Config.VIEW.GAME: screen = gameScreen; break;
      case Config.VIEW.END: screen = endScreen; break;
      case Config.VIEW.HISTORY: screen = historyScreen; break;
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
      //const guesses = data['currentGame']['guesses'];
      const guessedNumStr = Num.format(guessedNum)
      if (guessedNum < number) {
        response += "Your guess: " + guessedNumStr + " was too low!";
      }
      else if (guessedNumStr > number) {
        response += "Your guess: " + guessedNumStr + " was too high!";
      }
      else if (guessedNum === number) {
        response += "Your guess: " + guessedNumStr + " was CORRECT!";
      }
    }
    lastGuessResponse.innerHTML = response;
    if (isGame || isEnd) {
      let prevGuesses = screen.querySelector('.prevGuesses');
      const guesses = data['currentGame']['guesses'];
      if (guesses && guesses.length > 0) {
        prevGuesses.innerHTML = '<strong>Guesses:</strong> ' + guesses.join("; ")
          + ' (' + guesses.length + ')';
      }
      else {
        prevGuesses.innerHTML = "";
      }
      let cpuGuesses = screen.querySelector('.cpuGuesses');
      if (cpuGuesses) {
        const diff = data['currentGame']['difficulty'];
        cpuGuesses.innerHTML = isEnd ? "<strong>CPU:</strong> " + displayCpuGuesses(number, Config.DIFFICULTY_LEVELS[diff][1]) : '';
      }
      const timeMs = screen.querySelector('.timeMs')
        , difficultyDiv = screen.querySelector('.difficulty')
        , achievementsDiv = screen.querySelector('.achievements')
      ;
      if (timeMs) {
        timeMs.innerHTML = "<strong>Time:</strong> " + (data['currentGame']['timeMs'] / 1000) + " seconds";
      }
      if (difficultyDiv) {
        const diff = data['currentGame']['difficulty'];
        difficultyDiv.innerHTML = "<strong>Difficulty:</strong> " + diff
          + ' (' + Config.DIFFICULTY_LEVELS[diff][0] + '-' + Num.format(Config.DIFFICULTY_LEVELS[diff][1]) + ') <i class="' + Config.DIFFICULTY_ICONS[diff] + '"></i>';
      }
      const achievements = data['currentGame']['achievements'] || [];
      const newLifeAch = data["currentGame"]["newLifeAchievements"] || [];
      displayAchievements(achievements.concat(newLifeAch), achievementsDiv, false);
    }
    renderHistory(screen);
    numberInput.focus();
  }
  function displayAchievements(achievements, elem, includeNotAchieved) {
    const arr = [];
    if (!elem) {
      return;
    }
    const achCount = achievements.length;
    if (achCount > 0) {
      HtmlUtil.addArrToArr([
        '<div class="card">'
        , '<div class="card-header p-2"><h4 class="m-0">Achievements (', achCount, ' of ', Achievements.getCount(), ')</h4></div>'
        , '<div class="card-body pt-0 pb-0">'
          , '<table class="table achievementTable"><tbody>'
      ], arr);
      achievements.map(ach => {
        HtmlUtil.addArrToArr([
          '<tr><td><div class="circle"><h2><i class="fas fa-medal text-warning"></i></h2></div></td>'
          , '<td class="text-left">'
            , '<div class="font-weight-bold">', ach, '</div>'
            , '<div>', Achievements.get(ach).description, '</div>'
          , '</td></tr>'
        ], arr);
      });
      if (includeNotAchieved) {
        Achievements.getAll().map(ach => {
          if (!achievements.includes(ach)) {
            HtmlUtil.addArrToArr([
              '<tr><td><div class="circle"><h2><i class="fas fa-medal text-secondary"></i></h2></div></td>'
              , '<td class="text-left text-secondary">'
                , '<div class="font-weight-bold">', ach, '</div>'
                , '<div>', Achievements.get(ach).description, '</div>'
              , '</td></tr>'
            ], arr);
          }
        });
      }
      HtmlUtil.addArrToArr([
          '</tbody></table>'
        , '</div></div>'
      ], arr);
    }
    elem.innerHTML = arr.join("");
  }
  function displayCpuGuesses(answer, max) {
    let guesses = GuessUtil.genGuessArr(answer, max);
    return guesses.join("; ") + " (" + guesses.length + ")";
  }

  function gotoStartScreen() {
    data['currentView'] = Config.VIEW.START;
    difficultySelect.value = data['selectedDifficulty'];
    HtmlUtil.trigger(difficultySelect, "change");
    render();
  }
  function startGame() {
    const selectedDiff = data['selectedDifficulty'];
    numberInput.value = "";
    data['currentView'] = Config.VIEW.GAME;
    data['currentGame'] = {
      'number': randRange(Config.DIFFICULTY_LEVELS[selectedDiff][0], Config.DIFFICULTY_LEVELS[selectedDiff][1])
      , 'guessedNumber': null
      , 'difficulty': selectedDiff
      , 'guesses': []
      , 'startDate': new Date()
      , 'timeMs': 0
    };
    cache["incrementBy"] = Config.DIFFICULTY_LEVELS[selectedDiff][1] / 10;
    changeIncrement(true);
    render();
  }
  function guess() {
    const guessedInput = numberInput.value && parseInt(numberInput.value, 10);
    const lastGuess = data['currentGame']['guessedNumber'];
    data['currentGame']['guessedNumber'] = guessedInput;
    //repeating the last guessed value doesn't count.
    if (lastGuess !== guessedInput) {
      data['currentGame']['guesses'].push(Num.format(data['currentGame']['guessedNumber']));
    }
    numberInput.focus();
    //matches
    if (data['currentGame']['guessedNumber'] === data['currentGame']['number']) {
      endGame();
    }
    else {
      render();
    }
  }
  function endGame() {
    data['currentView'] = Config.VIEW.END;
    data['currentGame']['timeMs'] = (new Date()).getTime() - data['currentGame']['startDate'].getTime();
    const gameAchievements = Achievements.getGameList(data);
    const lifeAchievements = Achievements.getLifeList(data);
    const gameAchNameArr = gameAchievements.filter(ach => ach.isComplete).map(ach => ach.name);
    const lifeAchNameArr = lifeAchievements.filter(ach => ach.isComplete).map(ach => ach.name);

    if (!data["achievements"]) data["achievements"] = [];
    let newLifeAch = lifeAchNameArr.filter(ach => !data["achievements"].includes(ach));
    data["currentGame"]["achievements"] = gameAchNameArr.concat(newLifeAch);
    data["currentGame"]["achievements"].forEach(ach => !data["achievements"].includes(ach) && data["achievements"].push(ach));
    data['history'].push(data['currentGame']);
    data['history'].sort(function(a, b) {
      const aDate = new Date(a.startDate).getTime()
      , bDate = new Date(b.startDate).getTime();
      return bDate - aDate;
    });
    //remove duplicates
    data["achievements"] = [...new Set(data["achievements"])];
    data["achievements"].sort();
    saveData();
    render();
  }
  function renderHistory(screen) {
    const playerHistory = screen.querySelector(".playerHistory");
    const achievementsDiv = screen.querySelector(".achievements");
    if (!playerHistory) {
      return;
    }
    let arr = [];
    if (!data['currentSubView'] || data['currentSubView'] === Config.SUB_VIEW.HISTORY) {
      const diff = data['selectedDifficulty'];
      const filteredList = data['history'].filter(item => { return item['difficulty'] === diff; });
      filteredList.sort((a, b) => a.timeMs - b.timeMs);// sort by shortest timeMs first
      let i, size = filteredList.length, item;
      HtmlUtil.addArrToArr([
        //'<h4><strong>Difficulty:</strong> ', diff, ' <i class="', DIFFICULTY_ICONS[diff], '"></i></h4>'
        '<table class="table"><thead>'
        , '<th>Date</th>'
        , '<th>Guesses</th>'
        , '<th>Time</th>'
        , '</thead><tbody>'
      ], arr);
      if (size > 0) {
        let achievements, count;
        for (i = 0; i < size; i++) {
          item = filteredList[i];
          achievements = item['achievements'] || [];
          count = achievements.length;
          HtmlUtil.addArrToArr([`
            <tr>
              <td><i class="${Config.DIFFICULTY_ICONS[item['difficulty']]}" title="${item['difficulty']}"></i>
              ${DateUtil.format(new Date(item['startDate']), "M/d/yyyy")}
            </td>
            <td>
              <span title="${item['guesses'].join("; ")}">${item['guesses'].length}</span>
              ${count > 0 ? `<span title="${achievements.join("; ")}">(${count} <i class="fas fa-medal text-warning"></i>)</span>` : ''}
            </td>
            <td>${item['timeMs'] / 1000}s</td>
            </tr>`
          ], arr);
        }
      }
      else {
        arr.push('<tr><td colspan="4">No records found.</td></tr>');
      }
      arr.push('</tbody></table>');
      achievementsDiv.style.display = "none";
    }
    else if (data['currentSubView'] === Config.SUB_VIEW.ACHIEVEMENTS) {
      achievementsDiv.style.display = "";
      let includeNotAchieved = true;
      displayAchievements(data["achievements"] || [], achievementsDiv, includeNotAchieved);
    }
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