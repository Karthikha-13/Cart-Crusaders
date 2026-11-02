import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "../../context/OrderContext";

export default function OrdersScreen() {
  const { orders } = useOrders();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>View your grocery order history</Text>

        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>
              Your placed orders will appear here.
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderLabel}>ORDER ID</Text>
                  <Text style={styles.orderId}>{order.id}</Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <Text style={styles.date}>
                {new Date(order.createdAt).toLocaleString()}
              </Text>

              <View style={styles.divider} />

              {order.items.map((item) => (
                <View key={item.productId} style={styles.productRow}>
                  <Text style={styles.productEmoji}>{item.emoji}</Text>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDetail}>
                      {item.detail} · Qty: {item.quantity}
                    </Text>
                  </View>

                  <Text style={styles.productPrice}>
                    ₹{item.price * item.quantity}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <Text style={styles.info}>Payment: {order.paymentMethod}</Text>
              <Text style={styles.info}>
                Transaction ID:{" "}
                {order.transactionId ??
                  (order.paymentMethod === "COD"
                    ? "Not applicable (Cash on Delivery)"
                    : "Unavailable")}
              </Text>
              <Text style={styles.info}>Delivery address: {order.address}</Text>
              <Text style={styles.info}>Phone: {order.phone}</Text>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalPrice}>₹{order.total}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F3",
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#183D2B",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B786E",
    marginTop: 6,
    marginBottom: 22,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#183D2B",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B786E",
    marginTop: 8,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E4EAE2",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderLabel: {
    fontSize: 11,
    color: "#778078",
    fontWeight: "600",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: "#183D2B",
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#E2F4E5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#23733C",
    fontSize: 12,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    color: "#7A837C",
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E9EEE7",
    marginVertical: 14,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productEmoji: {
    fontSize: 27,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#26382B",
  },
  productDetail: {
    fontSize: 12,
    color: "#778078",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#183D2B",
  },
  info: {
    fontSize: 13,
    color: "#536056",
    marginBottom: 8,
    lineHeight: 19,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#183D2B",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#23733C",
  },
});
