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
  UI.update(e.target, result);

  let score;
  [finish, score] = Item.checkFinish();
  if (finish === true) {
    alert(score);
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

  Item.reset();
  UI.reset();
};

const fillPage = () => {
  UI.addSample(Item.selectSample());
  UI.addItem(Item.selectItem());

  UI.setItemsClick(clickHandler);
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
  //TODO
  // instead of log result page should shown
  console.log('finish', Item.calcSocre());
});

document.querySelector('.popup__play').addEventListener('click', () => {
  reset();
  fillPage();
  document.querySelector('#popup').checked = false;
  document.querySelector('.container').style.visibility = 'visible';
  UI.createPopup(`<div class="popup__top">
          <div class="popup__icon"></div>
          <h2 class="popup__title">مربع های جهت دار</h2>
          <label for="popup">x</label>
        </div>
        <p class="popup__text">
          این بازی به افزایش <b>توجه انتخابی</b> شما کمک می‌کند. افزایش
          <b>توجه انتخابی</b> به شما کمک می‌کند تا زودتر از بین اشیاء مختلف و
          شبیه به هم، مواردی که خصوصیات مد نظر شما را دارند، پیدا کنید.
        </p>
        <div class="popup__bottom">
          <button class="popup__play">شروع مجدد</button>
          <button class="popup__how">بازی چطوریه</button>
        </div>
      </div>`);

  timer.start(5);
});

setTimeout(() => {
  document.querySelector('#popup').checked = true;
}, 8000);
