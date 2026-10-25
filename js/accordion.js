const activeClass = 'accordion__btn--active';

export const initAccordion = () => {
  const accordion = document.querySelector('.accordion');

  if (!accordion) {
    return;
  }

  accordion.addEventListener('click', (event) => {
    const accordionButton = event.target.closest('.accordion__btn');

    if (!accordionButton) {
      return;
    }

    const isOpen = accordionButton.classList.contains(activeClass);
    const activeButtons = accordion.querySelectorAll(`.${activeClass}`);

    activeButtons.forEach((activeButton) => {
      activeButton.classList.remove(activeClass);
    });

    if (!isOpen) {
      accordionButton.classList.add(activeClass);
    }
  });
};
