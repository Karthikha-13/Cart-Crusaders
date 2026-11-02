import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { Product } from "../context/CartContext";
import {
  CATEGORY_EMOJI,
  getProductEmoji,
  PRODUCT_CATEGORIES,
  useProductCatalog,
} from "../context/ProductCatalogContext";

export default function AdminScreen() {
  const { signOut } = useAuth();
  const { products, isLoading, addProduct, storageError } = useProductCatalog();
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Vegetables");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color="#277642" size="large" />
      </SafeAreaView>
    );
  }

  const handleAddProduct = async () => {
    const trimmedName = name.trim();
    const trimmedDetail = detail.trim();
    const numericPrice = Number(price);

    if (
      !trimmedName ||
      !trimmedDetail ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setErrorMessage(
        "Enter a product name, pack size, and a price greater than zero.",
      );
      return;
    }

    setErrorMessage(null);
    setIsSaving(true);

    try {
      await addProduct({
        name: trimmedName,
        detail: trimmedDetail,
        price: numericPrice,
        category,
      });
      setName("");
      setDetail("");
      setPrice("");
    } catch (error) {
      console.error("Failed to save new product:", error);
      setErrorMessage("Could not save this product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Failed to clear admin login state:", error);
      Alert.alert(
        "Unable to log out",
        "Your saved login could not be cleared. Please try again.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>ADMIN DASHBOARD</Text>
              <Text style={styles.title}>Manage products</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => void handleSignOut()}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Log out"
            >
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Add products to the catalog. They will appear in the customer shop
            and Explore page.
          </Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add a product</Text>

            <View style={styles.iconPreview}>
              <Text style={styles.previewEmoji}>
                {getProductEmoji(name, category)}
              </Text>
              <View style={styles.previewInfo}>
                <Text style={styles.previewTitle}>Product icon preview</Text>
                <Text style={styles.previewDetail}>
                  Updates automatically based on the product name.
                </Text>
              </View>
            </View>

            <Text style={styles.label}>Product name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Fresh Strawberries"
              placeholderTextColor="#899389"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryList}>
              {PRODUCT_CATEGORIES.map((item) => {
                const selected = category === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.categoryButton,
                      selected && styles.selectedCategoryButton,
                    ]}
                    onPress={() => setCategory(item)}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text style={styles.categoryEmoji}>
                      {CATEGORY_EMOJI[item]}
                    </Text>
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.selectedCategoryText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Pack size or description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500 g"
              placeholderTextColor="#899389"
              value={detail}
              onChangeText={setDetail}
              returnKeyType="next"
            />

            <Text style={styles.label}>Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 99"
              placeholderTextColor="#899389"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={() => void handleAddProduct()}
            />

            {(errorMessage || storageError) && (
              <Text accessibilityRole="alert" style={styles.error}>
                {errorMessage || storageError}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.addButton,
                isSaving && styles.disabledButton,
              ]}
              onPress={() => void handleAddProduct()}
              disabled={isSaving}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Add product"
            >
              <Text style={styles.addButtonText}>
                {isSaving ? "Saving..." : "+ Add product"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Product catalog</Text>
            <Text style={styles.count}>{products.length} products</Text>
          </View>

          {products.map((product) => (
            <View key={product.id} style={styles.productRow}>
              <View style={styles.productEmojiBox}>
                <Text style={styles.productEmoji}>{product.emoji}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetail}>
                  {product.category} · {product.detail}
                </Text>
              </View>
              <Text style={styles.productPrice}>₹{product.price}</Text>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F8F3",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F8F3",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  eyebrow: {
    color: "#39834C",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 5,
    color: "#183D2B",
    fontSize: 27,
    fontWeight: "800",
  },
  logoutButton: {
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9E5D6",
    backgroundColor: "#FFFFFF",
  },
  logoutText: {
    color: "#277642",
    fontSize: 13,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: "#6B786E",
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E4EAE2",
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    color: "#183D2B",
    fontSize: 18,
    fontWeight: "800",
  },
  iconPreview: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    padding: 12,
    borderRadius: 13,
    backgroundColor: "#F0F6EB",
  },
  previewEmoji: {
    width: 42,
    textAlign: "center",
    fontSize: 32,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    color: "#26382B",
    fontSize: 13,
    fontWeight: "700",
  },
  previewDetail: {
    marginTop: 3,
    color: "#718075",
    fontSize: 11,
  },
  label: {
    marginTop: 16,
    marginBottom: 7,
    color: "#26382B",
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E1E8DE",
    backgroundColor: "#FBFCFA",
    color: "#26382B",
    fontSize: 15,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E4EAE2",
    backgroundColor: "#FFFFFF",
  },
  selectedCategoryButton: {
    borderColor: "#277642",
    backgroundColor: "#EAF4E7",
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    color: "#526052",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#1E5631",
    fontWeight: "800",
  },
  error: {
    marginTop: 12,
    color: "#B42318",
    fontSize: 13,
    lineHeight: 19,
  },
  addButton: {
    minHeight: 50,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#277642",
  },
  disabledButton: {
    opacity: 0.7,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 12,
  },
  count: {
    color: "#778277",
    fontSize: 12,
  },
  productRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9EDE6",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  productEmojiBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F0F6EB",
  },
  productEmoji: {
    fontSize: 25,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: "#293B2C",
    fontSize: 14,
    fontWeight: "700",
  },
  productDetail: {
    marginTop: 4,
    color: "#7C877C",
    fontSize: 12,
  },
  productPrice: {
    color: "#245A32",
    fontSize: 14,
    fontWeight: "800",
  },
});
