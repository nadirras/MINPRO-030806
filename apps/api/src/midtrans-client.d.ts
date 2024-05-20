declare module 'midtrans-client' {
  class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    createTransaction(parameter: object): Promise<any>;
    transaction: {
      notification(body: object): Promise<any>;
      status(orderId: string): Promise<any>;
    };
  }

  class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    charge(parameter: object): Promise<any>;
    transaction: {
      status(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
      expire(orderId: string): Promise<any>;
    };
  }

  const midtransClient: {
    Snap: typeof Snap;
    CoreApi: typeof CoreApi;
  };

  export = midtransClient;
}
