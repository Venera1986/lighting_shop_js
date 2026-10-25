const cityLabels = {
  berlin: 'Berlin',
  paris: 'Paris',
  madrid: 'Madrid',
};

const getDayProductImage = (product) => product.image;

const getFormattedPrice = (price) => price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getDayProducts = (products, city) => products
  .filter((product) => product.goodsOfDay && getProductCount(product, city) > 0);

const getSelectedCity = () => {
  const cityName = document.querySelector('.location__city-name');

  return cityName && cityName.dataset.city
    ? cityName.dataset.city
    : 'paris';
};

const getProductCount = (product, city) => Number(product.availability[city]) || 0;

const renderAvailabilityTooltip = (product) => `
  <div class="product-card__tooltip product-card__tooltip--hover tooltip">
    <button class="tooltip__btn" aria-label="Show tooltip" type="button">
      <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
        <use xlink:href="images/sprite.svg#icon-i"></use>
      </svg>
    </button>
    <div class="tooltip__content">
      <span class="tooltip__text">Stock by city:</span>
      <ul class="tooltip__list">
        ${Object.entries(product.availability).map(([city, count]) => `
          <li class="tooltip__item">
            <span class="tooltip__text">${cityLabels[city]}: <span class="tooltip__count">${count}</span></span>
          </li>
        `).join('')}
      </ul>
    </div>
  </div>
`;

const renderDayProductCard = (product) => `
  <li class="day-products__item swiper-slide">
    <div class="product-card product-card--small" data-product-id="${product.id}">
      <div class="product-card__visual">
        <img class="product-card__img" src="${getDayProductImage(product)}" height="344" width="290" alt="${product.name}" draggable="false">
        <div class="product-card__more">
          <a href="#" class="product-card__link btn btn--icon">
            <span class="btn__text">Add to cart</span>
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-basket"></use>
            </svg>
          </a>
          <a href="#" class="product-card__link btn btn--secondary">
            <span class="btn__text">Details</span>
          </a>
        </div>
      </div>
      <div class="product-card__info">
        <h2 class="product-card__title">${product.name}</h2>
        <span class="product-card__old">
          <span class="product-card__old-number">${getFormattedPrice(product.price.old)}</span>
          <span class="product-card__old-add">€</span>
        </span>
        <span class="product-card__price">
          <span class="product-card__price-prefix">from </span>
          <span class="product-card__price-number">${getFormattedPrice(product.price.new)}</span>
          <span class="product-card__price-add">€</span>
        </span>
        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" aria-label="Show tooltip">
            <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-i"></use>
            </svg>
          </button>
          <div class="tooltip__content">
            <span class="tooltip__text">Stock by city:</span>
            <ul class="tooltip__list">
              ${Object.entries(product.availability).map(([city, count]) => `
                <li class="tooltip__item">
                  <span class="tooltip__text">${cityLabels[city]}: <span class="tooltip__count">${count}</span></span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </li>
`;

let dayProductsSlider = null;

const initDayProductsSlider = () => {
  if (!window.Swiper) {
    return;
  }

  if (dayProductsSlider) {
    dayProductsSlider.destroy(true, true);
  }

  dayProductsSlider = new window.Swiper('.day-products__slider', {
    slidesPerView: 4,
    spaceBetween: 40,
    allowTouchMove: true,
    grabCursor: true,
    simulateTouch: true,
    navigation: {
      nextEl: '.day-products__navigation-btn--next',
      prevEl: '.day-products__navigation-btn--prev',
    },
  });
};

export const initDayProducts = () => {
  const dayProductsList = document.querySelector('.day-products__list');

  if (!dayProductsList) {
    return;
  }

  let products = [];

  const renderDayProducts = () => {
    const selectedCity = getSelectedCity();
    const dayProducts = getDayProducts(products, selectedCity);

    if (dayProducts.length === 0) {
      dayProductsList.innerHTML = '';
      initDayProductsSlider();
      return;
    }

    dayProductsList.innerHTML = dayProducts
      .map((product) => renderDayProductCard(product))
      .join('');
    initDayProductsSlider();
  };

  fetch('./data/data.json')
    .then((response) => response.json())
    .then((data) => {
      products = data;
      renderDayProducts();
    });

  document.addEventListener('citychange', renderDayProducts);

  dayProductsList.addEventListener('click', (event) => {
    const addButton = event.target.closest('.product-card__link.btn--icon');

    if (!addButton) {
      return;
    }

    const productCard = addButton.closest('.product-card');

    if (!productCard) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    document.dispatchEvent(new CustomEvent('addtocart', {
      detail: {
        productId: productCard.dataset.productId,
      },
    }));
  });
};
