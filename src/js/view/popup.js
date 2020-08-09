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
  buttonHelp: document.querySelector('.popup__help'),
  score: {
    icon: document.querySelector('#popup__score .popup__icon'),
    title: document.querySelector('#popup__score .popup__title'),
    score: {
      label: document.querySelector('.popup__score__score .timer__label'),
      svg: document.querySelector('.popup__score__score .timer__svg'),
      ring: document.querySelector(
        '.popup__score__score .timer__path-remaining'
      )
    },
    max: {
      label: document.querySelector('.popup__score__max .timer__label'),
      svg: document.querySelector('.popup__score__max .timer__svg'),
      ring: document.querySelector('.popup__score__max .timer__path-remaining')
    },
    rank: {
      label: document.querySelector('.popup__score__rank .timer__label'),
      svg: document.querySelector('.popup__score__rank .timer__svg'),
      ring: document.querySelector('.popup__score__rank .timer__path-remaining')
    },
    correct: document.querySelector('.popup__score__correct__number'),
    wrong: document.querySelector('.popup__score__wrong__number'),
    time: document.querySelector('.popup__score__time__number')
  },
  total: document.querySelector('.scoreboard__total__number'),
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
const onClose = func => {
  setTimeout(() => {
    func();
  }, 500);
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

DOM.buttonHelp.addEventListener('click', () => (DOM.checkMenu.checked = false));

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

const animateScore = (el, score, max) => {
  // reset
  el.ring.style.transitionDelay = '0s';
  el.ring.style.transitionDuration = '0s';
  Timer.setCircleDashArray(el.ring, 9, max);

  // animate to score
  el.label.innerHTML = score;
  Timer.setRemainingPathColor(el.ring, score / max);

  setTimeout(() => {
    el.ring.style.transitionDelay = '0.5s';
    el.ring.style.transitionDuration = '0.5s';

    Timer.setCircleDashArray(el.ring, Math.abs(score), max);
  }, 10);

  if (score) {
    el.svg.style.transform = `scaleX(${Math.sign(-score)})`;
    el.ring.style.visibility = 'visible';
  } else el.ring.style.visibility = 'hidden';
};

const increment = a => {
  let i = 0;
  let duration;
  if (a < 50) duration = 10;
  else if (a < 100) duration = 5;
  else if (a < 300) duration = 2;
  else if (a < 500) duration = 1;
  else if (a < 1000) duration = 0.5;
  else duration = 0.1;

  setTimeout(() => {
    DOM.total.innerHTML = 0;
  }, 500);

  setTimeout(() => {
    DOM.score.score.ring.style.transitionDelay = '0s';
    DOM.score.score.ring.style.transitionDuration = `${a * duration}ms`;
    Timer.setCircleDashArray(DOM.score.score.ring, Math.abs(a), 2000);

    const incTimer = setInterval(() => {
      DOM.score.score.label.innerHTML = i;

      if (i == a) clearInterval(incTimer);
      i++;
    }, duration);
  }, 2500);
};

/**
 * show popup score
 * @param {Boolean} isTimeUp
 * @param {{score: Number, timeScore:Number, max: Number, correct: Number, wrong: Number}} score
 * @param {{total: Number, time: Number}} time
 */
export const showScore = score => {
  // title
  if (score.wrong < score.correct / 2) {
    DOM.score.title.innerHTML = 'کارِت خوب بود';
    DOM.score.icon.innerHTML = '<use xlink:href="./img/sprite.svg#check" />';
  } else {
    DOM.score.title.innerHTML = 'بیشتر تلاش کن';
    DOM.score.icon.innerHTML = '<use xlink:href="./img/sprite.svg#close" />';
  }

  animateScore(DOM.score.score, score.score, 2000);
  // increment(score.score);

  // max score
  animateScore(DOM.score.max, score.max, 2000);

  // rank
  animateScore(DOM.score.rank, score.max, 2000);

  //correct & wrong & remain time
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
