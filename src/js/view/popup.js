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
  }
};

const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = `${time % 60}`.padStart(2, '0');

  return `${minutes}:${seconds}`;
};

const setCircleDashArray = (el, remain, total) => {
  el.setAttribute(
    'stroke-dasharray',
    `${(((remain - 1 + remain / total) / total) * 283).toFixed(0)} 283`
  );
};

const setRemainingPathColor = (el, timeRemainPercent) => {
  if (timeRemainPercent <= 0.2) {
    el.classList.remove('warn', 'remain');
    el.classList.add('alert');
  } else if (timeRemainPercent <= 0.4) {
    el.classList.remove('remain', 'alert');
    el.classList.add('warn');
  } else {
    el.classList.remove('warn', 'alert');
    el.classList.add('remain');
  }
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
        document.querySelector('.container').style.opacity = 1;
      });
    });
  });
};

/**
 * show popup menu
 */
export const showMenu = () => {
  DOM.checkMenu.checked = true;
};

/**
 * show popup score
 * @param {Boolean} isTimeUp
 * @param {{score: Number, max: Number, correct: Number, wrong: Number}} score
 * @param {{total: Number, time: Number}} time
 */
export const showScore = (isTimeUp, score, time) => {
  DOM.score.title.innerHTML = isTimeUp
    ? 'زمان شما به پایان رسید'
    : 'تبریک، شما تمامی مربع ها را پیدا کردید';

  DOM.score.icon.innerHTML = isTimeUp
    ? '<use xlink:href="./img/sprite.svg#alarm-clock" />'
    : '<use xlink:href="./img/sprite.svg#check" />';

  DOM.score.score.label.innerHTML = score.score;
  setCircleDashArray(DOM.score.score.ring, Math.abs(score.score), 100);
  setRemainingPathColor(DOM.score.score.ring, score.score / 100);
  if (score.score) {
    DOM.score.score.svg.style.transform = `scaleX(${Math.sign(-score.score)})`;
    DOM.score.score.ring.style.visibility = 'visible';
  } else DOM.score.score.ring.style.visibility = 'hidden';

  DOM.score.max.label.innerHTML = score.max;
  setCircleDashArray(DOM.score.max.ring, Math.abs(score.max), 100);
  setRemainingPathColor(DOM.score.max.ring, score.max / 100);
  if (score.max) {
    DOM.score.max.svg.style.transform = `scaleX(${Math.sign(-score.max)})`;
    DOM.score.max.ring.style.visibility = 'visible';
  } else DOM.score.max.ring.style.visibility = 'hidden';

  DOM.score.time.label.innerHTML = formatTime(time.time);
  setCircleDashArray(DOM.score.time.ring, time.time, time.total);
  setRemainingPathColor(DOM.score.time.ring, time.time / time.total);

  DOM.score.correct.innerHTML = score.correct;
  DOM.score.wrong.innerHTML = score.wrong;

  DOM.checkMenu.checked = false;
  DOM.checkScore.checked = true;
};
