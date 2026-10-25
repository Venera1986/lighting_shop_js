const activeClass = 'location__city--active';
const cityKeys = ['berlin', 'paris', 'madrid'];

export const initLocation = () => {
  const location = document.querySelector('.location');
  const cityButton = document.querySelector('.location__city');
  const cityName = document.querySelector('.location__city-name');
  const cityLinks = document.querySelectorAll('.location__sublink');
  const cityList = document.querySelector('.location__sublist');

  if (!location || !cityButton || !cityName || !cityList) {
    return;
  }

  const openCityList = () => {
    cityButton.classList.add(activeClass);
    cityButton.setAttribute('aria-expanded', 'true');
  };

  const closeCityList = () => {
    cityButton.classList.remove(activeClass);
    cityButton.setAttribute('aria-expanded', 'false');
  };

  const toggleCityList = () => {
    if (cityButton.classList.contains(activeClass)) {
      closeCityList();
    } else {
      openCityList();
    }
  };

  cityButton.setAttribute('aria-expanded', 'false');
  cityButton.setAttribute('aria-controls', 'city-list');
  cityList.setAttribute('id', 'city-list');
  cityName.dataset.city = cityName.dataset.city || 'paris';

  cityButton.addEventListener('click', toggleCityList);

  cityLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      const city = link.dataset.city || cityKeys[index] || 'paris';

      cityName.textContent = link.textContent;
      cityName.dataset.city = city;
      closeCityList();
      document.dispatchEvent(new CustomEvent('citychange', {
        detail: {
          city,
        },
      }));
    });
  });

  document.addEventListener('click', (event) => {
    const isClickInside = location.contains(event.target);

    if (!isClickInside) {
      closeCityList();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCityList();
    }
  });
};
