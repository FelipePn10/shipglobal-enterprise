import { ObjectId } from 'mongodb';

export type CurrencyCode = 'USD' | 'EUR' | 'CNY' | 'JPY' | 'BRL';
export type TransactionType = 'deposit' | 'withdrawal' | 'purchase' | 'transfer' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ImportStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'failed';

export interface TransactionMetadata {
  mysqlTransactionId?: number;
  mysqlUserId: number;
  paymentIntentId?: string;
  refundId?: string;
  paymentCurrency?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  location?: {
    country?: string;
    city?: string;
  };
  relatedEntities?: {
    importId?: string;
    orderId?: string;
  };
}

export interface Transaction {
  _id?: ObjectId;
  userId: number;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  status: TransactionStatus;
  description?: string;
  metadata: TransactionMetadata;
  createdAt: Date;
  updatedAt: Date;
}



export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  currency: CurrencyCode;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  customsInfo?: {
    hsCode: string;
    originCountry: string;
  };
}

export interface ImportOrder {
  _id?: ObjectId;
  importId: string;
  userId?: number;
  companyId?: number;
  title: string;
  status: ImportStatus;
  origin: string;
  destination: string;
  progress: number;
  eta?: string;
  items: OrderItem[];
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
  metadata: {
    mysqlImportId?: number;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}