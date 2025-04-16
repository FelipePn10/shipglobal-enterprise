import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: ObjectId;
  userId: number;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'transfer' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  payoutId?: string;
  refundId?: string;
  description?: string;
  metadata?: {
    mysqlTransactionId?: number;
    mysqlUserId?: number;
    originalPaymentIntentId?: string;
    targetCurrency?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id?: ObjectId;
  userId: number;
  companyId?: number;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    currency: string;
  }>;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  transactionId?: ObjectId;
  shippingAddress?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  billingAddress?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}