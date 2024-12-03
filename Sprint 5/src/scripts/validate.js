// Экспортируемая функция для включения валидации на всех формах, соответствующих переданной конфигурации
export const enableValidation = (config) => {
  // Массив из всех форм, найденных по селектору из конфигурации
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  // Для каждой формы из списка устанавливаются обработчики и начальная валидация
  formList.forEach((form) => {
    // Добавляется обработчик события "submit" для отключения стандартного поведения (перезагрузки страницы)
    form.addEventListener('submit', disableSubmit);
    // Добавляется обработчик события "input" для переключения состояния кнопки "submit" при изменении полей формы
    form.addEventListener('input', () => {
      toggleButton(form, config);
    });

    // Установка "слушателей" событий ввода для всех "инпутов" формы
    addInputListners(form, config);
    // Проверка и устанавливка начального состояния кнопки "submit"
    toggleButton(form, config);
  });
};

// Отключение стандартного поведения формы при отправке
const disableSubmit = (evt) => {
  evt.preventDefault(); // Отмена стандартного поведения браузера (перезагрузку страницы)
}

// Обработчик валидации для одного поля ввода
const handleFormInput = (evt, config) => {
  // Элемент ввода, вызвавший событие
  const input = evt.target;
  // ID элемента ввода, чтобы найти связанный элемент для вывода ошибки
  const inputId = input.id;
  const errorElement = document.querySelector(`#${inputId}-error`);

  // Если поле ввода проходит валидацию...
  if (input.validity.valid) {
    // ...удаление класса с ошибкой у поля
    input.classList.remove(config.inputErrorClass);
    // ...очистка сообщения об ошибке
    errorElement.textContent = '';
  } else {
    // ...добавление класса ошибки к полю ввода
    input.classList.add(config.inputErrorClass);
    // ...установка текста сообщения об ошибке
    errorElement.textContent = input.validationMessage;
  }
}

// Переключель состояния кнопки "submit" (включение/выключение)
const toggleButton = (form, config) => {
  // Кнопка "submit" в текущей форме
  const buttonSubmint = form.querySelector(config.submitButtonSelector);
  // Проверка, валидна ли вся форма (встроенная валидация браузера)
  const isFormValid = form.checkValidity();

  // Установка состояния кнопки: если форма не валидна, кнопка блокируется
  buttonSubmint.disabled = !isFormValid;
  // Добавление или удаление класса, связанного с неактивным состоянием кнопки
  buttonSubmint.classList.toggle('popup__button_disabled', !isFormValid);
}

// Добавление обработчиков событий ввода для всех "инпутов" формы
const addInputListners = (form, config) => {
  // Создаем массив всех полей ввода в форме, найденных по селектору из конфигурации
  const inputList = Array.from(form.querySelectorAll(config.inputSelector));

  // Добавление обработчика события "input" для каждого поля ввода
  inputList.forEach(function (item) {
    item.addEventListener('input', (evt) => {
      // Запуск проверки валидации для текущего поля при каждом вводе
      handleFormInput(evt, config);
    })
  });
}
