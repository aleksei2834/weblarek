import { IProduct } from "../../../types";
import { CDN_URL } from "../../../utils/constants";
import { IEvents } from "../Events";

export class Products {
  protected _products: IProduct[];
  protected _selected?: IProduct;
  constructor(protected events: IEvents) {
    this._products = this.products;
    this._selected = this.product;
  }

  set products(items: IProduct[]) {
    this._products = items;
    this.events.emit('catalog:changed')
  }

  get products(): IProduct[] {
    return this._products;
  }

  set product(id: string) {
    const product = this._products.find((product) => product.id === id);
    this._selected = product;
    this.events.emit('card:open')
  }

  get product(): IProduct | undefined {
    return this._selected;
  }
}
