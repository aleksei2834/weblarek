import { IProduct } from "../../../types";

export class Products {
  protected _products: IProduct[];
  protected _selected?: IProduct;
  constructor() {
    this._products = this.products;
    this._selected = this.product;
  }

  set products(items: IProduct[]) {
    this._products = items;
  }

  get products(): IProduct[] {
    return this._products;
  }

  set product(id: string) {
    const product = this._products.find((product) => product.id === id);
    this._selected = product;
  }

  get product(): IProduct | undefined {
    return this._selected;
  }
}
