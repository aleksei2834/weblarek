import "./scss/styles.scss";
import { Products } from "./components/base/Models/Products";
import { Cart } from "./components/base/Models/Cart";
import { Buyer } from "./components/base/Models/Buyer";
import { Api } from "./components/base/Api";
import { MyApi } from "./components/base/MyApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";
import { Header } from "./components/views/Header";
import { cloneTemplate, ensureAllElements, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Gallery } from "./components/views/Gallery";
import { Basket } from "./components/views/Basket";
import { Modal } from "./components/views/Modal";
import { CardCatalog } from "./components/views/CardCatalog";
import { Card } from "./components/views/Card";
import { Component } from "./components/base/Component";
import { CardPreview } from "./components/views/CardPreview";
import { IProduct, TPayment } from "./types";
import { CardBasket } from "./components/views/CardBasket";
import { Order } from "./components/views/Order";

const apiClient = new Api(API_URL);
const api = new MyApi(apiClient);
const events = new EventEmitter;

console.log("Проверка методов каталога:");

const productsModel = new Products(events);
productsModel.products = apiProducts.items
api.getProducts()
  .then(products => {
    console.log('Товары с сервера:', products);
    productsModel.products = products.items;
    console.log('Товары:', productsModel.products);
  })
  .catch(err => {
    console.log('Ошибка при получении товаров:', err);
  }) 
console.log('Товары:', productsModel.products);

// productsModel.product = "c101ab44-ed99-4a54-990d-47aa2bb4e7d9";
// console.log('Выбранный продукт:', productsModel.product);

console.log("Проверка методов корзины");

const cartModel = new Cart(events);

cartModel.add(productsModel.products[1]);
cartModel.add(productsModel.products[3]);
cartModel.add(productsModel.products[4]);
cartModel.add(productsModel.products[6]);
console.log('Продукты в корзине:', cartModel.products);
console.log('Количество товаров в корзине:', cartModel.total());
console.log('Общая стоимость корзины:', cartModel.totalSum());
console.log(cartModel.isAvailable("Наличие" + "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
console.log(cartModel.isAvailable("Наличие" + "854cef69-976d-4c2a-a18c-2aa45046c390"));

cartModel.delete(productsModel.products[1]);
cartModel.delete(productsModel.products[4]);
console.log(cartModel.products);
console.log(cartModel.total());
console.log(cartModel.totalSum());

cartModel.replace();
console.log(cartModel.products);
console.log(cartModel.total());
console.log(cartModel.totalSum());
cartModel.replace();

console.log("Проверка методов покупателя");

const buyerModel = new Buyer(events);
// buyerModel.address = "Комсомольская, 5";
// buyerModel.email = "typescript@gmail.com";

// console.log(buyerModel.buyer);
// console.log(buyerModel.validation());

// buyerModel.payment = "card";
// buyerModel.phone = "89501234567";

// console.log(buyerModel.buyer);
// console.log(buyerModel.validation());

// cartModel.add(productsModel.products[0]);
// cartModel.add(productsModel.products[3])
// cartModel.replace();

// api.sendOrder({...buyerModel.buyer,
//                total: cartModel.totalSum(),
//                items: cartModel.products.map(item => item.id)})
//                .then(products => {
//                 console.log("ID заказа:", products.id)
//                 console.log("Общая сумма заказа:", products.total);
                
//                })
//                .catch(err => {
//                 console.error("Ошибка заказа:", err)
//                })

buyerModel.replace();

console.log(buyerModel.buyer);
console.log(buyerModel.validation());

buyerModel.address = "     ";
buyerModel.email = "     ";
buyerModel.phone = "     ";
console.log(buyerModel.validation());

console.log('Проверка отправки заказа:');

// buyerModel.address = "Комсомольская, 5";
// buyerModel.email = "typescript@gmail.com";
// buyerModel.payment = "card";
// buyerModel.phone = "89501234567";
// console.log('Товары в корзине:', buyerModel.buyer);

// Экземпляры классов

const header = new Header(events, ensureElement('.header'));
const modal = new Modal(events, ensureElement('.modal'));
const gallery = new Gallery(ensureElement('.gallery'));
const basket = new Basket(events, cloneTemplate('#basket'));
const cardBasket = new CardBasket(events, cloneTemplate('#card-basket'));

// Модальное окно
events.on('modal:close', () => {
  modal.close();
})

// Header
header.render();
events.on('basket:open', () => {
  const cards = cartModel.products.map((product, idx) => {
    // 1. Клонируем шаблон
    const template = cloneTemplate('#card-basket');

    // 2. Создаём карточку с этим клоном
    const cardInstance = new CardBasket(events, template);

    // 3. Заполняем данными
    cardInstance.render(product);

    // 4. Проставляем индекс вручную
    const indexElem = template.querySelector('.basket__item-index');
    if (indexElem) indexElem.textContent = String(idx + 1);

    return template;
  });
  
  basket.items = cards;
  basket.price = cartModel.totalSum();
  modal.content = basket.render();
  modal.open();
})

// Обработчик изменения каталога
events.on('catalog:changed', () => {
  console.log('Каталог изменился');
  // Слушатель клика по карточке в каталоге
  const itemCards = productsModel.products.map((item) => {
    item.image = `${CDN_URL}/${item.image}`
    const card = new CardCatalog(cloneTemplate('#card-catalog'),
    {onClick: () => events.emit('card:select', item)});
    return card.render(item);
  });
  gallery.render({catalog: itemCards});
})

// Сохранение выбранной карточки в модель данных
events.on('card:select', (item: IProduct) => {
  if (item) {
    productsModel.product = item.id;
  }
})



// Рендер выбранной карточки
events.on('card:open', () => {
  const product = productsModel.product;
  if (!product) return;

  const template = cloneTemplate('#card-preview');

  const cardPreview = new CardPreview(events, template);
  cardPreview.render(product);
  if (product.price == null) {
    cardPreview.button = 'Недоступно';
    cardPreview.disableButton();
  }
  if (cartModel.products.includes(product)) {
    cardPreview.button = 'Удалить из корзины'
  }
  if (!cartModel.products.includes(product)) {
    cardPreview.button = 'Купить'
  }

  modal.content = template;
  modal.open();
})

// Нажатие на кнопку в карточке
events.on('card:basket', () => {
  if (!productsModel.product) return;
  if (cartModel.products.includes(productsModel.product)) {
    cartModel.delete(productsModel.product);
  } else {
    cartModel.add(productsModel.product);
  }
  events.emit('basket:changed');
  modal.close()
})

// Изменение корзины
events.on('basket:changed', () => {
  header.counter = cartModel.total();
})

// Оформление покупки

events.on('card:delete', (cardElement: HTMLElement) => {

  const index = ensureElement('.basket__item-index', cardElement).textContent;
  
  cartModel.delete(cartModel.products[Number(index) - 1]);
  console.log(cartModel.products);
})

events.on('card:deleted', () => {
  events.emit('basket:open')
})

events.on('basket:submit', () => {
  const order = new Order(events, cloneTemplate('#order'));
  modal.content = order.render();
})

events.on('button:selected', (button) => {
  buyerModel.payment = button.selectedButton;  
})

events.on('payment:selected', () => {
  const pay = buyerModel.buyer.payment;
  const buttons = ensureAllElements<HTMLButtonElement>('.button_alt');
  buttons.forEach(button => {
    if (button.name == pay) {
      button.classList.add('button_alt-active');
      console.log(button);
    }
  })
})