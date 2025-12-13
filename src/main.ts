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
import { OrderSuccess } from "./components/views/OrderSuccess";

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

// Экземпляры классов
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const modal = new Modal(events, ensureElement<HTMLElement>(".modal"));
const gallery = new Gallery(ensureElement(".gallery"));
const basket = new Basket(events, cloneTemplate("#basket"));
const order = new Order(events, cloneTemplate("#order"));
const contacts = new Contacts(events, cloneTemplate("#contacts"));
const orderSuccess = new OrderSuccess(events, cloneTemplate("#success"));

// Модальное окно
events.on("modal:close", () => {
  modal.close();
});

// Header
header.render();
events.on("basket:open", () => {
  modal.content = basket.render()
  modal.open();
});

// Обработчик изменения каталога
events.on("catalog:changed", () => {
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

  const cardPreview = new CardPreview(template, {
    onClick: () => events.emit('card:basket')
  });
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
  // Изменение счетчика корзины
  header.counter = cartModel.total();

  const itemCards = cartModel.products.map((item, idx) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), {
      onClick: () => events.emit("card:delete", item),
    });
    card.index = idx + 1;
    return card.render(item);
  });

  basket.render({ items: itemCards, price: cartModel.totalSum()});

});

events.on('card:delete', (item: IProduct) => {
  if (item) {
    cartModel.delete(item);
  }
})

events.on("basket:submit", () => {
  order.errors = `${buyerModel.validation().payment} ${
    buyerModel.validation().address
  }`;
  modal.content = order.render();
});

events.on("button:selected", (button: { selectedButton: TPayment }) => {
  buyerModel.payment = button.selectedButton;
});

events.on("payment:selected", (payment: { payment: string }) => {
  modal.content = order.render();

  const buttonToActivate = order.paymentButtons.find(
    (btn) => btn.name === payment.payment
  );

  if (buttonToActivate) {
    order.selectedButton = buttonToActivate;
  }

  order.valid =
    buyerModel.validation().address == "" &&
    buyerModel.validation().payment == "";
  order.errors = `${buyerModel.validation().payment} ${
    buyerModel.validation().address
  }`;
});

events.on("address:input", (data: { address: string }) => {
  buyerModel.address = data.address;
});

events.on("address:changed", () => {
  order.addressInput.value = buyerModel.buyer.address;

  order.valid =
    buyerModel.validation().address == "" &&
    buyerModel.validation().payment == "";
  order.errors = `${buyerModel.validation().payment} ${
    buyerModel.validation().address
  }`;
});

events.on("modal:open-contacts", () => {
  contacts.errors = `${buyerModel.validation().email} ${
    buyerModel.validation().phone
  }`;
  modal.content = contacts.render();
});

events.on("email:input", (data: { email: string }) => {
  buyerModel.email = data.email;
});

events.on("email:changed", () => {
  contacts.emailInput.value = buyerModel.buyer.email;

  contacts.valid =
    buyerModel.validation().email === "" &&
    buyerModel.validation().phone === "";
  contacts.errors = `${buyerModel.validation().email} ${
    buyerModel.validation().phone
  }`;
});

events.on("phone:input", (data: { phone: string }) => {
  buyerModel.phone = data.phone;
});

events.on("phone:changed", () => {
  contacts.phoneInput.value = buyerModel.buyer.phone;

  contacts.valid =
    buyerModel.validation().email === "" &&
    buyerModel.validation().phone === "";
  contacts.errors = `${buyerModel.validation().email} ${
    buyerModel.validation().phone
  }`;
});

events.on("button:pay", () => {
  orderSuccess.totalSum = cartModel.totalSum();
  modal.content = orderSuccess.render();

  api.sendOrder({...buyerModel.buyer,
               total: cartModel.totalSum(),
               items: cartModel.products.map(item => item.id)})
               .then(products => {
                console.log("ID заказа:", products.id)
                console.log("Общая сумма заказа:", products.total);

               })
               .catch(err => {
                console.error("Ошибка заказа:", err)
               })
});



events.on("button:success", () => {
  cartModel.replace();
  modal.close();
});
