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

function getStorage() {
  for (let i = 0; i < localStorage.length; i += 1) {
    const texte = JSON.parse(localStorage.getItem(i));
    console.log(texte.info);
  }
}

function removeItemfromCart(item) {
  const ul = document.querySelector('.cart__items');
  ul.removeChild(item);
  removeItemfromLocalStorage();
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
    const { id, title, thumbnail } = product;
    items.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  addToCartButton();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() {
  fetchSearchProducts('computador');
  // addToCartButton(); POR QUI NAO FUNCIONA SEM O TIMEOUT ?
  // setTimeout(addToCartButton, 1500);
  getStorage();
  // localStorage.clear();
};
