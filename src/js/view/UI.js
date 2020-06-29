const DOM = {
  puzzle: document.querySelector('.puzzle'),
  time: document.querySelector('.timer-number'),
  samples: document.querySelector('.samples'),
  items: null,
  correct: document.querySelector('.correct__number'),
  wrong: document.querySelector('.wrong__number')
};

/**
 * add selected samples to page
 * @param {Number[]} samples
 */
export const addSample = samples => {
  for (const i of samples)
    DOM.samples.innerHTML += `<div><img src="./img/${i}.png" alt="Sample${i}" class="sample"/></div>`;
};

/**
 * add selected items to puzzle
 * @param {Number[]} items
 */
export const addItem = items => {
  let i = 0;
  for (const item of items)
    DOM.puzzle.innerHTML += `<div><img src="./img/${
      item.type
    }.png" alt="Sample${item.type}" class="item" data-num=${i++}/></div>`;
};

/**
 * add event listener to items
 * @param {EventListenerOrEventListenerObject} func
 */
export const setItemsClick = func => {
  DOM.items = document.querySelectorAll('.item');

  DOM.items.forEach(item => {
    item.addEventListener('click', func);
  });
};

/**
 * 1- update style if clicked item
 * 2- update score
 * 3- play audio
 * @param {Element} target
 * @param {[Boolean, Number]} result
 */
export const update = (target, result) => {
  target.style.opacity = 0.5;

  let audio;
  if (result[0]) {
    DOM.correct.innerHTML = result[1];
    audio = new Audio('./audio/correct.wav');
  } else {
    DOM.wrong.innerHTML = result[1];
    audio = new Audio('./audio/wrong.wav');
  }
  audio.play();
};
