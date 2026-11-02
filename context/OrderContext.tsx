import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export type PaymentMethod =
  | "UPI - Google Pay"
  | "UPI - Paytm"
  | "UPI - PhonePe"
  | "Card"
  | "COD";

export type Order = {
  id: string;
  transactionId?: string;
  items: {
    productId: string;
    name: string;
    emoji: string;
    quantity: number;
    price: number;
    detail: string;
  }[];
  address: string;
  phone: string;
  paymentMethod: PaymentMethod | "UPI";
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  createdAt: string;
};

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

const ORDER_STORAGE_KEY = "@cart_crusaders_orders";

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved orders when the app starts.
  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem(ORDER_STORAGE_KEY);

        if (savedOrders && active) {
          const parsedOrders: unknown = JSON.parse(savedOrders);

          if (Array.isArray(parsedOrders)) {
            setOrders(parsedOrders as Order[]);
          }
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
        if (active) {
          setOrders([]);
        }
      } finally {
        if (active) {
          setIsLoaded(true);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  // Persist orders whenever the order history changes.
  useEffect(() => {
    if (!isLoaded) return;

    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error("Failed to save orders:", error);
      }
    };

    saveOrders();
  }, [orders, isLoaded]);

  const addOrder = (order: Order) => {
    setOrders((currentOrders) => [order, ...currentOrders]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used inside OrderProvider");
  }

  return context;
}
