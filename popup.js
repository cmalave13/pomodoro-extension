// functionality for the timer

const timer = {
    pomodoro: 1,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
  };
  
  let interval;
  
  const mainButton = document.getElementById('js-btn');
  
  mainButton.addEventListener('click', () => { // MAIN BUTTON FOR STARTING/STOPPING
    const { action } = mainButton.dataset;
    if (action === 'start') {
      startTimer(); // STARTS
    } else {
      stopTimer(); // ENDS
    }
  });
  
  const modeButtons = document.querySelector('#js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);
  
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }
  
  // <---------START TIMER---------->
  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
    if(timer.mode === 'pomodoro') timer.sessions++; // increment sessions every time pomodoro starts
  
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
  
        switch(timer.mode) { // <-------- switch case to handle timer mode changes, 
          case 'pomodoro': 
            if(timer.sessions % timer.longBreakInterval === 0){
            switchMode('longBreak');
           } else {
              switchMode('shortBreak');
            }
            break;
          default: switchMode('pomodoro');
        }
        startTimer();
      }
    }, 1000);
  }
  
  // <---------STOP TIMER---------->
  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }
  
  // <---------UPDATE CLOCK---------->
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
  
    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`; // updates the title to fillow the timer
  
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total; 
    //Each time updateClock() is invoked, the value attribute of the <progress> element is updated to the result of the remaining amount of seconds subtracted from the total number of seconds in the session and this causes the progress bar to update accordingly.
  }
  
  // <---------SWITCH MODE (POMODORO, SHORT BREAK, LONG BREAK--------->
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document
    .getElementById('js-progress')
    .setAttribute('max', timer.remainingTime.total); // adjusts progress bar
  
  
    updateClock();
  }
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    switchMode(mode); // when changing modes
    stopTimer(); // ensures this automatically stops the timer
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
  });

//   function shortImg(){
//     document.querySelector('#shortb').classList.toggle('hidden');
//   }

//   function toggleImage2(){
//     document.querySelector('#longb').classList.toggle('hidden');
//   }