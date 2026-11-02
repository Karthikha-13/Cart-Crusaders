import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { Order, useOrders } from "../context/OrderContext";
import {
  PaymentTransaction,
  usePaymentHistory,
} from "../context/PaymentHistoryContext";

type PaymentChoice = "UPI" | "Card" | "COD";
type UpiApp = "Google Pay" | "Paytm" | "PhonePe";

const upiApps: {
  name: UpiApp;
  logo: number;
  accessibilityLabel: string;
}[] = [
  {
    name: "Google Pay",
    logo: require("../assets/images/gpay.png"),
    accessibilityLabel: "Google Pay logo",
  },
  {
    name: "Paytm",
    logo: require("../assets/images/paytm.png"),
    accessibilityLabel: "Paytm logo",
  },
  {
    name: "PhonePe",
    logo: require("../assets/images/phonepe.png"),
    accessibilityLabel: "PhonePe logo",
  },
];

const upiPaymentMethods: Record<
  UpiApp,
  Exclude<Order["paymentMethod"], "COD" | "UPI">
> = {
  "Google Pay": "UPI - Google Pay",
  Paytm: "UPI - Paytm",
  PhonePe: "UPI - PhonePe",
};

function isFutureExpiry(value: string) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  return (
    year > now.getFullYear() ||
    (year === now.getFullYear() && month >= now.getMonth() + 1)
  );
}

