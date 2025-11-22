import { IApi } from "../../types";
import {
  IResponse,
  IOrderRequest,
  IOrderResponse
} from "../../types";

export class MyApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IResponse> {
    try {
      const data = await this.api.get<IResponse>("/product/");
      return data;
    } catch (err) {
      console.error("Произошла ошибка", err);
      throw err;
    }
  }

  async sendOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    try {
      const response = await this.api.post<IOrderResponse>(
        "/order/",
        orderData
      );
      console.log("Заказ успешно создан:", response);
      return response;
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);
      throw err;
    }
  }
}    
