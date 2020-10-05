const Config = (() => {
  return {
    VIEW: { START: 1, GAME: 2, END: 3, HISTORY: 4 },
    SUB_VIEW: { HISTORY: 1, ACHIEVEMENTS: 2 },
    DIFFICULTY_LEVELS: {
      "Easy": [1, 10]
      , "Medium": [1, 100]
      , "Hard": [1, 1000]
      , "Insane": [1, 10000]
      , "Nightmare": [1, 1000000]
    },
    DIFFICULTY_ICONS: {
      "Easy": "far fa-laugh-beam"
      , "Medium": "far fa-smile"
      , "Hard": "far fa-grin-beam-sweat"
      , "Insane": "far fa-grin-squint-tears"
      , "Nightmare": "fas fa-poo"
    },
  };
})();