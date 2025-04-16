declare namespace NodeJS {
    interface ProcessEnv {
      RUNTIME_ENV?: 'node' | 'edge';
    }
  }

  
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      MONGODB_DATABASE: string;
    }
  }
}

declare module '@/types/balance' {
  interface BalanceData {
    [currency: string]: {
      amount: number;
      lastUpdated: string;
    };
  }

  interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'refund';
    amount: number;
    currency: CurrencyCode;
    date: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    description?: string;
    paymentIntentId?: string;
    targetCurrency?: CurrencyCode;
    mongoId?: string;
    metadata?: Record<string, any>;
  }

  type CurrencyCode = 'USD' | 'EUR' | 'CNY' | 'JPY' | 'BRL';
  type PaymentCurrency = 'USD' | 'EUR' | 'CNY' | 'JPY' | 'BRL';
}

declare module '@/lib/mongoModels' {



  interface TransactionMetadata {
    mysqlTransactionId?: number;
    mysqlUserId: number;
    paymentIntentId?: string;
    refundId?: string;
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

  interface OrderItem {
    productId: string;
    sku: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    //currency: CurrencyCode;
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
}

export {};