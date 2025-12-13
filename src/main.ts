import "./scss/styles.scss";
import { Products } from "./components/base/Models/Products";
import { Cart } from "./components/base/Models/Cart";
import { Buyer } from "./components/base/Models/Buyer";
import { Api } from "./components/base/Api";
import { MyApi } from "./components/base/MyApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";
import { Header } from "./components/views/Header";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Gallery } from "./components/views/Gallery";
import { Basket } from "./components/views/Basket";
import { Modal } from "./components/views/Modal";
import { CardCatalog } from "./components/views/CardCatalog";
import { CardPreview } from "./components/views/CardPreview";
import { IProduct, TPayment } from "./types";
import { CardBasket } from "./components/views/CardBasket";
import { Order } from "./components/views/Order";
import { Contacts } from "./components/views/Contacts";

// Api
const apiClient = new Api(API_URL);
const api = new MyApi(apiClient);
const events = new EventEmitter();

// Создание экземпляров классов модели
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

productsModel.products = apiProducts.items;
api
  .getProducts()
  .then((products) => {
    console.log("Товары с сервера:", products);
    productsModel.products = products.items;
    console.log("Товары:", productsModel.products);
  })
  .catch((err) => {
    console.log("Ошибка при получении товаров:", err);
  });


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

// Экземпляры классов
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const modal = new Modal(events, ensureElement<HTMLElement>(".modal"));
const gallery = new Gallery(ensureElement(".gallery"));
const basket = new Basket(events, cloneTemplate("#basket"));
const cardBasket = new CardBasket(events, cloneTemplate("#card-basket"));
const order = new Order(events, cloneTemplate('#order'));
const contacts = new Contacts(events, cloneTemplate('#contacts'))

// Модальное окно
events.on("modal:close", () => {
  modal.close();
});

// Header
header.render();
events.on("basket:open", () => {
  const cards = cartModel.products.map((product, idx) => {
    const template = cloneTemplate("#card-basket");
    const cardInstance = new CardBasket(events, template);
    cardInstance.render(product);
    const indexElem = template.querySelector(".basket__item-index");
    if (indexElem) indexElem.textContent = String(idx + 1);

    return template;
  });

  basket.items = cards;
  basket.price = cartModel.totalSum();
  modal.content = basket.render();
  modal.open();
});

// Обработчик изменения каталога
events.on("catalog:changed", () => {
  console.log("Каталог изменился");
  // Слушатель клика по карточке в каталоге
  const itemCards = productsModel.products.map((item) => {
    item.image = `${CDN_URL}/${item.image}`;
    const card = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render(item);
  });
  gallery.render({ catalog: itemCards });
});

// Сохранение выбранной карточки в модель данных
events.on("card:select", (item: IProduct) => {
  if (item) {
    productsModel.product = item.id;
  }
});

// Рендер выбранной карточки
events.on("card:open", () => {
  const product = productsModel.product;
  if (!product) return;

  const template = cloneTemplate("#card-preview");

  const cardPreview = new CardPreview(events, template);
  cardPreview.render(product);
  if (product.price == null) {
    cardPreview.button = "Недоступно";
    cardPreview.disableButton();
  }
  if (cartModel.products.includes(product)) {
    cardPreview.button = "Удалить из корзины";
  }
  if (!cartModel.products.includes(product)) {
    cardPreview.button = "Купить";
  }

  basket.buttonDisabled();
  modal.content = template;
  modal.open();
});

// Нажатие на кнопку в карточке
events.on("card:basket", () => {
  if (!productsModel.product) return;
  if (cartModel.products.includes(productsModel.product)) {
    cartModel.delete(productsModel.product);
  } else {
    cartModel.add(productsModel.product);
  }
  events.emit("basket:changed");
  modal.close();
});

// Изменение корзины
events.on("basket:changed", () => {
  header.counter = cartModel.total();
});

// Оформление покупки

events.on("card:delete", (cardElement: HTMLElement) => {
  const index = ensureElement(".basket__item-index", cardElement).textContent;

  cartModel.delete(cartModel.products[Number(index) - 1]);
  console.log(cartModel.products);
});

events.on("card:deleted", () => {
  events.emit("basket:open");
});

events.on("basket:submit", () => {
  const order = new Order(events, cloneTemplate("#order"));

  modal.content = order.render();
});

events.on("button:selected", (button: {selectedButton: TPayment}) => {
  buyerModel.payment = button.selectedButton;
  console.log(buyerModel.buyer);
});

events.on("payment:selected", (payment: {payment: string}) => {
  
  modal.content = order.render();


  const buttonToActivate = order.paymentButtons.find(
    (btn) => btn.name === payment.payment
  );

  if (buttonToActivate) {
    order.selectedButton = buttonToActivate;
  }

  order.valid = (buyerModel.validation().address == undefined
  && buyerModel.validation().payment == undefined);
});

events.on('address:input', (data: {address: string}) => {
  buyerModel.address = data.address;
  console.log(buyerModel.buyer);
})

events.on('address:changed', () => {
  order.addressInput.value = buyerModel.buyer.address;
  
  order.valid = (buyerModel.validation().address == undefined
  && buyerModel.validation().payment == undefined);
})

events.on('modal:open-contacts', () => {
  const contacts = new Contacts(events, cloneTemplate('#contacts'))
  modal.content = contacts.render();
  console.log(contacts.render());
  
}) 

events.on('email:input', (data: {email: string}) => {
  buyerModel.email = data.email;
})

events.on('email:changed', () => {
  contacts.emailInput.value = buyerModel.buyer.email;

  contacts.valid = (buyerModel.validation().email === undefined
  && buyerModel.validation().phone === undefined);
})

events.on('phone:input', (data: {phone: string}) => {
  buyerModel.phone = data.phone;
  console.log(buyerModel.validation());
  
})

events.on('phone:changed', () => {
  contacts.phoneInput.value = buyerModel.buyer.phone;

  contacts.valid = (buyerModel.validation().email === undefined
  && buyerModel.validation().phone === undefined);
  console.log(contacts.formButton);
  contacts.render()
  
})
