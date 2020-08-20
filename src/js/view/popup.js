import * as Timer from './timer';
import { default as config } from '../../config.json';

const DOM = {
  checkMenu: document.querySelector('#check__menu'),
  checkScore: document.querySelector('#check__score'),
  checkHow: document.querySelector('#check__how'),
  checkRank: document.querySelector('#check__rank'),
  backdrop: document.querySelectorAll('.popup__backdrop'),
  rankTable: document.querySelector('.popup__rank__table'),
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
    wrong: document.querySelector('.popup__score__wrong__number')
  },
  container: document.querySelector('.container'),
  popupStart: document.querySelector('.popup--start'),
  restartTimer: document.querySelector('.timer-restart')
};

/**
 * do something after closeing popup. so user doesn't see what happen
 * @param {Function} func
 */
const onClose = func => {
  setTimeout(() => {
    func();
  }, config.popupCloseDuration);
};

/**
 * go to home page at each popup.
 */
const goToHome = () => {
  DOM.checkHow.checked = false;
  DOM.checkRank.checked = false;
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
 * visible popups' close buttons
 */
const enableClose = () => {
  DOM.close.forEach(el => {
    el.style.visibility = 'visible';
    el.addEventListener('click', () => onClose(goToHome));
  });
};

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

export const helpHandler = isFinish => {
  document.querySelector('.help').addEventListener('click', () => {
    DOM.checkMenu.checked = !isFinish();
    DOM.checkScore.checked = isFinish();
  });
};

/**
 * show popup score
 * @param {{score: number, correct: number, wrong: number, maxScore: number, rankScore: number}} score
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

  const max = Math.max(config.rankScore * 1.2, config.minRankScore);
  // score
  Timer.animate(DOM.score.score, score.score, max);

  // max score
  Timer.animate(DOM.score.max, config.maxScore, max);

  // rank
  Timer.animate(DOM.score.rank, config.rankScore, max);

  //correct
  DOM.score.correct.innerHTML = score.correct;

  // wrong
  DOM.score.wrong.innerHTML = score.wrong;

  // ranking
  DOM.rankTable.innerHTML =
    '<li class="popup__rank__table__header"><span class="popup__rank__table__rank">رتبه</span><span class="popup__rank__table__name">نام</span><span class="popup__rank__table__score">امتیاز</span></li>';

  for (const t of config.tops) {
    DOM.rankTable.innerHTML += `<li>
              <span class="popup__rank__table__rank">${t.rank}</span>
              <span class="popup__rank__table__name">${t.name}</span>
              <span class="popup__rank__table__score">${t.score}</span>
            </li>`;
  }

  let find = false;
  for (const t of config.tops) {
    if (
      t.rank == config.myRank &&
      t.name == config.name &&
      t.score == config.maxScore
    ) {
      find = true;
      break;
    }
  }

  if (!find) {
    DOM.rankTable.innerHTML += `<li>
              <span class="popup__rank__table__rank">&vellip;</span>
              <span class="popup__rank__table__name" style="margin-right: 4rem;">&vellip;</span>
              <span class="popup__rank__table__score">&vellip;</span>
            </li>
            <li>
              <span class="popup__rank__table__rank">${config.myRank}</span>
              <span class="popup__rank__table__name">${config.name}</span>
              <span class="popup__rank__table__score">${config.maxScore}</span>
            </li>`;
  }

  DOM.checkMenu.checked = false;
  DOM.checkScore.checked = true;
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
