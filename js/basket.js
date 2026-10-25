const activeClass = 'basket--active';
const storageKey = 'basketProductsEur';

const getProductImage = (product) => {
  const imagePath = `images/item-${product.id}.png`;

  if (product.id > 16 && product.image) {
    return product.image.replace('../', '');
  }

  return imagePath;
};

const getProductsData = () => fetch('./data/data.json')
  .then((response) => response.json())
  .catch(() => []);

const getProductInfoById = (productId, productsData) => {
  const product = productsData.find((item) => String(item.id) === String(productId));

  if (!product) {
    return null;
  }

  return {
    id: String(product.id),
    image: getProductImage(product),
    title: product.name,
    price: product.price.new,
  };
};

const getProductInfo = (productCard, productsData) => getProductInfoById(productCard.dataset.productId, productsData);

const getFormattedPrice = (price) => price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getSavedProducts = () => {
  const savedProducts = localStorage.getItem(storageKey);

  if (!savedProducts) {
    return [];
  }

  try {
    return JSON.parse(savedProducts).filter((product) => (
      Number.isFinite(product.price)
      && product.price > 0
      && Number.isFinite(product.quantity)
      && product.quantity > 0
    ));
  } catch {
    return [];
  }
};

const saveProducts = (products) => {
  localStorage.setItem(storageKey, JSON.stringify(products));
};

export const initBasket = () => {
  const basketButton = document.querySelector('.header__user-item:first-child .header__user-btn');
  const basket = document.querySelector('.basket');
  const basketList = document.querySelector('.basket__list');
  const basketCount = document.querySelector('.header__user-count');
  const basketEmpty = document.querySelector('.basket__empty-block');

  if (!basketButton || !basket || !basketList || !basketCount || !basketEmpty) {
    return;
  }

  const products = getSavedProducts();
  const productsDataPromise = getProductsData();
  saveProducts(products);

  const openBasket = () => {
    basket.classList.add(activeClass);
  };

  const closeBasket = () => {
    basket.classList.remove(activeClass);
  };

  const toggleBasket = () => {
    if (basket.classList.contains(activeClass)) {
      closeBasket();
    } else {
      openBasket();
    }
  };

  const getProductsCount = () => {
    let count = 0;

    products.forEach((product) => {
      count += product.quantity;
    });

    return count;
  };

  const renderBasket = () => {
    const basketLinkOld = basket.querySelector('.basket__link');

    if (basketLinkOld) {
      basketLinkOld.remove();
    }

    basketList.innerHTML = '';
    basketCount.textContent = getProductsCount();

    if (products.length === 0) {
      basketEmpty.hidden = false;
      return;
    }

    basketEmpty.hidden = true;

    products.forEach((product) => {
      const basketItem = document.createElement('li');

      basketItem.classList.add('basket__item');
      basketItem.innerHTML = `
        <div class="basket__img">
          <img src="${product.image}" alt="${product.title}" height="60" width="60">
        </div>
        <span class="basket__name">${product.title}</span>
        <span class="basket__price">${getFormattedPrice(product.price * product.quantity)} €</span>
        <div class="basket__counter">
          <button class="basket__counter-btn" type="button" data-action="minus" data-id="${product.id}">-</button>
          <span class="basket__counter-value">${product.quantity}</span>
          <button class="basket__counter-btn" type="button" data-action="plus" data-id="${product.id}">+</button>
        </div>
        <button class="basket__close" type="button" data-action="remove" data-id="${product.id}">
          <svg class="basket__close-icon" width="20" height="20" aria-hidden="true">
            <use xlink:href="images/sprite.svg#icon-close"></use>
          </svg>
        </button>
      `;

      basketList.append(basketItem);
    });

    const basketLink = document.createElement('a');

    basketLink.classList.add('basket__link', 'btn');
    basketLink.href = '#';
    basketLink.textContent = 'Proceed to checkout';

    basketList.after(basketLink);
  };

  const addProduct = (productInfo) => {
    if (!productInfo) {
      return;
    }

    const currentProduct = products.find((product) => product.id === productInfo.id);

    if (!Number.isFinite(productInfo.price) || productInfo.price <= 0) {
      return;
    }

    if (currentProduct) {
      currentProduct.price = productInfo.price;
      currentProduct.quantity++;
    } else {
      products.push({
        ...productInfo,
        quantity: 1,
      });
    }

    renderBasket();
    saveProducts(products);
  };

  document.addEventListener('click', async (event) => {
    const addButton = event.target.closest('.product-card__link.btn--icon');

    if (!addButton) {
      return;
    }

    const productCard = event.target.closest('.product-card');

    if (!productCard) {
      return;
    }

    event.preventDefault();
    const productsData = await productsDataPromise;

    addProduct(getProductInfo(productCard, productsData));
  });

  document.addEventListener('addtocart', async (event) => {
    if (!event.detail || !event.detail.productId) {
      return;
    }

    const productsData = await productsDataPromise;

    addProduct(getProductInfoById(event.detail.productId, productsData));
  });

  basketButton.addEventListener('click', toggleBasket);

  basket.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');

    if (!actionButton) {
      return;
    }

    event.stopPropagation();

    const currentProduct = products.find((product) => product.id === actionButton.dataset.id);

    if (!currentProduct) {
      return;
    }

    if (actionButton.dataset.action === 'plus') {
      currentProduct.quantity++;
    }

    if (actionButton.dataset.action === 'minus') {
      currentProduct.quantity--;
    }

    if (actionButton.dataset.action === 'remove' || currentProduct.quantity === 0) {
      products.splice(products.indexOf(currentProduct), 1);
    }

    renderBasket();
    saveProducts(products);
  });

  document.addEventListener('click', (event) => {
    const isClickInsideBasket = basket.contains(event.target);
    const isBasketButton = basketButton.contains(event.target);
    const isProductCard = event.target.closest('.product-card');

    if (!isClickInsideBasket && !isBasketButton && !isProductCard) {
      closeBasket();
    }
  });

  renderBasket();
};
