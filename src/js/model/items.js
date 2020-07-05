const state = {
  samples: [],
  items: [],
  total: 0,
  score: {
    correct: 0,
    wrong: 0
  },
  finish: true
};

/**
 * check that all items is found.
 */
export const isFinish = () => state.total === state.score.correct;

export const setFinish = isFinish => {
  state.finish = isFinish;
};

export const reset = () => {
  state.samples = [];
  state.items = [];
  state.total = 0;
  state.score.correct = 0;
  state.score.wrong = 0;
  state.finish = false;
};

/**
 * select 3 different item randomly and return them
 */
export const selectSample = () => {
  while (state.samples.length < 3) {
    const r = Math.floor(Math.random() * 8 + 1);
    if (!state.samples.includes(r)) state.samples.push(r);
  }

  return state.samples;
};

/**
 * select item randomly for filling in puzzle
 * @param {Number} n number of item in puzzle
 */
export const selectItem = (n = 36) => {
  for (let i = 0; i < n; i++) {
    const r = Math.floor(Math.random() * 8 + 1);
    state.items.push({ type: r, select: false });

    if (state.samples.includes(r)) state.total++;
  }

  if (state.total !== 0) return state.items;
  return selectItem();
};

/**
 * select item with this index.
 * return [isCorrect, score, total score].
 * second item in array is either number of correct or wrong.
 * @param {Number} index index of item
 */
export const select = index => {
  if (state.finish || state.items[index].select) return;

  state.items[index].select = true;

  if (state.samples.includes(state.items[index].type)) {
    return [true, ++state.score.correct, getScore()];
  } else {
    return [false, ++state.score.wrong, getScore()];
  }
};

const getScore = () =>
  Math.floor(
    ((state.score.correct - state.score.wrong / 3) / state.total) * 10000
  ) / 100;

const getMaxScore = score => {
  let scores = localStorage.getItem('score')?.split(' ');
  if (scores == null) scores = [];
  scores.push(score);
  localStorage.setItem('score', scores.join(' '));

  return Math.max(...scores);
};

/**
 * calculate final score and return it.
 */
export const calcScore = () => {
  const score = getScore();

  return {
    score,
    correct: state.score.correct,
    wrong: state.score.wrong,
    max: getMaxScore(score)
  };
};

export const getSolution = () =>
  state.items.map(val => state.samples.includes(val.type));
