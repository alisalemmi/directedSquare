import * as UI from './view/UI';
import * as Item from './model/items';
import * as TimerUI from './view/timer';
import * as Timer from './model/timer';
import * as Popup from './view/popup';

const TIME = 30;

//-----------------------------
//            fill
//-----------------------------
const reset = () => {
  Item.reset();
  UI.reset();
};

const fillPage = () => {
  UI.addSample(Item.selectSample());
  UI.addItem(Item.selectItem());

  UI.setItemsClick(clickHandler);
};

const finish = isTimeUp => {
  const time = Timer.getTime()
  Item.setFinish(true);
  Popup.showScore(isTimeUp, Item.calcScore(time), {
    time,
    total: TIME
  });
  UI.setSolution(Item.getSolution());
};

//-----------------------------
//            click
//-----------------------------
const clickHandler = e => {
  const index = parseInt(e.target.getAttribute('data-num'));

  const result = Item.select(index);

  if (result) {
    UI.update(e.target, result);

    if (result.isAllFind) {
      finish(false);
      Timer.stop();
    }
  }
};

Popup.playButtonHandler(() => {
  Popup.showRestart(() => Timer.start(TIME));

  reset();
  fillPage();
});

//-----------------------------
//            timer
//-----------------------------
document.addEventListener('tick', e => {
  TimerUI.update(e.detail.remain, e.detail.total);
});

document.addEventListener('timeUp', () => finish(true));

//-----------------------------
//            other
//-----------------------------
setTimeout(() => {
  document.querySelector('#check__menu').checked = true;
}, 7000);

Popup.helpHandler(Item.getFinish);

/**
 * rank
 * help
 */
