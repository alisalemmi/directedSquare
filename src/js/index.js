// eslint-disable-next-line import/extensions, import/no-unresolved
import '../scss/main';

import '../img/1.png';
import '../img/2.png';
import '../img/3.png';
import '../img/4.png';
import '../img/5.png';
import '../img/6.png';
import '../img/7.png';
import '../img/8.png';
import '../img/logo2.png';
import '../img/sprite.svg';

import '../audio/correct.wav';
import '../audio/wrong.wav';

import * as UI from './view/UI';
import * as Item from './model/items';
import * as TimerUI from './view/timer';
import * as Timer from './model/timer';
import * as Popup from './view/popup';

const TIME = 30;

//-----------------------------
//            click
//-----------------------------
const clickHandler = e => {
  const index = parseInt(e.target.getAttribute('data-num'));

  const result = Item.select(index);

  if (result) UI.update(e.target, result);
};

const finish = () => {
  Item.setFinish(true);
  Popup.showScore(Item.calcScore());
};
//-----------------------------
//            fill
//-----------------------------
Popup.playButtonHandler(() => {
  // show 3 2 1
  Popup.showRestart(() => Timer.start(TIME));

  // reset
  UI.reset();
  Item.reset();

  // add items
  UI.addSamples(Item.selectSample());
  UI.addItem(Item.selectItem());

  // handle click
  UI.setItemsClick(clickHandler);
});

//-----------------------------
//            timer
//-----------------------------
document.addEventListener('tick', e => {
  TimerUI.update(e.detail.remain, e.detail.total);
});

document.addEventListener('timeUp', finish);

//-----------------------------
//            other
//-----------------------------
setTimeout(() => {
  document.querySelector('#check__menu').checked = true;
}, 7000);

Popup.helpHandler(Item.getFinish);
