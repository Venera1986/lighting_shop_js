const productsPerPage = 6;

const cityLabels = {
  berlin: 'Berlin',
  paris: 'Paris',
  madrid: 'Madrid',
};

const getProductImage = (product) => {
  const imagePath = `images/item-${product.id}.png`;

  if (product.id > 16 && product.image) {
    return product.image.replace('../', '');
  }

  return imagePath;
};

const getFormattedPrice = (price) => price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getSelectedTypes = (catalogForm) => Array
  .from(catalogForm.querySelectorAll('input[name="type"]:checked'))
  .map((input) => input.value);

const getSelectedCity = () => {
  const cityName = document.querySelector('.location__city-name');

  return cityName && cityName.dataset.city
    ? cityName.dataset.city
    : 'paris';
};

const getProductCount = (product, city) => Number(product.availability[city]) || 0;

const getTypeProductCounts = (products) => products.reduce((counts, product) => {
  [...new Set(product.type)].forEach((type) => {
    counts[type] = (counts[type] || 0) + 1;
  });

  return counts;
}, {});

const renderTypeCounts = (products, typeInputs) => {
  const typeCounts = getTypeProductCounts(products);

  typeInputs.forEach((input) => {
    const checkbox = input.closest('.custom-checkbox');
    const countElement = checkbox
      ? checkbox.querySelector('.custom-checkbox__count')
      : null;

    if (countElement) {
      countElement.textContent = typeCounts[input.value] || 0;
    }
  });
};

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

const renderProductCard = (product, city) => `
  <li class="catalog__item">
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card__visual">
        <img class="product-card__img" src="${getProductImage(product)}" height="436" width="290" alt="${product.name}">
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

const renderProducts = (products, productsList, city) => {
  if (products.length === 0) {
    productsList.innerHTML = '<li class="catalog__empty">No products found</li>';
    return;
  }

  productsList.innerHTML = products
    .map((product) => renderProductCard(product, city))
    .join('');
};

const renderPagination = (pagesCount, currentPage, pagination) => {
  pagination.innerHTML = '';

  if (pagesCount < 2) {
    return;
  }

  for (let page = 1; page <= pagesCount; page++) {
    const paginationItem = document.createElement('li');
    const paginationButton = document.createElement('button');

    paginationItem.classList.add('catalog__pagination-item');
    paginationButton.classList.add('catalog__pagination-link');
    paginationButton.type = 'button';
    paginationButton.textContent = page;
    paginationButton.disabled = page === currentPage;

    if (page === currentPage) {
      paginationButton.classList.add('catalog__pagination-link--active');
    }

    paginationItem.append(paginationButton);
    pagination.append(paginationItem);
  }
};

const getFilteredProducts = (products, catalogForm, city) => {
  const selectedTypes = getSelectedTypes(catalogForm);
  const selectedStatus = document.querySelector('input[name="status"]:checked');

  return products.filter((product) => {
    const hasSelectedType = selectedTypes.length === 0
      || selectedTypes.some((type) => product.type.includes(type));
    const isInStock = !selectedStatus
      || selectedStatus.value !== 'instock'
      || getProductCount(product, city) > 0;

    return hasSelectedType && isInStock;
  });
};

const getSortedProducts = (products, sortValue) => {
  const sortedProducts = [...products];

  if (sortValue === 'price-min') {
    sortedProducts.sort((firstProduct, secondProduct) => firstProduct.price.new - secondProduct.price.new);
  }

  if (sortValue === 'price-max') {
    sortedProducts.sort((firstProduct, secondProduct) => secondProduct.price.new - firstProduct.price.new);
  }

  if (sortValue === 'rating-max') {
    sortedProducts.sort((firstProduct, secondProduct) => secondProduct.rating - firstProduct.rating);
  }

  return sortedProducts;
};

export const initCatalog = () => {
  const catalog = document.querySelector('.catalog');
  const catalogForm = document.querySelector('.catalog-form');
  const productsList = document.querySelector('.catalog__list');
  const sortSelect = document.querySelector('.catalog__sort-select');
  const pagination = document.querySelector('.catalog__pagination');

  if (!catalog || !catalogForm || !productsList || !sortSelect || !pagination) {
    return;
  }

  const typeInputs = catalogForm.querySelectorAll('input[name="type"]');
  let products = [];
  let currentPage = 1;
  let isSortChanged = false;

  const renderCatalog = () => {
    const selectedCity = getSelectedCity();
    const filteredProducts = getFilteredProducts(products, catalogForm, selectedCity);
    const sortedProducts = isSortChanged
      ? getSortedProducts(filteredProducts, sortSelect.value)
      : filteredProducts;
    const pagesCount = Math.max(1, Math.ceil(sortedProducts.length / productsPerPage));

    if (currentPage > pagesCount) {
      currentPage = pagesCount;
    }

    const firstProductIndex = (currentPage - 1) * productsPerPage;
    const lastProductIndex = firstProductIndex + productsPerPage;
    const productsOnPage = sortedProducts.slice(firstProductIndex, lastProductIndex);

    renderTypeCounts(products, typeInputs);
    renderProducts(productsOnPage, productsList, selectedCity);
    renderPagination(pagesCount, currentPage, pagination);
  };

  fetch('./data/data.json')
    .then((response) => response.json())
    .then((data) => {
      products = data;
      renderCatalog();
    })
    .catch(() => {
      productsList.innerHTML = '<li class="catalog__empty">Failed to load products</li>';
      pagination.innerHTML = '';
    });

  catalogForm.addEventListener('change', () => {
    currentPage = 1;
    renderCatalog();
  });

  catalogForm.addEventListener('input', () => {
    currentPage = 1;
    renderCatalog();
  });

  catalogForm.addEventListener('reset', () => {
    setTimeout(() => {
      typeInputs.forEach((input) => {
        input.checked = false;
      });

      currentPage = 1;
      renderCatalog();
    });
  });

  sortSelect.addEventListener('change', () => {
    isSortChanged = true;
    currentPage = 1;
    renderCatalog();
  });

  document.addEventListener('citychange', () => {
    currentPage = 1;
    renderCatalog();
  });

  pagination.addEventListener('click', (event) => {
    const paginationButton = event.target.closest('.catalog__pagination-link');

    if (!paginationButton) {
      return;
    }

    currentPage = Number(paginationButton.textContent);
    renderCatalog();
    catalog.scrollIntoView();
  });
};
