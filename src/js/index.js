import * as UI from './view/UI';
import * as Item from './model/items';
import * as timerUI from './view/timer';
import * as timer from './model/timer';

const fillPage = () => {
  UI.addSample(Item.selectSample());
  UI.addItem(Item.selectItem());
};

fillPage();

UI.setItemsClick(e => {
  const index = parseInt(e.target.getAttribute('data-num'));

  if (Item.isSelected(index)) return;

  const result = Item.select(index);
  UI.update(e.target, result);

  const finish = Item.checkFinish();
  if (finish[0] === true) {
    alert(finish[1]);
    timer.stop();
  }
  //TODO
  // instead of alert result page should shown
});

document.addEventListener('tick', e => {
  timerUI.updateNumber(e.detail.label);
  timerUI.setCircleDasharray(e.detail.circleDasharray);
  timerUI.setRemainingPathColor(e.detail.remainingPathColor);
});

document.addEventListener('timeUp', () => {
  //TODO
  // instead of log result page should shown
  console.log('finish', Item.calcSocre());
});

timer.start(20);
