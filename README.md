# Briaton — Lighting Shop Catalog

A catalog page for **Briaton**, an online lighting store, built with HTML, SCSS and vanilla JavaScript (ES modules). There is no framework and no build step for JS. Product data is loaded from a local JSON file.

## Features

- **Product catalog**: rendered from `data/data.json`, with 6 products per page and pagination.
- **Filters**: by fixture type (pendant, ceiling, surface-mounted, recessed, night lights) and by stock status (in stock / all). A reset button clears them.
- **Sorting**: by price (low to high, high to low) or by popularity.
- **City selector**: Berlin, Paris or Madrid. Stock counts and the in-stock filter follow the selected city.
- **Stock tooltip**: each product card shows how many items are available in each city.
- **Products of the day**: a Swiper slider of featured products that are in stock in the selected city.
- **Cart**: add and remove products. The cart is saved in `localStorage` and shows prices in EUR (€).
- **Catalog menu**: a drawer with product categories.
- **FAQ accordion**.
- **Feedback form**: validated with JustValidate and sent to `https://httpbin.org/post`. A success or error message is shown after sending.

## Tech stack

- HTML5, SCSS (BEM naming)
- Vanilla JavaScript, ES modules
- [Swiper](https://swiperjs.com/) 11: slider
- [JustValidate](https://just-validate.dev/): form validation
- [Tippy.js](https://atomiks.github.io/tippyjs/) + Popper: included as vendor scripts

All libraries are stored locally in `js/vendor/`, so no package manager is needed.

## Project structure

```
├── catalog.html        # Main page
├── css/                # Compiled CSS (style.css)
├── scss/
│   ├── style.scss      # SCSS entry point
│   ├── blocks/         # BEM blocks (header, catalog, basket, ...)
│   ├── global/         # Variables, mixins, fonts, reset
│   └── vendor/         # Library styles
├── js/
│   ├── main.js         # Entry point: initializes all modules
│   ├── catalog.js      # Rendering, filters, sorting, pagination
│   ├── day-products.js # "Products of the day" slider
│   ├── basket.js       # Cart
│   ├── location.js     # City selector
│   ├── catalog-menu.js # Category menu
│   ├── accordion.js    # FAQ accordion
│   ├── feedback-form.js# Form validation and submission
│   └── vendor/         # Third-party libraries
├── data/data.json      # Product data
├── fonts/              # Noto Sans
└── images/             # Product images and SVG sprite
```

## Getting started

The page loads `data/data.json` with `fetch` and uses ES modules, so it must be served over HTTP. Opening `catalog.html` directly from disk (`file://`) won't work.

Run any static server from the project root, for example:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000/catalog.html` (or the URL your server prints).

### Styles

Edit the files in `scss/` and compile them to `css/style.css`, for example with the Live Sass Compiler extension in VS Code or with the Sass CLI:

```bash
npx sass scss/style.scss css/style.css --watch
```

## Product data

Each product in `data/data.json` looks like this:

```json
{
  "id": 1,
  "name": "Ornella A4059PL-4AB Ceiling Chandelier (Artelamp)",
  "price": { "new": 128.22, "old": 170.0 },
  "image": "images/item-1.png",
  "availability": { "berlin": 10, "paris": 20, "madrid": 17 },
  "type": ["pendant", "nightlights"],
  "rating": 30,
  "goodsOfDay": true
}
```

- `price`: in EUR. `old` is shown crossed out.
- `availability`: stock count per city key.
- `type`: fixture types used by the catalog filters.
- `rating`: used for sorting by popularity.
- `goodsOfDay`: shows the product in the "Products of the day" slider.

## Credits

Design by [AFFARTS](https://affarts.ru/).
