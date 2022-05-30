function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const fetchSearchProducts = async (query) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  const listOfProducts = data.results;
  const items = document.querySelector('.items');
  listOfProducts.forEach((product) => {
    const { id, title, thumbnail } = product;
    items.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  console.log('event');
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ul = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ul.appendChild(li);
  return li;
}

const fetchAddItemToCart = async (ItemID) => {
  console.log('clicou');
  const url = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const { id, title, salePrice } = data;
  createCartItemElement({ sku: id, name: title, salePrice });
};

function addToCartSKU(event) {
  const sku = event.target.parentNode.firstChild.innerText;
  fetchAddItemToCart(sku);
}

function addToCartButton() {
  const buttonList = document.querySelectorAll('.item__add');
  console.log(buttonList.length);
  // const buttonList = document.getElementsByClassName('item__add');
  buttonList.forEach((button) => {
    console.log('button');
    button.addEventListener('click', addToCartSKU);
  });
}

window.onload = function onload() {
  fetchSearchProducts('computador');
  // addToCartButton(); POR QUI NAO FUNCIONA SEM O TIMEOUT ?
  setTimeout(addToCartButton, 1500);
};
