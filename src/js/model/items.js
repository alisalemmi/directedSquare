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

const getRandomItem = (old = 10) => {
  let newItem;

  // make sure that there is at least 3 correct item in puzzle
  if (state.total - state.score.correct < 3) {
    newItem = state.samples[state.total % 3];
    if (newItem === old) newItem = state.samples[(state.total + 1) % 3];
  }
  // select new item that is not old item
  else {
    newItem = Math.floor(Math.random() * (7 + (old === 10)) + 1);
    if (newItem >= old) newItem++;
  }

  // upsate total correct
  if (state.samples.includes(newItem)) state.total++;

  return newItem;
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
  return {
    score: getScore(),
    correct: state.score.correct,
    wrong: state.score.wrong
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

  // check that selected item is correct
  const isCorrect = state.samples.includes(state.items[index]);

  if (isCorrect) state.score.correct++;
  else state.score.wrong++;

  // change selected item
  state.items[index] = getRandomItem(state.items[index]);

  return {
    isCorrect,
    correct: state.score.correct,
    wrong: state.score.wrong,
    score: getScore(),
    newItem: state.items[index]
  };
};
