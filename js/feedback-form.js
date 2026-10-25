const messages = {
  success: {
    className: 'message--success',
    icon: '✓',
    title: 'Thank you for contacting us!',
    text: 'We have received your request and will contact you shortly',
  },
  error: {
    className: 'message--error',
    icon: '!',
    title: 'Failed to send your request',
    text: 'Something went wrong, please try submitting the form again. If the error persists, contact support.',
  },
};

const createMessage = (type) => {
  const messageData = messages[type];
  const message = document.createElement('div');

  message.classList.add('message', messageData.className);
  message.innerHTML = `
    <div class="message__content">
      <button class="message__close" type="button" aria-label="Close message">
        <svg width="20" height="20" aria-hidden="true">
          <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
      <span class="message__icon">${messageData.icon}</span>
      <div class="message__texts">
        <h2 class="message__title">${messageData.title}</h2>
        <p class="message__text">${messageData.text}</p>
      </div>
    </div>
  `;

  return message;
};

const showMessage = (type) => {
  const currentMessage = document.querySelector('.message');

  if (currentMessage) {
    currentMessage.remove();
  }

  const message = createMessage(type);
  const closeButton = message.querySelector('.message__close');

  const closeMessage = () => {
    message.remove();
    document.removeEventListener('keydown', onEscKeydown);
  };

  function onEscKeydown(event) {
    if (event.key === 'Escape') {
      closeMessage();
    }
  }

  closeButton.addEventListener('click', closeMessage);

  message.addEventListener('click', (event) => {
    if (event.target === message) {
      closeMessage();
    }
  });

  document.addEventListener('keydown', onEscKeydown);
  document.body.append(message);
};

const sendForm = (form) => fetch(form.action, {
  method: form.method,
  body: new FormData(form),
});

export const initFeedbackForm = () => {
  const form = document.querySelector('.questions__form');

  if (!form || !window.JustValidate) {
    return;
  }

  const validator = new window.JustValidate(form, {
    errorFieldStyle: {},
    errorLabelStyle: {},
    errorLabelCssClass: 'questions__error',
    errorFieldCssClass: 'questions__input--error',
    focusInvalidField: false,
  });

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Enter your name',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Name must be at least 3 characters',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'Name must be at most 20 characters',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Enter your email',
      },
      {
        rule: 'email',
        errorMessage: 'Enter a valid email',
      },
    ])
    .addField('#agree', [
      {
        rule: 'required',
        errorMessage: 'Consent is required',
      },
    ])
    .onSuccess((event) => {
      event.preventDefault();

      sendForm(form)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Form sending failed');
          }

          form.reset();
          showMessage('success');
        })
        .catch(() => {
          showMessage('error');
        });
    })
    .onFail(() => {
      const nameField = form.querySelector('#name');
      const emailField = form.querySelector('#email');
      const nameLength = nameField.value.trim().length;
      const isNameValid = nameLength >= 3 && nameLength <= 20;
      const isEmailValid = emailField.value.trim() !== '' && emailField.checkValidity();

      if (!isNameValid || !isEmailValid) {
        showMessage('error');
      }
    });
};
