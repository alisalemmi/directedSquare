const DOM = {
  puzzle: document.querySelector('.puzzle'),
  time: document.querySelector('.timer-number'),
  samples: document.querySelector('.samples'),
  items: null,
  correct: document.querySelector('.correct__number'),
  wrong: document.querySelector('.wrong__number'),
  popup: document.getElementById('popup'),
  popupText: document.querySelector('.popup'),
  backdrop: document.querySelector('.popup__backdrop')
};

export const reset = () => {
  DOM.correct.innerHTML = '0';
  DOM.wrong.innerHTML = '0';
};

/**
 * add selected samples to page
 * @param {Number[]} samples
 */
export const addSample = samples => {
  DOM.samples.innerHTML = '';
  for (const i of samples)
    DOM.samples.innerHTML += `<div><img src="./img/${i}.png" alt="Sample${i}" class="sample"/></div>`;
};

/**
 * add selected items to puzzle
 * @param {Number[]} items
 */
export const addItem = items => {
  DOM.puzzle.innerHTML = '';

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

/**
 * close popup on click on backdrop
 */
export const backdropClick = isAllowed => {
  DOM.backdrop.addEventListener('click', function (e) {
    if (isAllowed() && e.target === this) DOM.popup.checked = false;
  });
};

const createPopup = text => {
  DOM.popupText.innerHTML = text;
};
