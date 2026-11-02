import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PaymentTransaction,
  usePaymentHistory,
} from "../../context/PaymentHistoryContext";

function statusColors(status: PaymentTransaction["status"]) {
  return status === "success"
    ? { backgroundColor: "#E2F4E5", color: "#23733C" }
    : { backgroundColor: "#FDE9E7", color: "#B42318" };
}

export default function PaymentsScreen() {
  const { transactions, isLoading } = usePaymentHistory();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Payment History</Text>
        <Text style={styles.subtitle}>Your locally saved payment attempts</Text>

        <View style={styles.demoNote}>
          <Text style={styles.demoNoteText}>
            Card and UPI results are simulated. No real money is charged.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            color="#277642"
            size="large"
            style={styles.loader}
          />
        ) : transactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💳</Text>
            <Text style={styles.emptyTitle}>No payments yet</Text>
            <Text style={styles.emptyText}>
              Card and UPI payment attempts will appear here.
            </Text>
          </View>
        ) : (
          transactions.map((transaction) => {
            const colors = statusColors(transaction.status);
            return (
              <View
                key={transaction.transactionId}
                style={styles.transactionCard}
              >
                <View style={styles.header}>
                  <View>
                    <Text style={styles.label}>AMOUNT</Text>
                    <Text style={styles.amount}>₹{transaction.amount}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: colors.backgroundColor },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: colors.color }]}>
                      {transaction.status === "success"
                        ? "Successful"
                        : "Failed"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.date}>
                  {new Date(transaction.createdAt).toLocaleString()}
                </Text>
                <View style={styles.divider} />

                <Text style={styles.info}>
                  <Text style={styles.infoLabel}>Transaction ID: </Text>
                  {transaction.transactionId}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.infoLabel}>Order reference: </Text>
                  {transaction.orderId}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.infoLabel}>Payment method: </Text>
                  {transaction.paymentMethod}
                </Text>
                <Text style={styles.message}>{transaction.message}</Text>
              </View>
            );
          })
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
    marginBottom: 18,
  },
  demoNote: {
    backgroundColor: "#FFF7E5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3DEAE",
    padding: 12,
    marginBottom: 16,
  },
  demoNoteText: {
    color: "#735515",
    fontSize: 12,
    lineHeight: 18,
  },
  loader: {
    marginTop: 40,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    marginTop: 12,
  },
  emptyEmoji: {
    fontSize: 44,
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
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E4EAE2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#778078",
    fontSize: 11,
    fontWeight: "700",
  },
  amount: {
    color: "#183D2B",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  date: {
    color: "#7A837C",
    fontSize: 12,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E9EEE7",
    marginVertical: 12,
  },
  info: {
    color: "#536056",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 5,
  },
  infoLabel: {
    color: "#26382B",
    fontWeight: "700",
  },
  message: {
    color: "#6B786E",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
});
