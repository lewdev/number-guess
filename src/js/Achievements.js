
const Achievements = (() => {
  const getParams = data => {
    const answer = data["currentGame"]["number"];
    const difficulty = data["currentGame"]["difficulty"];
    const max = Config.DIFFICULTY_LEVELS[difficulty][1];
    const time = data["currentGame"]["timeMs"];
    const cpuGuessArr = GuessUtil.genGuessArr(answer, max);
    const cpuCount = cpuGuessArr.length;
    const playerCount = data["currentGame"]["guesses"].length;
    const gamesPlayed = data["history"].length;
    const achievements = data["achievements"] || [];
    console.log("gamesPlayed=" + gamesPlayed);
    return {
      difficulty,
      answer,
      time,
      cpuCount,
      playerCount,
      gamesPlayed,
      achievements,
    };
  };
  const gameAchievementList = {
    "Beat the CPU": {
      description: "The number of guesses are less than a CPU.",
      isComplete: achievementParams => {
        const { cpuCount, playerCount } = achievementParams;
        return playerCount < cpuCount;
      }
    },
    "On Par w/CPU": {
      description: "The number of guesses match the same as a CPU.",
      isComplete: achievementParams => {
        const { cpuCount, playerCount } = achievementParams;
        return playerCount === cpuCount;
      }
    },
    "Answer was Prime": {
      description: "The number you had to guess turned out to be a Prime Number.",
      isComplete: achievementParams => {
        return Num.isPrime(achievementParams.answer);
      }
    },
  };
  const STAR_FILLED =  "\u2605";//"\uD83D\uDFCA";
  const STAR_OUTLINE = "\u2606";//"\u2729";
  const fastTime = cpuCount => (cpuCount * 4000);
  const superTime = cpuCount => (cpuCount * 2500);
  const ultraTime = cpuCount => (cpuCount * 1500);
  for (let difficultyLevel in Config.DIFFICULTY_LEVELS) {
    gameAchievementList["Fast Guesser (" + difficultyLevel + ")"] = {
      description: "You're pretty quick to find your answer.",
      isComplete: achievementParams => {
        const { difficulty, time, cpuCount } = achievementParams;
        return difficulty === difficultyLevel && time > superTime(cpuCount) && time <= fastTime(cpuCount);
      }
    };
    gameAchievementList[`Fast Guesser ${STAR_OUTLINE}${STAR_FILLED}${STAR_FILLED} (${difficultyLevel})"`] = {
      description: "You're REALLY quick to find your answer.",
      isComplete: achievementParams => {
        const { difficulty, time, cpuCount } = achievementParams;
        return difficulty === difficultyLevel && time > ultraTime(cpuCount) && time <= superTime(cpuCount);
      }
    };
    gameAchievementList["Ultra Fast Guesser (" + difficultyLevel + ")"] = {
      description: "Holy moly, you're fast!",
      isComplete: achievementParams => {
        const { difficulty, time, cpuCount } = achievementParams;
        return difficulty === difficultyLevel && time < ultraTime(cpuCount);
      }
    };
  }
  const lifeAchievementList = {
    "Played 10 Games": {
      description: "Play 10 games. Thanks for playing!",
      isComplete: achievementParams => { return achievementParams.gamesPlayed >= 10; }
    },
    "Played 50 Games": {
      description: "Play 50 games. It's kind of addicting isn't it!",
      isComplete: achievementParams => { return achievementParams.gamesPlayed >= 50; }
    },
    "Played 100 Games": {
      description: "Play 100 games. You're awesome!",
      isComplete: achievementParams => { return achievementParams.gamesPlayed >= 100; }
    },
    "Beat Easy": {
      description: "Guess the number on Easy.",
      isComplete: achievementParams => { return achievementParams.difficulty === "Easy"; }
    },
    "Beat Medium": {
      description: "Guess the number on Medium.",
      isComplete: achievementParams => { return achievementParams.difficulty === "Medium"; }
    },
    "Beat Hard": {
      description: "Guess the number on Hard.",
      isComplete: achievementParams => { return achievementParams.difficulty === "Hard"; }
    },
    "Beat Insane": {
      description: "Guess the number on Insane.",
      isComplete: achievementParams => { return achievementParams.difficulty === "Insane"; }
    },
    "Beat Nightmare": {
      description: "Guess the number on Nightmare.",
      isComplete: achievementParams => { return achievementParams.difficulty === "Nightmare"; }
    },
    "Beat All Modes": {
      description: "Guess the number on all modes.",
      isComplete: achievementParams => {
        const { achievements } = achievementParams;
        return achievements.includes("Beat Easy")
          && achievements.includes("Beat Medium")
          && achievements.includes("Beat Hard")
          && achievements.includes("Beat Insane")
          && achievements.includes("Beat Nightmare")
        ;
      }
    },
  };
  return {
    getParams,
    getCount: () => Object.keys(gameAchievementList).length + Object.keys(lifeAchievementList).length,
    getAll: () => Object.keys(gameAchievementList).concat(Object.keys(lifeAchievementList)),
    getGameList: data => {
      const params = Achievements.getParams(data);
      const list = [];
      let achievement;
      for (let name in gameAchievementList) {
        achievement = gameAchievementList[name];
        list.push({
          name,
          description: achievement.description,
          isComplete: achievement.isComplete(params)
        });
      }
      return list;
    },
    getLifeList: data => {
      const params = Achievements.getParams(data);
      const list = [];
      let achievement;
      for (let name in lifeAchievementList) {
        achievement = lifeAchievementList[name];
        list.push({
          name,
          description: achievement.description,
          isComplete: achievement.isComplete(params)
        });
      }
      return list;
    },
    get: ach => {
      let achievement = lifeAchievementList[ach] || gameAchievementList[ach] || false;
      if (!achievement) {
        console.error("Achievement NOT found.");
        return { description: "" };
      }
      return achievement;
    },
  }
})();