const GuessUtil = (() => {
  return {
    genGuessArr: (answer, max) => {
      let guesses = []
        , found = false
        , min = 0
        , guess = Math.floor(max / 2)
      ;
      while(!found) {
        guesses.push(Num.thousandsSeparators(guess));
        if (guess === answer) {
          found = true;
        }
        else if (guess < answer) {
          min = guess;
        }
        else if (guess > answer) {
          max = guess;
        }
        guess = Math.floor((max - min) / 2) + min;
      }
      return guesses;
    }
  }
})();
