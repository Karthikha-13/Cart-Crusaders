import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderSuccessScreen() {
  const { orderId, total, transactionId } = useLocalSearchParams<{
    orderId?: string;
    total?: string;
    transactionId?: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Order Placed!</Text>

        <Text style={styles.description}>
          Thank you for shopping with Cart Crusaders.
        </Text>

        <View style={styles.orderCard}>
          <Text style={styles.label}>ORDER REFERENCE</Text>
          <Text style={styles.orderId}>{orderId || "DEMO-ORDER"}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>ORDER TOTAL</Text>
          <Text style={styles.total}>₹{total || "0"}</Text>

          {transactionId ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.label}>TRANSACTION ID</Text>
              <Text style={styles.transactionId}>{transactionId}</Text>
            </>
          ) : null}

          <View style={styles.status}>
            <Text style={styles.statusText}>Payment confirmed</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.primaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          This order and its transaction ID are saved on this device.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F4",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#DDEED6",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    fontSize: 48,
    color: "#277642",
    fontWeight: "800",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#204A2C",
    textAlign: "center",
    marginTop: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#687568",
    textAlign: "center",
    marginTop: 10,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#E8EDE5",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#788378",
    letterSpacing: 1,
  },
  orderId: {
    fontSize: 19,
    fontWeight: "800",
    color: "#243A28",
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8EDE5",
    marginVertical: 20,
  },
  total: {
    fontSize: 28,
    fontWeight: "800",
    color: "#277642",
    marginTop: 8,
  },
  transactionId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#243A28",
    marginTop: 8,
  },
  status: {
    backgroundColor: "#F0F7ED",
    padding: 12,
    borderRadius: 10,
    marginTop: 18,
  },
  statusText: {
    color: "#277642",
    fontWeight: "700",
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: "#277642",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  note: {
    color: "#788378",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 17,
  },
});
