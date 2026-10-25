const activeClass = 'main-menu--active';
const activeLinkClass = 'main-menu__link--active';

export const initCatalogMenu = () => {
  const catalogButton = document.querySelector('.header__catalog-btn');
  const catalogMenu = document.querySelector('.main-menu');
  const catalogCloseButton = document.querySelector('.main-menu__close');
  const catalogLinks = document.querySelectorAll('.main-menu__link');

  if (!catalogButton || !catalogMenu || !catalogCloseButton) {
    return;
  }

  const openMenu = () => {
    catalogMenu.classList.add(activeClass);
    catalogButton.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    catalogMenu.classList.remove(activeClass);
    catalogButton.setAttribute('aria-expanded', 'false');
  };

  catalogButton.setAttribute('aria-expanded', 'false');
  catalogButton.setAttribute('aria-controls', 'catalog-menu');
  catalogMenu.setAttribute('id', 'catalog-menu');

  catalogButton.addEventListener('click', openMenu);
  catalogCloseButton.addEventListener('click', closeMenu);

  catalogMenu.addEventListener('click', (evt) => {
    if (evt.target === catalogMenu) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && catalogMenu.classList.contains(activeClass)) {
      closeMenu();
    }
  });

  catalogLinks.forEach((link) => {
    const categoryName = link.textContent.trim();
    link.href = `catalog.html?category=${categoryName}`;

    link.addEventListener('click', () => {
      catalogLinks.forEach((item) => item.classList.remove(activeLinkClass));
      link.classList.add(activeLinkClass);
      closeMenu();
    });
  });

  const currentCategory = new URLSearchParams(window.location.search).get('category');

  if (currentCategory) {
    catalogLinks.forEach((link) => {
      const categoryName = link.textContent.trim();

      link.classList.toggle(
        activeLinkClass,
        categoryName === currentCategory
      );
    });
  }
};
