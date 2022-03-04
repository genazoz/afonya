import noUiSlider from "nouislider";

export class rangeSlider {
  constructor(el) {
    this.$el = el;
    this.sliderItem = this.$el.querySelector('.range-slider__item');
    this.inputs = [
      this.$el.querySelector(".js-input-from"),
      this.$el.querySelector(".js-input-to")
    ],
      this.min = parseInt(this.inputs[0].getAttribute('min')),
      this.max = parseInt(this.inputs[0].getAttribute('max')),

      this.#setup();
  }

  #setup() {
    const T = this;
    let minStart,
      maxStart;

    if (!parseInt(T.inputs[0].getAttribute('value'))) {
      T.$el.querySelector(".js-input-from").setAttribute('value', T.min);
    } else {
      T.$el.querySelector(".js-input-from").setAttribute('value', parseInt(this.inputs[0].getAttribute('value')));
    }

    if (!parseInt(T.inputs[1].getAttribute('value'))) {
      T.$el.querySelector(".js-input-to").setAttribute('value', T.max);
    } else {
      T.$el.querySelector(".js-input-to").setAttribute('value', parseInt(T.inputs[1].getAttribute('value')));
    }

    minStart = parseInt(T.inputs[0].getAttribute('value'));
    maxStart = parseInt(T.inputs[1].getAttribute('value'));


    noUiSlider.create(T.$el.querySelector('.range-slider__item'), {
      start: [minStart, maxStart],
      connect: true,
      range: {
        min: T.min,
        max: T.max,
      },
    });

    T.sliderItem.noUiSlider.on("update", function (values, handle, positions) {
      T.inputs[handle].value = parseInt(values[handle]);
    });

    T.inputs.forEach(function (input, handle) {
      input.addEventListener("change", function () {
        T.sliderItem.noUiSlider.setHandle(handle, this.value);
      });

      input.addEventListener("keydown", function (e) {
        var values = T.sliderItem.noUiSlider.get(),
          value = Number(values[handle]),
          steps = T.sliderItem.noUiSlider.steps(),
          step = steps[handle], position;

        switch (e.which) {
          case 13:
            T.sliderItem.noUiSlider.setHandle(handle, T.value);
            break;

          case 38:
            position = step[1];

            if (position === false) {
              position = 1;
            }

            if (position !== null) {
              T.sliderItem.noUiSlider.setHandle(handle, value + position);
            }

            break;

          case 40:
            position = step[0];

            if (position === false) {
              position = 1;
            }

            if (position !== null) {
              T.sliderItem.noUiSlider.setHandle(handle, value - position);
            }

            break;
        }
      });
    });
  }
}
