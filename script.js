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

function createProductItemElement({
  sku, name, image, salePrice,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${salePrice}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function totalPrice() {
  const list = document.querySelectorAll('li');
  let ttPrice = 0;
  [...list].map((item) => {
    ttPrice += parseFloat(item.innerHTML.split('$')[1]);
    return ttPrice;
  });

  const price = document.querySelector('.total-price');
  price.innerHTML = `TOTAL R$ ${ttPrice}`;
}

function includeItemOnLocalStorage() {
  const li = document.querySelectorAll('.cart__item');
  for (let i = 0; i < li.length; i += 1) {
    const object = {
      info: li[i].innerHTML,
      className: li[i].className,
    };
    localStorage.setItem(i, JSON.stringify(object));
  }
}

function removeItemfromLocalStorage() {
  includeItemOnLocalStorage();
  const li = document.querySelectorAll('.cart__item');
  localStorage.removeItem(li.length);
}

function removeItemfromCart(item) {
  const ul = document.querySelector('.cart__items');
  ul.removeChild(item);
  removeItemfromLocalStorage();
  totalPrice();
}
function getStorage() {
  const ul = document.querySelector('.cart__items');
  for (let i = 0; i < localStorage.length; i += 1) {
    const item = JSON.parse(localStorage.getItem(i));
    const li = document.createElement('li');
    const button = document.createElement('button');
    const div = document.createElement('div');
    li.className = item.className;
    li.innerText = item.info;
    button.innerText = ('retirar do carrinho');
    button.addEventListener('click', () => removeItemfromCart(div));
    div.appendChild(li);
    div.appendChild(button);
    ul.appendChild(div);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const ul = document.querySelector('.cart__items');
  const li = document.createElement('li');
  const button = document.createElement('button');
  const div = document.createElement('div');
  li.className = 'cart__item';
  li.innerText = `${name} | SKU: ${sku} |  PRICE: $${salePrice}`;
  button.innerText = ('retirar do carrinho');
  button.addEventListener('click', () => removeItemfromCart(div));
  div.appendChild(li);
  div.appendChild(button);
  ul.appendChild(div);
  includeItemOnLocalStorage();
  totalPrice();
  return li;
}

const fetchAddItemToCart = async (ItemID) => {
  const url = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(url);
  const data = await response.json();
  const { id, title, price } = data;
  createCartItemElement({ sku: id, name: title, salePrice: price });
};

function cartItemClickListener(event) {
  const sku = event.target.parentNode.firstChild.innerText;
  fetchAddItemToCart(sku);
}

function addToCartButton() {
  const buttonList = document.querySelectorAll('.item__add');
  buttonList.forEach((button) => {
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
    const {
      id, title, thumbnail, price,
    } = product;
    items.appendChild(createProductItemElement({
      sku: id, name: title, image: thumbnail, salePrice: price,
    }));
  });
  addToCartButton();
};

function clearChildrenList(list) {
  for (let i = 0; i < list.childNodes.length; i = 0) {
    list.removeChild(list.childNodes[0]);
  }
}
function clearCart() {
  const button = document.querySelector('.empty-cart');
  const ul = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    clearChildrenList(ul);
    localStorage.clear();
    totalPrice();
  });
}

function clearSaleProductsList() {
  const button = document.querySelector('#search-btn');
  const listOfSaleProducts = document.querySelector('.items');
  button.addEventListener('click', () => clearChildrenList(listOfSaleProducts));
}

function searchProducts() {
  const text = document.querySelector('.search-bar_box');
  const button = document.querySelector('#search-btn');
  button.addEventListener('click', () => {
    fetchSearchProducts(text.value);
    text.value = '';
  });
}

window.onload = function onload() {
  fetchSearchProducts('computador');
  // addToCartButton(); POR QUI NAO FUNCIONA SEM O TIMEOUT ?
  // setTimeout(addToCartButton, 1500);
  getStorage();
  clearCart();
  totalPrice();
  searchProducts();
  clearSaleProductsList();
};
