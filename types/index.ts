export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

export interface PaymentSuccessDetails {
  id: string;
  status: string;
  payer: {
    email_address: string;
    payer_id: string;
  };
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
}