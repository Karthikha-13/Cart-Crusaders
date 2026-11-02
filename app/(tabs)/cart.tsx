import { router } from "expo-router";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";

export default function CartScreen() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    clearCart,
    cartCount,
  } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert(
        "Your cart is empty",
        "Please add groceries before proceeding to checkout.",
      );
      return;
    }

    router.push("/checkout");
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearCart,
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Cart 🛒</Text>

        <Text style={styles.subtitle}>
          {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛍️</Text>

            <Text style={styles.emptyTitle}>Your cart is empty</Text>

            <Text style={styles.emptyDescription}>
              Explore our groceries and add your favourite products.
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.replace("/(tabs)")}
              activeOpacity={0.8}
            >
              <Text style={styles.shopButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map(({ product, quantity }) => (
              <View key={product.id} style={styles.cartItem}>
                <View style={styles.productImage}>
                  <Text style={styles.productEmoji}>{product.emoji}</Text>
                </View>

                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product.name}</Text>

                  <Text style={styles.productDetail}>{product.detail}</Text>

                  <Text style={styles.productPrice}>
                    ₹{product.price * quantity}
                  </Text>

                  <Text style={styles.unitPrice}>
                    ₹{product.price} per item
                  </Text>
                </View>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => decreaseQuantity(product.id)}
                    accessibilityLabel={`Remove one ${product.name}`}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => increaseQuantity(product.id)}
                    accessibilityLabel={`Add one ${product.name}`}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Price Details</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{totalPrice}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery charges</Text>
                <Text style={styles.freeDelivery}>Calculated at checkout</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>₹{totalPrice}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>

              <Text style={styles.checkoutAmount}>₹{totalPrice}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
            >
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </>
        )}
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
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#204A2C",
  },
  subtitle: {
    fontSize: 13,
    color: "#788378",
    marginTop: 6,
    marginBottom: 18,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 350,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#243A28",
    marginTop: 18,
  },
  emptyDescription: {
    fontSize: 13,
    color: "#788378",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: "#277642",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 20,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EDE5",
  },
  productImage: {
    width: 60,
    height: 65,
    borderRadius: 12,
    backgroundColor: "#F0F6EB",
    justifyContent: "center",
    alignItems: "center",
  },
  productEmoji: {
    fontSize: 32,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#293B2C",
  },
  productDetail: {
    fontSize: 11,
    color: "#788378",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#277642",
    marginTop: 6,
  },
  unitPrice: {
    fontSize: 10,
    color: "#788378",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  quantityButton: {
    width: 27,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#E2F0DF",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    color: "#245A32",
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#243A28",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#243A28",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#687568",
    flexShrink: 1,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#293B2C",
  },
  freeDelivery: {
    fontSize: 11,
    color: "#687568",
    flexShrink: 1,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#E8EDE5",
    marginVertical: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#243A28",
  },
  totalPrice: {
    fontSize: 19,
    fontWeight: "800",
    color: "#277642",
  },
  checkoutButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#277642",
    padding: 17,
    borderRadius: 14,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  checkoutAmount: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  clearButton: {
    alignItems: "center",
    padding: 15,
    marginBottom: 20,
  },
  clearButtonText: {
    color: "#B42318",
    fontWeight: "700",
  },
});
