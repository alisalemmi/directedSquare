const DOM = {
  path: document.getElementById('timer-path-remaining'),
  label: document.getElementById('timer-label')
};

export const updateNumber = number => {
  DOM.label.innerHTML = number;
};

export const setRemainingPathColor = timeRemainPercent => {
  if (timeRemainPercent <= 0.2) DOM.path.classList.replace('warn', 'alert');
  else if (timeRemainPercent <= 0.4)
    DOM.path.classList.replace('remain', 'warn');
  else {
    DOM.path.classList.remove('warn', 'alert');
    DOM.path.classList.add('remain');
  }
};

export const setCircleDasharray = circleDasharray => {
  DOM.path.setAttribute(
    'stroke-dasharray',
    `${circleDasharray.toFixed(0)} 283`
  );
};
