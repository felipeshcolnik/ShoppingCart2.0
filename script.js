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

function cartItemClickListener(event) {
  const sku = event.target.parentNode.firstChild.innerText;
  fetchAddItemToCart(sku);
}

function addToCartButton() {
  const buttonList = document.querySelectorAll('.item__add');
  console.log(buttonList.length);
  // const buttonList = document.getElementsByClassName('item__add');
  buttonList.forEach((button) => {
    console.log('button');
    button.addEventListener('click', cartItemClickListener);
  });
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
  addToCartButton();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const ul = document.querySelector('.cart__items');
  const li = document.createElement('li');
  const button = document.createElement('button');
  const div = document.createElement('div');
  li.className = 'cart__item';
  li.innerText = `${name} | SKU: ${sku} |  PRICE: $${salePrice}`;
  button.innerText = ('retirar do carrinho');
  button.addEventListener('click', () => ul.removeChild(div));
  div.appendChild(li);
  div.appendChild(button);
  ul.appendChild(div);
  return li;
}

const fetchAddItemToCart = async (ItemID) => {
  const url = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(url);
  const data = await response.json();
  const { id, title, price } = data;
  // console.log(data.salePrice);
  createCartItemElement({ sku: id, name: title, salePrice: price });
};

window.onload = function onload() {
  fetchSearchProducts('computador');
  // addToCartButton(); POR QUI NAO FUNCIONA SEM O TIMEOUT ?
  // setTimeout(addToCartButton, 1500);
};
