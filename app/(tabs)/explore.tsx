import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useProductCatalog } from "../../context/ProductCatalogContext";

type Category = {
  name: string;
  emoji: string;
  color: string;
};

const categories: Category[] = [
  { name: "Fruits", emoji: "🍎", color: "#FFF0E7" },
  { name: "Vegetables", emoji: "🥦", color: "#E7F5E8" },
  { name: "Dairy", emoji: "🥛", color: "#E8F2FF" },
  { name: "Bakery", emoji: "🍞", color: "#FFF3D9" },
  { name: "Snacks", emoji: "🍪", color: "#F8E9F5" },
];

export default function ExploreScreen() {
  const { addToCart, items } = useCart();
  const { products } = useProductCatalog();

  const openCategory = (category: string) => {
    router.push({
      pathname: "/",
      params: { category },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>DISCOVER SOMETHING FRESH</Text>
        <Text style={styles.title}>Explore groceries</Text>
        <Text style={styles.subtitle}>
          Find your everyday essentials in one place.
        </Text>

        <TouchableOpacity
          style={styles.banner}
          activeOpacity={0.9}
          onPress={() => openCategory("Fruits")}
        >
          <View style={styles.bannerText}>
            <Text style={styles.bannerLabel}>FRESH PICKS</Text>
            <Text style={styles.bannerTitle}>Freshness{"\n"}for every day</Text>
            <Text style={styles.bannerAction}>
              Explore fruits <Ionicons name="arrow-forward" size={14} />
            </Text>
          </View>
          <Text style={styles.bannerEmoji}>🥑🍎</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by category</Text>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => openCategory(category.name)}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color },
                ]}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular products</Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.seeAll}>Shop all</Text>
          </TouchableOpacity>
        </View>

        {products.map((product) => {
          const quantity =
            items.find((item) => item.product.id === product.id)?.quantity ?? 0;

          return (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productEmojiBox}>
                <Text style={styles.productEmoji}>{product.emoji}</Text>
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetail}>{product.detail}</Text>
                <Text style={styles.productPrice}>₹{product.price}</Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.8}
                onPress={() => addToCart(product)}
              >
                <Ionicons name="add" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              {quantity > 0 && (
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
          <Text style={styles.cartButtonText}>
            View Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F4",
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#39834C",
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#183D2B",
    marginTop: 7,
  },
  subtitle: {
    fontSize: 14,
    color: "#718075",
    marginTop: 7,
    lineHeight: 21,
  },
  banner: {
    backgroundColor: "#DDEEDC",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  bannerText: {
    flex: 1,
  },
  bannerLabel: {
    color: "#39834C",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  bannerTitle: {
    color: "#183D2B",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 9,
    lineHeight: 30,
  },
  bannerAction: {
    color: "#23733C",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 15,
  },
  bannerEmoji: {
    fontSize: 43,
    marginLeft: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 27,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#183D2B",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "31%",
    alignItems: "center",
    marginBottom: 17,
  },
  categoryIcon: {
    width: 76,
    height: 76,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmoji: {
    fontSize: 34,
  },
  categoryName: {
    color: "#344638",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 9,
  },
  seeAll: {
    color: "#39834C",
    fontSize: 13,
    fontWeight: "700",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EDE5",
  },
  productEmojiBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#F2F6EE",
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: {
    fontSize: 30,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#24392B",
  },
  productDetail: {
    fontSize: 12,
    color: "#7A857C",
    marginTop: 3,
  },
  productPrice: {
    fontSize: 15,
    color: "#23733C",
    fontWeight: "800",
    marginTop: 5,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#39834C",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#183D2B",
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  cartButton: {
    backgroundColor: "#23733C",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    marginTop: 12,
  },
  cartButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
