import "./scss/styles.scss";
import { Products } from "./components/base/Models/Products";
import { Cart } from "./components/base/Models/Cart";
import { Buyer } from "./components/base/Models/Buyer";
import { Api } from "./components/base/Api";
import { myApi } from "./components/base/Models/myApi";
import { API_URL } from "./utils/constants";

const apiClient = new Api(API_URL);
const api = new myApi(apiClient);

console.log("Проверка методов каталога:");

const productsModel = new Products();

productsModel.products = (await api.getProducts()).items;
console.log(productsModel.products);
productsModel.product = "c101ab44-ed99-4a54-990d-47aa2bb4e7d9";
console.log(productsModel.product);

console.log("Проверка методов корзины");

const cartModel = new Cart();

cartModel.add(productsModel.products[1]);
cartModel.add(productsModel.products[3]);
cartModel.add(productsModel.products[4]);
cartModel.add(productsModel.products[6]);
console.log(cartModel.products);
console.log(cartModel.total());
console.log(cartModel.totalSum());
console.log(cartModel.isAvailable("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
console.log(cartModel.isAvailable("854cef69-976d-4c2a-a18c-2aa45046c390"));

cartModel.delete(productsModel.products[1]);
cartModel.delete(productsModel.products[4]);
console.log(cartModel.products);
console.log(cartModel.total());
console.log(cartModel.totalSum());

cartModel.replace();
console.log(cartModel.products);
console.log(cartModel.total());
console.log(cartModel.totalSum());

console.log("Проверка методов покупателя");

const buyerModel = new Buyer();
buyerModel.address = "Комсомольская, 5";
buyerModel.email = "typescript@gmail.com";

console.log(buyerModel.buyer);
console.log(buyerModel.validation());

buyerModel.payment = "card";
buyerModel.phone = "89501234567";

console.log(buyerModel.buyer);
console.log(buyerModel.validation());

buyerModel.replace();

console.log(buyerModel.buyer);
console.log(buyerModel.validation());

buyerModel.address = "     ";
buyerModel.email = "     ";
buyerModel.phone = "     ";
console.log(buyerModel.validation());

// api.makeOrder({
//   payment: "card",
//   email: "test@test.ru",
//   phone: "+71234567890",
//   address: "Spb Vosstania 1",
//   total: 2200,
//   items: [
//     "854cef69-976d-4c2a-a18c-2aa45046c390",
//     "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
//   ],
// });

console.log('Финальная проверка');
buyerModel.address = "Комсомольская, 5";
buyerModel.email = "typescript@gmail.com";
buyerModel.payment = "card";
buyerModel.phone = "89501234567";
cartModel.replace();
cartModel.add(productsModel.products[0]);
cartModel.add(productsModel.products[3]);
cartModel.add(productsModel.products[5]);

api.sendOrder(api.makeOrder(buyerModel.buyer, cartModel.totalSum(), cartModel.products))