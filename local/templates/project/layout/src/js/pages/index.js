import '~/js/common';
import {Dropdown} from '~/blocks/dropdown/dropdown';
import {rangeSlider} from '~/blocks/range-slider/range-slider';

window.rangeSliders = window.dropdowns = [];
const requestURL = 'https://run.mocky.io/v3/845933c3-1bfe-4810-aedd-1b5cda0b1d58';
let loaded = false;

function sendRequest(method, url) {
  return fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then(error => {
        const e = new Error('Что-то пошло не так');
        return e
      })
    }
  )
}

const generateEls = data => {
  const filterList = document.querySelector('.filter__list');

  window.dropdowns = [...window.dropdowns, ...data.dropdowns.map((data) => {
    const dropdown = createDropdown(data);

    filterList.append(dropdown);
    return new Dropdown(dropdown);
  })]

  window.rangeSliders = [...window.rangeSliders, ...data.rangeSliders.map((data) => {
    const slider = createRangeSlider(data);

    filterList.append(slider);
    return new rangeSlider(slider);
  })]

  loaded = !loaded;
}

const createDropdown = (data) => {
  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown', 'dropdown--filter', 'js-dropdown');
  dropdown.setAttribute('data-toggle-hidden', '');
  dropdown.innerHTML = getDropdownTemplate(data.list, data.placeholder);
  return dropdown;
}

const createRangeSlider = (data) => {
  const slider = document.createElement('div');
  slider.classList.add('range-slider', 'js-range-slider');
  slider.setAttribute('data-toggle-hidden', '');
  slider.innerHTML = getRangeSliderTemplate(data);
  return slider;
}

const getDropdownTemplate = (data = [], placeholder) => {
  const items = data.map(item => {
    return `<li class="dropdown__item"><input type="checkbox" id="${item.id}"><label for="${item.id}">${item.text}</label></li>`
  });

  return `<div class="dropdown__header" data-type="dropdown-header">
            ${placeholder ?? 'Выберите'}
            <svg class="i-arrow-down dropdown__header-ico" data-type="dropdown-ico">
                <use xlink:href="#i-arrow-down"></use>
            </svg>
            <div class="dropdown__header-button">
              <svg class="i-cross"><use xlink:href="#i-cross"></use></svg>
            </div>
          </div>
          <div class="dropdown__content">
            <ul class="dropdown__list">${items.join('')}</ul>
            <button class="btn dropdown__button">
              <span class="btn__bg"></span>
              <span class="btn__text">Применить</span>
            </button>
          </div>`
}

const getRangeSliderTemplate = (data = []) => {
  return `<div class="range-slider__header">
      ${data.placeholder ?? 'Выберите'}
    </div>
    <div class="range-slider__item"></div>
    <div class="range-slider__result">
      <div class="range-slider__result-item range-slider__result-item-from">
        <input class="js-input-from" type="number" value="0" min="${data.min}" max="${data.max}" step="1" />
      </div>
      <div class="range-slider__result-item range-slider__result-item-to">
        <input class="js-input-to" type="number" value="0" min="${data.min}" max="${data.max}" step="1" />
      </div>
    </div>`
}


window.addEventListener('DOMContentLoaded', () => {
  const $rangeSliders = document.querySelectorAll('.js-range-slider'),
    $dropdowns = document.querySelectorAll('.js-dropdown'),
    $filterButton = document.querySelector('.filter__button');

  $rangeSliders.forEach(function ($el) {
    window.rangeSliders = [...window.rangeSliders, new rangeSlider($el)];
  })

  $dropdowns.forEach(function ($el) {
    window.dropdowns = [...window.dropdowns, new Dropdown($el)];
  })

  $filterButton.addEventListener('click', function () {
    const T = this;
    const $toggleEls = T.closest('.filter__content').querySelectorAll('[data-toggle-hidden]');

    if (!loaded) {
      sendRequest('GET', requestURL)
        .then(data => {
          generateEls(data);
          T.classList.toggle('is-active');
          $toggleEls.forEach(item => item.classList.toggle('is-hidden'));
        })
        .catch(err => console.log(err))
    } else {
      T.classList.toggle('is-active');
      $toggleEls.forEach(item => item.classList.toggle('is-hidden'));
    }
  })
});
