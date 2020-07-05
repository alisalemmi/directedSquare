import * as UI from './view/UI';
import * as Item from './model/items';
import * as TimerUI from './view/timer';
import * as Timer from './model/timer';
import * as Popup from './view/popup';

const TIME = 35;

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
  Item.setFinish(true);
  Popup.showScore(isTimeUp, Item.calcScore(), {
    time: Timer.getTime(),
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

    if (Item.isFinish()) {
      finish(false);
      Timer.stop();
    }
  }
};

Popup.playButtonHandler(() => {
  reset();
  fillPage();
  Timer.start(TIME);
});

//-----------------------------
//            timer
//-----------------------------
document.addEventListener('tick', e => {
  TimerUI.updateNumber(e.detail.label);
  TimerUI.setCircleDasharray(e.detail.circleDasharray);
  TimerUI.setRemainingPathColor(e.detail.remainingPathColor);
});

document.addEventListener('timeUp', () => finish(true));

//-----------------------------
//            other
//-----------------------------
setTimeout(() => {
  document.querySelector('#check__menu').checked = true;
}, 7000);

document.querySelector('.help').addEventListener('click', Popup.showMenu);

/**
 * rank
 */