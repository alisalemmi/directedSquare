import * as UI from './view/UI';
import * as Item from './model/items';
import * as timerUI from './view/timer';
import * as timer from './model/timer';

let finish = true;

//-----------------------------
//            click
//-----------------------------
const clickHandler = e => {
  if (finish) return;

  const index = parseInt(e.target.getAttribute('data-num'));

  const result = Item.select(index);

  if (result) UI.update(e.target, result);

  finish = Item.checkFinish()[0];
  if (finish === true) {
    document
      .querySelectorAll('.popup__close')
      .forEach(el => (el.style.visibility = 'hidden'));
    showScore();
    timer.stop();
  }
  //TODO
  // instead of alert result page should shown
};

UI.backdropClick(() => !finish);

//-----------------------------
//            fill
//-----------------------------
const reset = () => {
  finish = false;
  document
    .querySelectorAll('.popup__close')
    .forEach(el => (el.style.visibility = 'visible'));

  Item.reset();
  UI.reset();
};

const fillPage = () => {
  UI.addSample(Item.selectSample());
  UI.addItem(Item.selectItem());

  UI.setItemsClick(clickHandler);
  document.querySelector('.container').style.visibility = 'visible';
};

const check = () => {
  document.querySelector('#popup').checked = true;
};

const showMenu = () => {
  document
    .querySelector('.popups')
    .classList.remove('popup-score', 'popup-how');
  document.querySelector('.popups').classList.add('popup-menu');

  document.querySelector('#popup__score').classList.add('hide');
  document.querySelector('#popup__menu').classList.remove('hide');
  document.querySelector('#popup__how').classList.add('hide');

  if (document.querySelector('#popup').checked === false)
    setTimeout(check, 300);
};

const showScore = () => {
  let score = Item.calcSocre();
  let scores = localStorage.getItem('score')?.split(' ');
  if (scores == null) scores = [];

  scores.push(score);
  localStorage.setItem('score', scores.join(' '));
  document.querySelector('.popup__score__score').innerHTML =
    score < 0 ? `${-score}-` : score;

  document.querySelector('.popup__score__max').innerHTML = Math.max(...scores);

  document.querySelector('.popups').classList.remove('popup-menu', 'popup-how');
  document.querySelector('.popups').classList.add('popup-score');

  document.querySelector('#popup__score').classList.remove('hide');
  document.querySelector('#popup__menu').classList.add('hide');
  document.querySelector('#popup__how').classList.add('hide');

  if (document.querySelector('#popup').checked === false)
    setTimeout(check, 300);
};

const showHow = () => {
  document
    .querySelector('.popups')
    .classList.remove('popup-menu', 'popup-score');
  document.querySelector('.popups').classList.add('popup-how');

  document.querySelector('#popup__score').classList.add('hide');
  document.querySelector('#popup__menu').classList.add('hide');
  document.querySelector('#popup__how').classList.remove('hide');

  if (document.querySelector('#popup').checked === false)
    setTimeout(check, 300);
};

//-----------------------------
//            timer
//-----------------------------
document.addEventListener('tick', e => {
  timerUI.updateNumber(e.detail.label);
  timerUI.setCircleDasharray(e.detail.circleDasharray);
  timerUI.setRemainingPathColor(e.detail.remainingPathColor);
});

document.addEventListener('timeUp', () => {
  finish = true;
  document
    .querySelectorAll('.popup__close')
    .forEach(el => (el.style.visibility = 'hidden'));
  showScore();

});

document.querySelectorAll('.popup__play').forEach(el =>
  el.addEventListener('click', () => {
    reset();
    setTimeout(fillPage, 300);
    document.querySelector('#popup').checked = false;
    document
      .querySelectorAll('.popup__play > .button__label')
      .forEach(el => (el.innerHTML = 'شروع مجدد'));
    document
      .querySelectorAll('.popup__play > .button__icon')
      .forEach(
        el => (el.innerHTML = '<use xlink:href="./img/sprite.svg#refresh" />')
      );

    timer.start(35);
  })
);

setTimeout(() => {
  document.querySelector('#popup').checked = true;
}, 7000);

document.querySelectorAll('#popup__menu .popup__how').forEach(el =>
  el.addEventListener('click', () => {
    showHow();
  })
);

document.querySelectorAll('#popup__how .popup__how').forEach(el =>
  el.addEventListener('click', () => {
    showMenu();
  })
);

document.querySelector('.help').addEventListener('click', showMenu);
