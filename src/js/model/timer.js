let timerInterval = null;
let remain = 0;

const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = `${time % 60}`.padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const stop = () => {
  clearInterval(timerInterval);
};

export const start = total => {
  remain = total;

  const tick = new CustomEvent('tick', {
    detail: {
      label: formatTime(remain),
      circleDasharray: 283,
      remainingPathColor: 1
    }
  });

  document.dispatchEvent(tick);

  if (timerInterval) stop();

  timerInterval = setInterval(() => {
    remain--;

    tick.detail.label = formatTime(remain);
    tick.detail.circleDasharray = ((remain - 1 + remain / total) / total) * 283;
    tick.detail.remainingPathColor = remain / total;

    document.dispatchEvent(tick);

    if (remain === 0) {
      stop();
      document.dispatchEvent(new Event('timeUp'));
    }
  }, 1000);
};

export const getTime = () => remain;
