export const initProductDetails = () => {
  document.addEventListener('click', (event) => {
    const detailsButton = event.target.closest('.product-card__link.btn--secondary');

    if (!detailsButton) {
      return;
    }

    event.preventDefault();
  });
};
