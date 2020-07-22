import * as Timer from './timer';

const DOM = {
  checkMenu: document.querySelector('#check__menu'),
  checkScore: document.querySelector('#check__score'),
  checkHow: document.querySelector('#check__how'),
  checkRank: document.querySelector('#check__rank'),
  backdrop: document.querySelectorAll('.popup__backdrop'),
  close: document.querySelectorAll('.popup__close'),
  buttonsPlay: {
    label: document.querySelectorAll('.popup__play > .button__label'),
    icon: document.querySelectorAll('.popup__play > .button__icon'),
    buttons: document.querySelectorAll('.popup__play')
  },
  score: {
    icon: document.querySelector('#popup__score .popup__icon'),
    title: document.querySelector('#popup__score .popup__title'),
    score: {
      label: document.querySelector('.popup__score__score .timer__label'),
      svg: document.querySelector('.popup__score__score .timer__svg'),
      ring: document.querySelector('.popup__score__score #timer-path-remaining')
    },
    max: {
      label: document.querySelector('.popup__score__max .timer__label'),
      svg: document.querySelector('.popup__score__max .timer__svg'),
      ring: document.querySelector('.popup__score__max #timer-path-remaining')
    },
    time: {
      label: document.querySelector('.popup__score__time .timer__label'),
      ring: document.querySelector('.popup__score__time #timer-path-remaining')
    },
    correct: document.querySelector(
      '.popup__score__correct > .correct__number'
    ),
    wrong: document.querySelector('.popup__score__wrong > .wrong__number')
  },
  total: document.querySelector('.total__number'),
  container: document.querySelector('.container'),
  popupStart: document.querySelector('.popup--start'),
  restartTimer: document.querySelector('.timer-restart')
};

/**
 * when start, change start to restart
 */
const turnPlayToReset = () => {
  DOM.buttonsPlay.label.forEach(el => (el.innerHTML = 'شروع مجدد'));
  DOM.buttonsPlay.icon.forEach(
    el => (el.innerHTML = '<use xlink:href="./img/sprite.svg#refresh" />')
  );
};

/**
 * do something after closeing popup. so user doesn't see what happen
 * @param {Function} func
 */
const onClose = (func, timeout = 500) => {
  setTimeout(() => {
    func();
  }, timeout);
};

/**
 * go to home page at each popup.
 */
const goToHome = () => {
  DOM.checkHow.checked = false;
  DOM.checkRank.checked = false;
};

/**
 * visible popups' close buttons
 */
const enableClose = () => {
  DOM.close.forEach(el => {
    el.style.visibility = 'visible';
  });
};

// handle click for popups' close buttons
DOM.close.forEach(el => {
  el.addEventListener('click', () => onClose(goToHome));
});

/**
 * close popup when clicked on backdrop
 */
const backdropHandler = () => {
  DOM.backdrop.forEach(el =>
    el.addEventListener('click', function (e) {
      if (e.target === this) {
        DOM.checkMenu.checked = false;
        DOM.checkScore.checked = false;
        onClose(goToHome);
      }
    })
  );
};

/**
 * handler for play buttons
 * @param {Function} func
 */
export const playButtonHandler = func => {
  DOM.buttonsPlay.buttons.forEach(el => {
    el.addEventListener('click', () => {
      func();

      onClose(() => {
        goToHome();
        turnPlayToReset();
        enableClose();
        backdropHandler();
      });
    });
  });
};

/**
 * show popup menu
 */
export const showMenu = () => {
  DOM.checkMenu.checked = true;
  DOM.checkScore.checked = false;
};

const increment = (a, b) => {
  if (a == b) return;

  let i = a;
  let dir = a > b ? -1 : 1;
  DOM.score.score.label.innerHTML = i;

  onClose(() => {
    DOM.total.innerHTML = b;

    const incTimer = setInterval(() => {
      DOM.score.score.label.innerHTML = i;

      if (i == b) clearInterval(incTimer);
      i += dir;
    }, 10);
  }, 2500);
};

/**
 * show popup score
 * @param {Boolean} isTimeUp
 * @param {{score: Number, timeScore:Number, max: Number, correct: Number, wrong: Number}} score
 * @param {{total: Number, time: Number}} time
 */
export const showScore = (isTimeUp, score, time) => {
  // title
  if (isTimeUp) {
    DOM.score.title.innerHTML = 'زمان تموم شد';
    DOM.score.icon.innerHTML =
      '<use xlink:href="./img/sprite.svg#alarm-clock" />';
  } else if (score.wrong < 7) {
    DOM.score.title.innerHTML = 'کارِت خوب بود';
    DOM.score.icon.innerHTML = '<use xlink:href="./img/sprite.svg#check" />';
  } else {
    DOM.score.title.innerHTML = 'بیشتر تلاش کن';
    DOM.score.icon.innerHTML = '<use xlink:href="./img/sprite.svg#close" />';
  }

  // score
  const totalScore =
    score.wrong < 7 ? score.score + score.timeScore : score.score;

  if (score.score <= 0 && totalScore > 0) score.score = 1;

  DOM.score.score.label.innerHTML = score.score;
  increment(score.score, totalScore);

  Timer.setCircleDashArray(DOM.score.score.ring, Math.abs(totalScore), 2000);
  Timer.setRemainingPathColor(DOM.score.score.ring, totalScore / 2000);
  if (score.score) {
    DOM.score.score.svg.style.transform = `scaleX(${Math.sign(-score.score)})`;
    DOM.score.score.ring.style.visibility = 'visible';
  } else DOM.score.score.ring.style.visibility = 'hidden';

  // max score
  DOM.score.max.label.innerHTML = score.max;
  Timer.setCircleDashArray(DOM.score.max.ring, Math.abs(score.max), 2000);
  Timer.setRemainingPathColor(DOM.score.max.ring, score.max / 2000);
  if (score.max) {
    DOM.score.max.svg.style.transform = `scaleX(${Math.sign(-score.max)})`;
    DOM.score.max.ring.style.visibility = 'visible';
  } else DOM.score.max.ring.style.visibility = 'hidden';

  // remain time
  DOM.score.time.label.innerHTML = Timer.formatTime(time.time);
  Timer.setCircleDashArray(DOM.score.time.ring, time.time, time.total);
  Timer.setRemainingPathColor(DOM.score.time.ring, time.time / time.total);

  //correct & wrong
  DOM.score.correct.innerHTML = score.correct;
  DOM.score.wrong.innerHTML = score.wrong;

  DOM.checkMenu.checked = false;
  DOM.checkScore.checked = true;
};

export const helpHandler = isFinish => {
  document.querySelector('.help').addEventListener('click', () => {
    DOM.checkMenu.checked = !isFinish();
    DOM.checkScore.checked = isFinish();
  });
};

export const showRestart = calback => {
  DOM.popupStart.classList.add('popup--start--show');
  DOM.container.style.opacity = 0;

  let t = 4;
  const inter = setInterval(() => {
    if (t == 4) DOM.restartTimer.innerHTML = '3';
    else if (t > 1) DOM.restartTimer.innerHTML = t - 1;
    else if (t == 1) {
      DOM.restartTimer.innerHTML = '';
      DOM.container.style.opacity = 1;
    } else if (t == 0) {
      DOM.popupStart.classList.remove('popup--start--show');
      calback();
      clearInterval(inter);
    }
    t--;
  }, 1000);
};
