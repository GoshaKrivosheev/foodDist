'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabsParent = document.querySelector('.tabheader__items'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabs = tabsParent.querySelectorAll('.tabheader__item');

  function hideTabsContent() {
    tabsContent.forEach((item) => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabsContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabsContent();
  showTabsContent();

  tabsParent.addEventListener('click', (event) => {
    let target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabsContent();
          showTabsContent(i);
        }
      });
    }
  });

  // Modal
  const btn = document.querySelectorAll('[data-btnModal]'),
    modal = document.querySelector('.modal'),
    // modalClose = modal.querySelector('[data-modalClose]'),
    body = document.querySelector('body'),
    openAfterTime = setTimeout(openModal, 15000, modal);

  function openModal(item) {
    item.classList.add('show', 'fade');
    item.classList.remove('hide');

    document.body.style.overflow = 'hidden';
    clearTimeout(openAfterTime);
    window.removeEventListener('scroll', openModalByScroll);
  }

  const hideModal = (item) => {
    item.classList.add('hide');
    item.classList.remove('show', 'fade');

    document.body.style.overflow = '';
  };

  btn.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      openModal(modal);
    });
  });

  // modalClose.addEventListener('click', () => {
  //   hideModal(modal);
  // });

  modal.addEventListener('click', (e) => {
    if ((e.target && e.target === modal) || e.target.getAttribute('data-modalClose') == '') {
      hideModal(modal);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      hideModal(modal);
    }
  });

  function openModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal(modal);
    }
  }

  window.addEventListener('scroll', openModalByScroll);

  // Timer
  const deadline = '2022-05-20';

  function getTimerData(endtime) {
    const t = Date.parse(endtime) - new Date(),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / (1000 * 60)) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num < 10 && num >= 0) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setTimerData(endtime) {
    const days = document.querySelector('#days'),
      hours = document.querySelector('#hours'),
      minutes = document.querySelector('#minutes'),
      seconds = document.querySelector('#seconds'),
      updateClock = setInterval(updateTimer, 1000);
    updateTimer();

    function updateTimer() {
      const t = getTimerData(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(updateClock);
      }
    }
  }
  setTimerData(deadline);

  // Class
  class Menu {
    constructor(src, alt, title, text, price, selector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.text = text;
      this.changeRate = 28;
      this.price = price * this.changeRate;
      this.container = document.querySelector(selector);
    }

    render() {
      const container = document.createElement('div');
      container.classList.add('menu__item');
      container.innerHTML = `
      <img src=${this.src} alt=${this.alt} />
      <h3 class="menu__item-subtitle">${this.title}</h3>
      <div class="menu__item-descr">
        ${this.text}
      </div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
        <div class="menu__item-cost">Цена:</div>
        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
      </div>
      `;
      this.container.append(container);
    }
  }

  new Menu(
    'img/tabs/vegy.jpg',
    'vegy',
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    10,
    '.menu .container'
  ).render();

  new Menu(
    'img/tabs/elite.jpg',
    'elite',
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    20,
    '.menu .container'
  ).render();
  new Menu(
    'img/tabs/post.jpg',
    'post',
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    15,
    '.menu .container'
  ).render();

  //  Отправка FORMS
  const form = document.querySelectorAll('form');

  form.forEach((item) => {
    postForm(item);
  });

  const status = {
    loading: 'img/form/spinner.svg',
    success: 'Успешно. Мы скоро с вами свяжемся',
    failure: 'Что-то пошло не так',
  };

  function postForm(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const message = document.createElement('img');
      message.src = status.loading;
      // form.append(message);
      message.style.cssText = 'display: block; margin: 0 auto;';
      form.insertAdjacentElement('afterend', message);

      // const request = new XMLHttpRequest();
      // request.open('POST', 'server.php');
      const formData = new FormData(form);
      // request.send(formData);

      const obj = {};

      formData.forEach((item, key) => {
        obj[key] = item;
      });

      fetch('server.php', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
        .then((data) => data.text())
        .then((data) => {
          console.log(data);
          modalMessage(status.success);
        })
        .catch(() => {
          modalMessage(status.failure);
        })
        .finally(() => {
          form.reset();
          message.remove();
        });
      //   if (request.status === 200) {
      //     modalMessage(status.success);
      //     form.reset();
      //     message.remove();
      //   } else {
      //     modalMessage(status.failure);
      //     message.remove();
      //   }
      // });
    });
  }

  const firstModal = document.querySelector('.modal'),
    modalDialog = firstModal.querySelector('.modal__dialog');

  function modalMessage(message) {
    // firstModal.classList.add('show');
    openModal(firstModal);
    modalDialog.classList.add('hide');
    const newModal = document.createElement('div');
    newModal.style.cssText = 'display: block; max-width: 500px; margin: 200px auto;';
    newModal.classList.add('fade');
    newModal.innerHTML = `
      <div class="modal__content">
        <div data-modalClose class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;
    firstModal.append(newModal);
    setTimeout(() => {
      newModal.remove();
      modalDialog.classList.remove('hide');
      hideModal(firstModal);
    }, 2500);
  }

  fetch('http://localhost:3000/menu')
    .then((item) => item.json())
    .then((item) => console.log(item));

  // Promise
  // console.log('Подготовка данных...');
  // const req = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     console.log('Обработка данных...');
  //     const buy = {
  //       name: 'car',
  //       price: '999999999999999$',
  //     };
  //     resolve(buy);
  //   }, 2000);
  // });
  // req.then((buy) => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       console.log(buy);
  //       buy.status = 'BOUGHT!';

  //       resolve(buy);
  //     }, 2000);
  //   })
  //     .then((buy) => {
  //       setTimeout(() => {
  //         console.log(buy);
  //       }, 2000);
  //     })
  //     .catch(() => {
  //       console.log('Произошла ошибка');
  //     })
  //     .finally(() => {
  //       setTimeout(() => {
  //         console.log('Successfully ordered');
  //       }, 4000);
  //     });
  // });

  // МЕТОДЫ

  // FILTER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // const names = ['Ivan', 'Valentina', 'Roman', 'Olga'];
  // const shortName = names.filter(function (item) {
  //   return item.length < 5;
  // });
  // console.log(shortName);

  // MAP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // let answers = ['IvaN', 'RegiNA', 'AnDRey'];
  // const result = answers.map((item) => item.toLocaleLowerCase());
  // console.log(result);

  // EVERY/SOME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // const some = [4, 'word', 'world', 69];
  // console.log(some.some((item) => typeof item === 'number'));
  // console.log(some.every((item) => typeof item === 'number'));

  // REDUCE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // const arr = [1, 4, 7, 3, 7];
  // const res = arr.reduce((sum, current) => sum + current); // сперва 0 +1 => 1+4 => 5 + 7 => 12 + 3 => 15 + 7 === 22
  // console.log(res);

  // const arr = [1, 4, 7, 3, 7];
  // const res = arr.reduce((sum, current) => sum + current, 3); // сперва 3 +1 => 4+4 => 8 + 7 => 15 + 3 => 18 + 7 === 25
  // console.log(res);

  // const arr = ['apple', 'pear', 'peach'];
  // const res = arr.reduce((sum, current) => `${sum}, ${current}`);
  // console.log(res);

  //ПОЛУЧЕНИЕ ТОЛЬКО ИМЁН!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // const obj = {
  //   Ann: 'persone',
  //   Max: 'persone',
  //   dog: 'animal',
  //   cat: 'animal',
  // };

  // const newObj = Object.entries(obj)
  //   .filter((item) => item[1] === 'persone')
  //   .map((item) => {
  //     return item[0];
  //   });
  // console.log(newObj);
});
