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

export const getFinish = () => state.finish;
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
  // first item
  state.samples.push(Math.floor(Math.random() * 4 + 5));

  // second item
  let r;
  do r = Math.floor(Math.random() * 4 + 5);
  while (state.samples.includes(r));
  state.samples.push(r);

  // third item
  state.samples.splice(
    (Math.random() * 10) % 3,
    0,
    Math.floor(Math.random() * 4 + 1)
  );

  return state.samples;
};

const getRandomItem = () => {
  const r = Math.floor(Math.random() * 8 + 1);
  if (state.samples.includes(r)) state.total++;
  return r;
};

/**
 * select item randomly for filling in puzzle
 * @param {Number} n number of item in puzzle
 */
export const selectItem = (n = 36) => {
  state.items = [];
  state.total = 0;

  for (let i = 0; i < n; i++) state.items.push(getRandomItem());

  if (state.total !== 0) return state.items;
  return selectItem();
};

const getScore = () =>
  Math.floor(((state.score.correct - state.score.wrong) / state.total) * 1000);

/**
 * calculate final score and return it.
 */
export const calcScore = () => {
  const score = getScore();

  return {
    score,
    correct: state.score.correct,
    wrong: state.score.wrong,
    max: score // TODO
  };
};

/**
 * select item with this index.
 * return [isCorrect, correct, wrong, total score, isAllFind].
 * second item in array is either number of correct or wrong.
 * @param {Number} index index of item
 */
export const select = index => {
  if (state.finish) return;

  state.items[index] = getRandomItem();

  const isCorrect = state.samples.includes(state.items[index]);
  if (isCorrect) state.score.correct++;
  else state.score.wrong++;

  return {
    isCorrect,
    correct: state.score.correct,
    wrong: state.score.wrong,
    score: getScore()
  };
};
