import { initAccordion } from './accordion.js';
import { initBasket } from './basket.js';
import { initCatalog } from './catalog.js';
import { initCatalogMenu } from './catalog-menu.js';
import { initDayProducts } from './day-products.js';
import { initFeedbackForm } from './feedback-form.js';
import { initLocation } from './location.js';
import { initProductDetails } from './product-details.js';

window.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initBasket();
  initCatalog();
  initCatalogMenu();
  initDayProducts();
  initFeedbackForm();
  initLocation();
  initProductDetails();
});