export default function CheckoutScreen() {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addTransaction } = usePaymentHistory();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentChoice>("COD");
  const [upiApp, setUpiApp] = useState<UpiApp>("Google Pay");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryCharge = totalPrice >= 499 ? 0 : 30;
  const finalTotal = totalPrice + deliveryCharge;

  const placeOrder = async () => {
    setPaymentError(null);

    if (items.length === 0) {
      Alert.alert("Empty Cart", "Please add products before placing an order.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Address Required", "Please enter your delivery address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit Indian mobile number.",
      );
      return;
    }

    if (paymentMethod === "Card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (!cardholderName.trim()) {
        setPaymentError("Enter the name shown on your card.");
        return;
      }
      if (!/^\d{13,19}$/.test(digits)) {
        setPaymentError("Enter a card number with 13 to 19 digits.");
        return;
      }
      if (!isFutureExpiry(cardExpiry.trim())) {
        setPaymentError("Enter a valid future expiry date in MM/YY format.");
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        setPaymentError("Enter a valid 3- or 4-digit CVV.");
        return;
      }
    }

    setIsProcessing(true);
    const orderId = `CC${Date.now().toString().slice(-8)}`;
    const selectedPaymentMethod =
      paymentMethod === "UPI" ? upiPaymentMethods[upiApp] : paymentMethod;
    let transactionId: string | undefined;

    if (paymentMethod !== "COD") {
      transactionId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;
      const succeeded = Math.random() < 0.8;
      const transaction: PaymentTransaction = {
        transactionId,
        orderId,
        amount: finalTotal,
        paymentMethod:
          paymentMethod === "UPI" ? upiPaymentMethods[upiApp] : "Card",
        status: succeeded ? "success" : "failed",
        createdAt: new Date().toISOString(),
        message: succeeded
          ? "Payment completed successfully."
          : "Payment was declined. No money was charged.",
      };

      try {
        await addTransaction(transaction);
      } catch (error) {
        console.error("Failed to save payment transaction:", error);
        setPaymentError(
          "We couldn't save this payment attempt. Please try again.",
        );
        setIsProcessing(false);
        return;
      }

      if (!succeeded) {
        setPaymentError(
          `Payment failed. Transaction ID: ${transactionId}. Your cart has been kept; try again or view Payment History.`,
        );
        setIsProcessing(false);
        return;
      }
    }

    const order: Order = {
      id: orderId,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        emoji: product.emoji,
        quantity,
        price: product.price,
        detail: product.detail,
      })),
      address: address.trim(),
      phone: phone.trim(),
      paymentMethod: selectedPaymentMethod,
      transactionId,
      subtotal: totalPrice,
      deliveryCharge,
      total: finalTotal,
      status: "Placed",
      createdAt: new Date().toISOString(),
    };

    // Save the order before clearing the cart.
    addOrder(order);
    clearCart();

    router.replace({
      pathname: "/order-success",
      params: {
        orderId,
        total: String(finalTotal),
        transactionId: transactionId ?? "",
      },
    });
    setIsProcessing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹ Back to Cart</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Complete your grocery order</Text>

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Delivery Address</Text>

          <Text style={styles.label}>Full delivery address</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="House no., street, area, city, PIN code"
            placeholderTextColor="#899389"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor="#899389"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Order Summary</Text>

          {items.map(({ product, quantity }) => (
            <View key={product.id} style={styles.orderItem}>
              <Text style={styles.itemEmoji}>{product.emoji}</Text>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{product.name}</Text>
                <Text style={styles.muted}>
                  {product.detail} × {quantity}
                </Text>
              </View>

              <Text style={styles.itemPrice}>₹{product.price * quantity}</Text>
            </View>
          ))}

          <View style={styles.separator} />

          <View style={styles.priceRow}>
            <Text style={styles.muted}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{totalPrice}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.muted}>Delivery charge</Text>
            <Text style={styles.priceValue}>
              {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total amount</Text>
            <Text style={styles.totalValue}>₹{finalTotal}</Text>
          </View>

          <Text style={styles.deliveryNote}>
            Free delivery on orders of ₹499 or more.
          </Text>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Payment Method</Text>

          {(
            [
              { value: "UPI", emoji: "📱", description: "Pay using UPI" },
              {
                value: "Card",
                emoji: "💳",
                description: "Credit or debit card",
              },
              { value: "COD", emoji: "💵", description: "Pay when delivered" },
            ] as const
          ).map((method) => {
            const selected = paymentMethod === method.value;

            return (
              <TouchableOpacity
                key={method.value}
                style={[
                  styles.paymentOption,
                  selected && styles.selectedPayment,
                ]}
                onPress={() => setPaymentMethod(method.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.paymentEmoji}>{method.emoji}</Text>

                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentName}>
                    {method.value === "COD" ? "Cash on Delivery" : method.value}
                  </Text>
                  <Text style={styles.muted}>{method.description}</Text>
                </View>

                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {paymentMethod === "UPI" && (
            <View style={styles.paymentDetailsPanel}>
              <Text style={styles.label}>Choose your UPI app</Text>
              {upiApps.map((app) => {
                const selected = upiApp === app.name;
                return (
                  <TouchableOpacity
                    key={app.name}
                    style={[
                      styles.paymentOption,
                      selected && styles.selectedPayment,
                    ]}
                    onPress={() => setUpiApp(app.name)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <View style={styles.upiLogoContainer}>
                      <Image
                        source={app.logo}
                        style={styles.upiLogo}
                        resizeMode="contain"
                        accessibilityLabel={app.accessibilityLabel}
                      />
                    </View>
                    <Text style={styles.paymentName}>{app.name}</Text>
                    <View
                      style={[styles.radio, selected && styles.radioSelected]}
                    >
                      {selected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {paymentMethod === "Card" && (
            <View style={styles.paymentDetailsPanel}>
              <Text style={styles.label}>Name on card</Text>
              <TextInput
                style={styles.input}
                placeholder="Cardholder name"
                placeholderTextColor="#899389"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
                autoComplete="off"
                textContentType="none"
              />

              <Text style={styles.label}>Card number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#899389"
                value={cardNumber}
                onChangeText={(value) =>
                  setCardNumber(value.replace(/\D/g, "").slice(0, 19))
                }
                keyboardType="number-pad"
                autoComplete="off"
                textContentType="none"
                maxLength={19}
              />

              <View style={styles.cardInputRow}>
                <View style={styles.cardInputColumn}>
                  <Text style={styles.label}>Expiry date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#899389"
                    value={cardExpiry}
                    onChangeText={(value) =>
                      setCardExpiry(value.replace(/[^\d/]/g, "").slice(0, 5))
                    }
                    keyboardType="numbers-and-punctuation"
                    autoComplete="off"
                    maxLength={5}
                  />
                </View>
                <View style={styles.cardInputColumn}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="CVV"
                    placeholderTextColor="#899389"
                    value={cardCvv}
                    onChangeText={(value) =>
                      setCardCvv(value.replace(/\D/g, "").slice(0, 4))
                    }
                    keyboardType="number-pad"
                    secureTextEntry
                    autoComplete="off"
                    textContentType="none"
                    maxLength={4}
                  />
                </View>
              </View>
              <Text style={styles.secureNote}>
                Card details are not stored or sent to a payment provider.
              </Text>
            </View>
          )}

          {paymentError && (
            <View>
              <Text accessibilityRole="alert" style={styles.paymentError}>
                {paymentError}
              </Text>
              {paymentError.includes("Transaction ID:") && (
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/payments")}
                  style={styles.historyLink}
                >
                  <Text style={styles.historyLinkText}>
                    View Payment History
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* <Text style={styles.paymentNote}>
            Card and UPI results are randomly simulated for this demo. No real
            payment will be made.
          </Text> */}
        </View>

        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            items.length === 0 && styles.disabledButton,
            isProcessing && styles.disabledButton,
          ]}
          onPress={placeOrder}
          disabled={items.length === 0 || isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.placeOrderText}>
            {isProcessing
              ? "Processing Payment..."
              : `${paymentMethod === "COD" ? "Place Order" : "Pay"} · ₹${finalTotal}`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          orders are saved on this device; no real payment is processed.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F4",
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 12,
  },
  backText: {
    color: "#277642",
    fontWeight: "700",
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#204A2C",
  },
  subtitle: {
    fontSize: 13,
    color: "#788378",
    marginTop: 6,
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8EDE5",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#243A28",
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#435546",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#F8FAF6",
    borderWidth: 1,
    borderColor: "#E1E8DD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#243A28",
  },
  cardInputRow: {
    flexDirection: "row",
    gap: 12,
  },
  cardInputColumn: {
    flex: 1,
  },
  addressInput: {
    minHeight: 85,
    textAlignVertical: "top",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#293B2C",
  },
  muted: {
    fontSize: 12,
    color: "#788378",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#293B2C",
  },
  separator: {
    height: 1,
    backgroundColor: "#E8EDE5",
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#293B2C",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#243A28",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#277642",
  },
  deliveryNote: {
    fontSize: 11,
    color: "#687568",
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8EDE5",
    marginBottom: 10,
  },
  selectedPayment: {
    borderColor: "#277642",
    backgroundColor: "#F0F7ED",
  },
  paymentEmoji: {
    fontSize: 25,
    marginRight: 12,
  },
  upiLogoContainer: {
    width: 68,
    height: 48,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  upiLogo: {
    width: 64,
    height: 44,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentDetailsPanel: {
    marginTop: 4,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAF6",
  },
  secureNote: {
    marginTop: 10,
    color: "#687568",
    fontSize: 11,
    lineHeight: 16,
  },
  paymentError: {
    marginTop: 4,
    marginBottom: 10,
    color: "#B42318",
    fontSize: 13,
    lineHeight: 19,
  },
  historyLink: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    marginBottom: 8,
  },
  historyLinkText: {
    color: "#277642",
    fontSize: 13,
    fontWeight: "700",
  },
  paymentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#293B2C",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A5B0A3",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#277642",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#277642",
  },
  paymentNote: {
    fontSize: 11,
    color: "#788378",
    lineHeight: 17,
    marginTop: 4,
  },
  placeOrderButton: {
    backgroundColor: "#277642",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  footerNote: {
    fontSize: 11,
    color: "#788378",
    textAlign: "center",
    marginTop: 14,
  },
});
