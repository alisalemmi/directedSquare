import { default as config } from '../../config.json';

const DOM = {
  ring: document.querySelector('.scoreboard .timer__path-remaining'),
  label: document.querySelector('.scoreboard .timer__label'),
  svg: document.querySelector('.scoreboard .timer__svg')
};

const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = `${time % 60}`.padStart(2, '0');

  return `${minutes}:${seconds}`;
};

const resetCircleDashArray = el => {
  el.ring.style.transitionDelay = '0s';
  el.ring.style.transitionDuration = '0s';
  el.ring.setAttribute('stroke-dasharray', '0 283');
};

const setCircleDashArray = (el, remain, total, fullOnZero) => {
  const absRemain = Math.abs(remain);
  el.ring.setAttribute(
    'stroke-dasharray',
    `${(((absRemain - 1 + absRemain / total) / total) * 283).toFixed(0)} 283`
  );

  if (remain) {
    el.svg.style.transform = `scaleX(${Math.sign(-remain)})`;
    el.ring.style.visibility = 'visible';
  } else if (!fullOnZero) el.ring.style.visibility = 'hidden';
};

const setRemainingPathColor = (el, timeRemainPercent) => {
  if (timeRemainPercent <= 0.2) {
    el.ring.classList.remove('timer__color__warn', 'timer__color__remain');
    el.ring.classList.add('timer__color__alert');
  } else if (timeRemainPercent <= 0.4) {
    el.ring.classList.remove('timer__color__remain', 'timer__color__alert');
    el.ring.classList.add('timer__color__warn');
  } else {
    el.ring.classList.remove('timer__color__warn', 'timer__color__alert');
    el.ring.classList.add('timer__color__remain');
  }
};

export const animate = (el, remain, total, fullOnZero) => {
  // reset
  resetCircleDashArray(el);

  el.label.innerHTML = remain;
  setRemainingPathColor(el, remain / total);

  // animate to score
  setTimeout(() => {
    el.ring.style.transitionDelay = `${config.popupCloseDuration}ms`;
    el.ring.style.transitionDuration = '0.5s';
    setCircleDashArray(el, remain, total, fullOnZero);
  }, 10);
};

export const update = (remain, total) => {
  DOM.label.innerHTML = formatTime(remain);
  setCircleDashArray(DOM, remain, total, true);
  setRemainingPathColor(DOM, remain / total);
};
