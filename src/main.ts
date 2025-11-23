import "./scss/styles.scss";
import { Products } from "./components/base/Models/Products";
import { Cart } from "./components/base/Models/Cart";
import { Buyer } from "./components/base/Models/Buyer";
import { Api } from "./components/base/Api";
import { MyApi } from "./components/base/MyApi";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

const apiClient = new Api(API_URL);
const api = new MyApi(apiClient);

console.log("Проверка методов каталога:");

const productsModel = new Products();
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

productsModel.product = "c101ab44-ed99-4a54-990d-47aa2bb4e7d9";
console.log('Выбранный продукт:', productsModel.product);

console.log("Проверка методов корзины");

const cartModel = new Cart();

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

cartModel.add(productsModel.products[0]);
cartModel.add(productsModel.products[3])


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

buyerModel.replace();

console.log(buyerModel.buyer);
console.log(buyerModel.validation());

buyerModel.address = "     ";
buyerModel.email = "     ";
buyerModel.phone = "     ";
console.log(buyerModel.validation());

console.log('Проверка отправки заказа:');

buyerModel.address = "Комсомольская, 5";
buyerModel.email = "typescript@gmail.com";
buyerModel.payment = "card";
buyerModel.phone = "89501234567";
console.log('Товары в корзине:', buyerModel.buyer);


