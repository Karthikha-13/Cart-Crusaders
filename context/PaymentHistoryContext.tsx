import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { PaymentMethod } from "./OrderContext";

export type PaymentStatus = "success" | "failed";

export type PaymentTransaction = {
  transactionId: string;
  orderId: string;
  amount: number;
  paymentMethod: Exclude<PaymentMethod, "COD">;
  status: PaymentStatus;
  createdAt: string;
  message: string;
};

type PaymentHistoryContextValue = {
  transactions: PaymentTransaction[];
  isLoading: boolean;
  addTransaction: (transaction: PaymentTransaction) => Promise<void>;
};

const PAYMENT_HISTORY_STORAGE_KEY = "@cart_crusaders_payment_history";

const PaymentHistoryContext = createContext<
  PaymentHistoryContextValue | undefined
>(undefined);

function isPaymentTransactionList(
  value: unknown,
): value is PaymentTransaction[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "transactionId" in item &&
        typeof item.transactionId === "string" &&
        "orderId" in item &&
        typeof item.orderId === "string" &&
        "amount" in item &&
        typeof item.amount === "number" &&
        "paymentMethod" in item &&
        (item.paymentMethod === "Card" ||
          item.paymentMethod === "UPI - Google Pay" ||
          item.paymentMethod === "UPI - Paytm" ||
          item.paymentMethod === "UPI - PhonePe") &&
        "status" in item &&
        (item.status === "success" || item.status === "failed") &&
        "createdAt" in item &&
        typeof item.createdAt === "string" &&
        "message" in item &&
        typeof item.message === "string",
    )
  );
}

export function PaymentHistoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPaymentHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(
          PAYMENT_HISTORY_STORAGE_KEY,
        );

        if (savedHistory) {
          const parsedHistory: unknown = JSON.parse(savedHistory);
          if (!isPaymentTransactionList(parsedHistory)) {
            throw new Error("Saved payment history has an invalid format.");
          }
          if (active) {
            setTransactions(parsedHistory);
          }
        }
      } catch (error) {
        console.error("Failed to load payment history:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadPaymentHistory();

    return () => {
      active = false;
    };
  }, []);

  const addTransaction = async (transaction: PaymentTransaction) => {
    const nextTransactions = [transaction, ...transactions];
    await AsyncStorage.setItem(
      PAYMENT_HISTORY_STORAGE_KEY,
      JSON.stringify(nextTransactions),
    );
    setTransactions(nextTransactions);
  };

  return (
    <PaymentHistoryContext.Provider
      value={{ transactions, isLoading, addTransaction }}
    >
      {children}
    </PaymentHistoryContext.Provider>
  );
}

export function usePaymentHistory() {
  const context = useContext(PaymentHistoryContext);

  if (!context) {
    throw new Error(
      "usePaymentHistory must be used inside PaymentHistoryProvider",
    );
  }

  return context;
}
