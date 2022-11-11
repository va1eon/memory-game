(() => {

  // create element
  const createDomElement = (tagName, className) => {
    const element = document.createElement(tagName);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }

  // create game board
  const createGameArea = (area, items, count) => {
    for (let i = 0; i < count; i++) {
      items[i] = createDomElement('div', 'card');
      items[i].append(
        createDomElement('div', 'card-front'),
        createDomElement('div', 'card-back')
      );
      area.append(items[i]);
    }
    return area;
  }

  // create start Form
  const createStartForm = (title) => {
    const form = createDomElement('form', 'form');
    const gameTitle = createDomElement('h1', 'game-title');
    const inputs = [];
    const startBtn = createDomElement('button', 'start-btn');

    gameTitle.innerText = title;

    for (let i = 0; i < 2; i++) {
      inputs[i] = createDomElement('input', 'input');
      inputs[i].type = 'number'
    }

    inputs[0].name = 'verticalInput';
    inputs[1].name = 'horizontalInput';

    form.append(gameTitle, inputs[0], inputs[1], startBtn);


    form.verticalInput.placeholder = 'Введите кол-во карточек по вертикали'
    form.horizontalInput.placeholder = 'Введите кол-во карточек по горизонтали'

    startBtn.innerText = 'Начать игру';

    return {
      form,
      inputs,
      startBtn,
    }
  }

  const app = document.getElementById('root');
  let cardsCount = 0;
  let cardsVertical = 0;
  let cardsHorizontal = 0;
  let cardsNumber = 0;

  let flippedFlag = false;
  let firstCard = null;
  let secondCard = null;
  let index = 0;
  let blockClick = false;
  let countOpenPairs = 0;

  // flip the card
  function flipped() {
    if (blockClick) return;

    if (this === firstCard) return;

    this.classList.add('active');

    if (!flippedFlag) {
      flippedFlag = true;
      firstCard = this;
    } else {
      flippedFlag = false;
      secondCard = this;
      checkMatch4Cards();
    }
  }

  // reset variables
  const reset = () => {
    blockClick = false;
    flippedFlag = false;
    firstCard = null;
    secondCard = null;
  }

  // check cards for a match
  const checkMatch4Cards = () => {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      disabledOnclick();
      app.dataset.openPairs = ++countOpenPairs;

      // assigning the value of matching cards
      setTimeout(callEndGame, 1000, Number(app.dataset.openPairs))
    } else {
      unFlipped();
    }
  }

  // disable open cards
  const disabledOnclick = () => {
    firstCard.removeEventListener('click', flipped);
    secondCard.removeEventListener('click', flipped);
    setTimeout(() => {
      firstCard.classList.add('opened');
      secondCard.classList.add('opened');
    }, 200);
  }

  // un flip if cards not equal
  const unFlipped = () => {
    blockClick = true;
    setTimeout(() => {
      firstCard.classList.remove('active');
      secondCard.classList.remove('active');
      reset();
    }, 800);
  }

  // timer
  const myTimer = (time, count) => {
    let timeMinute = 60;
    let timer = setInterval(function () {
      let seconds = timeMinute % 60
      let minutes = timeMinute / 60 % 60
      let sec = `${seconds}`;
      if (seconds < 10) {
        sec = `0${seconds}`;
      }
      if (timeMinute === 0) {
        callEndGame(count);
        clearInterval(timer);
      } else {
        time.innerHTML = `${Math.trunc(minutes)}:${sec}`;
      }
      if (app.dataset.openPairs === `${count}`) {
        clearInterval(timer);
      }
      --timeMinute;
    }, 1000)
    app.append(time);
  }

  // start game
  const startGame = () => {

    const timerShow = createDomElement('div', 'timer');

    // add form
    const startForm = createStartForm('Игра в пары');

    // add screens
    const screen = [];
    for (let i = 0; i < 2; i++) {
      screen[i] = createDomElement('div', 'screen');
      document.body.append(screen[i])
    }

    screen[0].append(startForm.form)
    screen[1].append(app);

    //create cards wrapper;
    const wrapper = createDomElement('div', 'cards-wrapper');
    const cards = [];

    // submit form
    startForm.form.addEventListener('submit', e => {
      e.preventDefault();

      if (startForm.form.verticalInput.value % 2 === 0 && startForm.form.verticalInput.value <= 10) {
        cardsVertical = startForm.form.verticalInput.value
      } else {
        cardsVertical = startForm.form.verticalInput.value = 4;
      }

      if (startForm.form.horizontalInput.value % 2 === 0 && startForm.form.horizontalInput.value <= 10) {
        cardsHorizontal = startForm.form.horizontalInput.value
      } else {
        cardsHorizontal = startForm.form.horizontalInput.value = 4;
      }

      if (!startForm.form.verticalInput.value) {
        cardsVertical = 4
      }

      if (!startForm.form.horizontalInput.value) {
        cardsHorizontal = 4
      }

      // calculate cards count
      cardsCount = cardsVertical * cardsHorizontal;

      // calculate max value cards
      cardsNumber = cardsCount / 2;

      // screen up
      screen[0].classList.add('up');

      // add style for calculate in css
      wrapper.setAttribute('style', `--vertical: ${cardsVertical}; --horizontal: ${cardsHorizontal}`)

      // add game board
      const gameArea = createGameArea(wrapper, cards, cardsCount)
      app.append(gameArea);

      for (const card of cards) {
        if (cardsCount === 100) {
          card.style.fontSize = '30px'
        }
        // get backface card
        const cardBack = card.querySelector('.card-back');
        // get front face card
        const cardsFront = card.querySelector('.card-front')
        // set value in the cards
        if (index === cardsNumber) {
          index = 0;
        }
        card.dataset.value = `${++index}`;
        cardsFront.innerHTML = card.dataset.value;
        // --------------------

        // set icon in the backface
        cardBack.innerHTML = `
          <svg width="150px" height="150px" viewBox="0 0 150 150" id="ART" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:#edb340;stroke-miterlimit:40;stroke-width:4px;}.cls-1,.cls-3,.cls-4,.cls-7{stroke:#000;}.cls-2{fill:#d3d3d3;}.cls-3{fill:#ffe7bd;}.cls-3,.cls-7{stroke-miterlimit:10;}.cls-3,.cls-4,.cls-7{stroke-width:2px;}.cls-4,.cls-5{fill:#020100;}.cls-4{stroke-linecap:round;stroke-linejoin:round;}.cls-6{fill:#c45e35;}.cls-7{fill:#dd8e2f;}.cls-8{fill:#d6512d;}</style></defs><title/><path class="cls-1" d="M137.43,81.5s5.31,23.07,1.13,32.59l-3.32-4.9s-7.79,18.89-18.75,19.18l-.29-3.46a82.89,82.89,0,0,1-82.4,0l-.29,3.46c-11-.29-18.75-19.18-18.75-19.18l-3.31,4.9c-4.18-9.52,1.13-32.59,1.13-32.59s.31-1.16-4.74,0A97.52,97.52,0,0,1,21.67,47.29C17,36.83,14,17.29,16.5,14.77c2.28-2.29,24.29,2,32.92,5.55,7.17-4,13.65-6.2,21-6.2.87,0,3.81,3.57,4.63,3.57s3.76-3.57,4.63-3.57c7.3,0,13.78,2.22,21,6.2,8.64-3.57,30.62-7.84,32.91-5.55,2.54,2.53-.48,22.06-5.16,32.52A97.51,97.51,0,0,1,142.17,81.5C137.12,80.34,137.43,81.5,137.43,81.5Z" data-name="&lt;Path&gt;" id="_Path_"/><path class="cls-2" d="M138.7,79c.27,0,.58,0,.9,0-.21-.94-.44-1.87-.69-2.8-.1-.41-.21-.81-.32-1.22-.18-.67-.37-1.33-.57-2s-.41-1.33-.62-2c-.16-.5-.33-1-.5-1.5s-.4-1.16-.61-1.74l-.07-.19c-.18-.51-.38-1-.57-1.52-.06-.15-.11-.29-.17-.43-.21-.55-.43-1.09-.65-1.63l0-.07c-.73.33-1.67.71-2.89,1.15-4.09,1.48,1.06,11.67-3.47,26.43l-.3.94a17.57,17.57,0,0,1-1.49,3.36,14.52,14.52,0,0,1-6,5.74,16,16,0,0,1-2.12.92c-4.35,1.57-9.35,1.53-13.66,1.07C100.39,91.69,88.71,77.19,75,77.19h0c-13.72,0-25.4,14.5-29.87,26.36-4.31.46-9.3.5-13.66-1.07a16,16,0,0,1-2.12-.92,14.65,14.65,0,0,1-6-5.74,18.22,18.22,0,0,1-1.49-3.36l-.3-.93h0c-4.53-14.76.62-25-3.47-26.43-1.22-.44-2.16-.82-2.89-1.15-.44,1.08-.87,2.16-1.27,3.25-.18.48-.35,1-.52,1.45s-.3.86-.44,1.29-.34,1-.49,1.48-.4,1.26-.58,1.89-.37,1.27-.54,1.9c-.35,1.27-.67,2.55-1,3.83.33,0,.63,0,.91,0a3.45,3.45,0,0,1,2.8,1.09A2.22,2.22,0,0,1,14.53,82s-.06.24-.14.63c0,.2-.09.44-.15.71l-.06.29a1.29,1.29,0,0,1,0,.19c-.14.69-.3,1.55-.49,2.54S13.25,88.63,13,90q-.11.7-.21,1.44a2.34,2.34,0,0,0,0,.26c-.07.48-.13,1-.19,1.46s-.11.86-.16,1.3-.09.76-.13,1.15a56.64,56.64,0,0,0-.1,13.81l0,0,.87-1.28L15.19,105l1.42,3.44.19.45c.13.31.28.64.44,1l.29.6c.35.73.76,1.52,1.22,2.36a.47.47,0,0,0,0,.1s0,0,0,0l.31.53c.24.44.51.89.79,1.34.4.68.84,1.36,1.31,2.05.15.23.3.46.47.68l.87,1.2a29.66,29.66,0,0,0,3.69,4.1l.42.37c.18.15.35.3.54.44s.25.21.38.3a5.58,5.58,0,0,0,.49.36,11.75,11.75,0,0,0,1.19.75l.46.25.64.31h0a6.59,6.59,0,0,0,.62.24q.33.12.66.21l.11-1.35.27-3.33,2.81,1.82S36,124,38,125l.48.25.6.3c.15.06.3.14.45.21h0c.92.44,2,.92,3.12,1.42l.25.11,1,.39,1.27.51,1.18.45c1,.36,2,.72,3.08,1.08l2.09.66,1.09.32c.74.21,1.49.41,2.27.61l1.17.29c.79.19,1.6.37,2.43.55l1.25.25c.42.09.84.17,1.27.24l1.3.22.88.14,1.08.15c.69.1,1.38.18,2.09.26l1.13.11.49.05,1,.08q2,.16,4,.21c.67,0,1.35,0,2,0s1.36,0,2,0a78.82,78.82,0,0,0,8.38-.66l1.67-.24c1.38-.21,2.72-.45,4-.72l1.68-.36,1.84-.44c1.14-.28,2.24-.58,3.3-.89,2-.59,3.88-1.22,5.58-1.85l1.55-.59.23-.09.84-.34q1.23-.51,2.31-1l.08,0,1.92-.9h0a50.84,50.84,0,0,0,4.68-2.51l2.79-1.81.28,3.32h0l.11,1.35q.33-.09.66-.21a6.58,6.58,0,0,0,.62-.24h0l.58-.28.4-.21.43-.25.54-.34.39-.27.47-.35c.25-.18.49-.38.73-.58l.54-.47,0,0,.56-.53c.37-.36.74-.73,1.09-1.12A35.22,35.22,0,0,0,128,118c.22-.3.43-.61.64-.92,1-1.41,1.83-2.83,2.56-4.16.62-1.13,1.15-2.18,1.58-3.09l.42-.95.19-.45,1.42-3.44,2.09,3.08.9,1.32c1.61-10.17-2.27-27.24-2.3-27.38a2.24,2.24,0,0,1,.4-1.94A3.45,3.45,0,0,1,138.7,79Z"/><path d="M26.25,122.86a40.11,40.11,0,0,1-7.44-9.9s0,0,0,0a50.39,50.39,0,0,1,2.76-21.41h0c1.92-5.19,4.61-9.38,7.64-11.64a36.53,36.53,0,0,0-5.85,15.94A59.14,59.14,0,0,0,26.25,122.86Z"/><path d="M31.47,102.48a53.76,53.76,0,0,0,8.09,23.27,51.34,51.34,0,0,1-4.67-2.51l-1.67.82a49,49,0,0,1-3.87-22.5,22.24,22.24,0,0,1,2.93-10.09A33.06,33.06,0,0,0,31.47,102.48Z"/><path d="M131.2,112.93a39.63,39.63,0,0,1-7.45,9.93,59.14,59.14,0,0,0,2.9-27,36.53,36.53,0,0,0-5.85-15.94c3,2.26,5.72,6.45,7.64,11.64A50.39,50.39,0,0,1,131.2,112.93Z"/><path d="M116.79,124.06l-1.67-.82a50.84,50.84,0,0,1-4.68,2.51,53.76,53.76,0,0,0,8.09-23.27,33.06,33.06,0,0,0-.81-11,22.24,22.24,0,0,1,2.93,10.09A49.11,49.11,0,0,1,116.79,124.06Z"/><path class="cls-3" d="M98.61,63.18c7.24-4.61,15-6.6,15.58-4.65S111.38,73.62,105.64,75,84,72.49,98.61,63.18Z"/><circle cx="101.4" cy="65.9" r="3.87"/><path class="cls-3" d="M51.39,63.18c-7.24-4.61-15-6.6-15.58-4.65S38.62,73.62,44.36,75,66,72.49,51.39,63.18Z"/><circle cx="48.6" cy="65.9" r="3.87"/><line class="cls-4" x1="75" x2="75" y1="116.7" y2="108.52"/><path class="cls-4" d="M93.63,124.54C86.81,134.6,75,125.79,75,125.79s-11.82,8.81-18.63-1.25c5.21.88,18.63-2.21,18.63-11.19C75,122.33,88.42,125.42,93.63,124.54Z"/><path class="cls-5" d="M103.43,39.73c-7-4.62-17.13-7.54-28.43-7.54S53.54,35.1,46.57,39.73C51.63,32.14,62.45,26.89,75,26.89S98.37,32.14,103.43,39.73Z"/><path class="cls-5" d="M94.28,49.37C89.56,46.23,82.66,44.25,75,44.25s-14.55,2-19.28,5.11c3.43-5.15,10.77-8.7,19.28-8.7S90.85,44.22,94.28,49.37Z"/><path class="cls-6" d="M106.25,24.39c8.71-3.25,21-4.91,22.49-4.79.13,1.75-1.87,15.92-4.46,21.87C118.45,33.83,106.25,24.39,106.25,24.39Z"/><path class="cls-6" d="M43.75,24.39c-8.71-3.25-21-4.91-22.49-4.79-.12,1.75,1.87,15.92,4.46,21.87C31.55,33.83,43.75,24.39,43.75,24.39Z"/><path class="cls-7" d="M91.67,89.1c0,15.67-16.67,17.17-16.67,19.67,0-2.5-16.67-4-16.67-19.67,0-9.48,4.64-21,9.18-28.67,3-5,3.54-5.44,7.49-5.44s4.53.46,7.51,5.48C87.05,68.12,91.67,79.64,91.67,89.1Z" data-name="&lt;Path&gt;" id="_Path_2"/><path class="cls-8" d="M87.34,99.09c-2.76,3.4-6.66,5.22-9.46,6.52A19.18,19.18,0,0,0,75,107.13a19.18,19.18,0,0,0-2.88-1.52c-2.8-1.3-6.7-3.12-9.46-6.52a28.41,28.41,0,0,1,24.68,0Z"/></svg>
        `;

        // click on the card
        card.addEventListener('click', flipped);

        // shuffle cards
        const shuffleNum = Math.floor(Math.random() * cards.length);
        card.style.order = `${shuffleNum}`;
      }

      myTimer(timerShow, cardsNumber);
    });
  }

  // end game
  const endGame = (count) => {
    if (count === cardsNumber) {
      const restartBtn = createDomElement('button', 'restart-btn');
      restartBtn.classList.add('hidden');
      restartBtn.innerText = 'Сыграть ещё раз?'
      app.classList.add('end-game')
      app.append(restartBtn);
      return restartBtn;
    }
  }

  //
  const callEndGame = (count) => {
    const restartBtn = endGame(count);

    // if all cards open and match
    if (restartBtn) {
      setTimeout(() => {
        restartBtn.classList.remove('hidden');
      }, 500)

      // click on the restart button
      restartBtn.addEventListener('click', () => {
        restartGame(
          restartBtn,
          app.querySelector('.cards-wrapper'),
          document.querySelectorAll('.screen'),
          document.querySelector('.form'));
      });
    }
  }

  // restart game
  const restartGame = (btn, wrapper, screens, form) => {
    app.classList.remove('end-game');
    app.innerHTML = '';
    form.remove();
    btn.remove();
    wrapper.remove();
    for (screen of screens) {
      screen.remove();
    }
    countOpenPairs = 0;
    app.removeAttribute('data-open-pairs');
    startGame();
  }

  document.addEventListener('DOMContentLoaded', () => {
    startGame();
  });

})()
