import config from '../../config.json';

const DOM = {
  samples: document.querySelector('.sample'),
  puzzle: document.querySelector('.puzzle'),
  correct: document.querySelector('.scoreboard__correct__number'),
  wrong: document.querySelector('.scoreboard__wrong__number'),
  total: document.querySelector('.scoreboard__total__number'),
  items: [],
  mute: document.querySelector('.mute')
};

let mute = false;

export const reset = () => {
  DOM.correct.innerHTML = '0';
  DOM.wrong.innerHTML = '0';
  DOM.total.innerHTML = '0';
};

/**
 * add selected samples to ui
 * @param {Number[]} samples
 */
export const addSamples = samples => {
  DOM.samples.innerHTML = '';
  for (const i of samples)
    DOM.samples.innerHTML += `<div><img src="./img/${i}.png" alt="Sample${i}" class="sample__item"/></div>`;
};

/**
 * add selected items to puzzle
 * @param {Number[]} items
 */
export const addItem = items => {
  DOM.puzzle.innerHTML = '';

  let i = 0;
  for (const item of items)
    DOM.puzzle.innerHTML += `<div class="puzzle__item__box"><img src="./img/${item}.png" alt="Sample${item}" class="puzzle__item" data-num=${i++}/></div>`;
};

/**
 * add event listener to items
 * @param {EventListenerOrEventListenerObject} func
 */
export const setItemsClick = func => {
  DOM.items = document.querySelectorAll('.puzzle__item');

  DOM.items.forEach(item => {
    item.addEventListener('click', func);
  });
};

/**
 * 1- update style if clicked item
 * 2- update score
 * 3- play audio
 * @param {Element} target
 * @param {{isCorrect, correct, wrong, score, newItem}} result
 */
export const update = (target, result) => {
  target.parentElement.classList.remove(
    'puzzle__item__box--correct',
    'puzzle__item__box--wrong'
  );

  target.style.transform = 'scale(0)';

  target.parentElement.classList.add(
    `puzzle__item__box${result.isCorrect ? '--correct' : '--wrong'}`,
    'puzzle__item__box--select'
  );

  setTimeout(() => {
    target.setAttribute('src', `./img/${result.newItem}.png`);
    target.setAttribute('alt', `Sample${result.newItem}`);
  }, config.puzzleItemChangeTime);

  setTimeout(() => {
    target.style.transform = 'scale(1)';
  }, config.puzzleItemChangeTime + 20);

  setTimeout(() => {
    target.parentElement.classList.remove('puzzle__item__box--select');
  }, config.puzzleItemSelectAnimation);

  DOM.correct.innerHTML = result.correct;
  DOM.wrong.innerHTML = result.wrong;
  DOM.total.innerHTML = result.score;

  if (!mute) {
    new Audio(
      result.isCorrect ? './audio/correct.wav' : './audio/wrong.wav'
    ).play();
  }
};

DOM.mute.addEventListener('click', () => {
  if (mute) {
    DOM.mute.innerHTML =
      '<svg class="icon"><use xlink:href="./img/sprite.svg#speaker"/></svg>';
    mute = false;
  } else {
    DOM.mute.innerHTML =
      '<svg class="icon"><use xlink:href="./img/sprite.svg#speaker-1"/></svg>';
    mute = true;
  }
});
