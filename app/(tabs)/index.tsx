import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProductCatalog } from "../../context/ProductCatalogContext";

const categories = [
  { name: "All", emoji: "🛒" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Vegetables", emoji: "🥦" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Bakery", emoji: "🍞" },
  { name: "Snacks", emoji: "🍪" },
];

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [locationCoordinates, setLocationCoordinates] = useState<string | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { addToCart, cartCount, items } = useCart();
  const { signOut } = useAuth();
  const { products } = useProductCatalog();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to clear login state:", error);
      Alert.alert(
        "Unable to log out",
        "Your saved login could not be cleared. Please try again.",
      );
    }
  };

  const handleGetLocation = async () => {
    setLocationError(null);
    setIsGettingLocation(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setLocationError(
          permission.canAskAgain
            ? "Allow location access to find your current address."
            : "Location access is blocked. Enable it for Cart Crusaders in your device settings.",
        );
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        mayShowUserSettingsDialog: true,
      });
      const { latitude, longitude } = currentPosition.coords;
      setLocationCoordinates(
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      );
      setLocationAddress(null);

      if (Platform.OS === "web") {
        setLocationAddress("Current GPS position");
        setLocationError(
          "Street address lookup is available in the iOS and Android app. Use these coordinates for the exact web location.",
        );
        return;
      }

      let address: Location.LocationGeocodedAddress | undefined;
      try {
        [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      } catch {
        setLocationError(
          "Your location was found, but we couldn't look up the street address. Use the GPS coordinates or enter your address manually.",
        );
        return;
      }

      if (!address) {
        setLocationError(
          "We found your coordinates, but couldn't resolve a street address.",
        );
        return;
      }

      const street = [address.streetNumber, address.street]
        .filter(Boolean)
        .join(" ");
      const locality =
        address.district ?? address.city ?? address.subregion ?? address.region;
      const addressParts = [
        street,
        locality,
        address.region && address.region !== locality ? address.region : null,
        address.postalCode,
        address.country,
      ].filter((part): part is string => Boolean(part));
      setLocationAddress(addressParts.join(", ") || null);

      if (addressParts.length === 0) {
        setLocationError(
          "We found your coordinates, but no readable address was available.",
        );
      }
    } catch {
      setLocationError(
        "Couldn't get your location. Turn on Location in your device settings and try again. On Android, allow the location settings prompt if it appears.",
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getQuantity = (productId: string) =>
    items.find((item) => item.product.id === productId)?.quantity ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>🛒 Cart Crusaders</Text>
            <Text style={styles.delivery}>Delivering fresh groceries</Text>
          </View>

          <View style={styles.headerActions}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartText}>🛍️ {cartCount}</Text>
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
        </View>

        {/* Delivery Location */}
        <View style={styles.location}>
          <Text style={styles.locationLabel}>DELIVERING TO</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => void handleGetLocation()}
            disabled={isGettingLocation}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Get my exact current location"
          >
            <Text style={styles.locationValue}>
              {isGettingLocation
                ? "📍 Getting your location..."
                : `📍 ${locationAddress ?? "Tap to get your current location"}`}
            </Text>
            {!isGettingLocation && (
              <Text style={styles.locationAction}>
                {locationAddress ? "Refresh" : "Use current location"}
              </Text>
            )}
          </TouchableOpacity>
          {locationCoordinates && (
            <Text style={styles.locationCoordinates}>
              GPS: {locationCoordinates}
            </Text>
          )}
          {locationError && (
            <Text accessibilityRole="alert" style={styles.locationError}>
              {locationError}
            </Text>
          )}
        </View>

        {/* Search */}
        <TextInput
          style={styles.search}
          placeholder="Search fruits, vegetables..."
          placeholderTextColor="#899389"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {/* Promotional Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Freshness at your doorstep!</Text>

          <Text style={styles.bannerSubtitle}>
            Your daily groceries, delivered with care.
          </Text>

          <Text style={styles.bannerEmoji}>🥬 🍅 🥕</Text>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => {
            const selected = selectedCategory === category.name;

            return (
              <TouchableOpacity
                key={category.name}
                style={[styles.category, selected && styles.selectedCategory]}
                onPress={() => setSelectedCategory(category.name)}
                activeOpacity={0.75}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>

                <Text
                  style={[
                    styles.categoryName,
                    selected && styles.selectedCategoryName,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Listing */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? "Popular Groceries"
              : selectedCategory}
          </Text>

          <Text style={styles.productCount}>
            {filteredProducts.length} items
          </Text>
        </View>

        <View style={styles.productGrid}>
          {filteredProducts.map((product) => {
            const quantity = getQuantity(product.id);

            return (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Text style={styles.productEmoji}>{product.emoji}</Text>
                </View>

                <Text style={styles.productName}>{product.name}</Text>

                <Text style={styles.productDetail}>{product.detail}</Text>

                <View style={styles.productFooter}>
                  <Text style={styles.price}>₹{product.price}</Text>

                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      quantity > 0 && styles.addedButton,
                    ]}
                    onPress={() => addToCart(product)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.addButtonText}>
                      {quantity > 0 ? `+ Add (${quantity})` : "+ Add"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptySearch}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={styles.emptyTitle}>No groceries found</Text>
            <Text style={styles.emptyText}>
              Try another search or category.
            </Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              <Text style={styles.resetButtonText}>Show all products</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F4",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E5631",
  },
  delivery: {
    fontSize: 13,
    color: "#687568",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartBadge: {
    backgroundColor: "#E2F0DF",
    padding: 12,
    borderRadius: 14,
  },
  cartText: {
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9E5D6",
    backgroundColor: "#FFFFFF",
  },
  logoutText: {
    color: "#277642",
    fontSize: 12,
    fontWeight: "700",
  },
  location: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  locationButton: {
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  locationLabel: {
    fontSize: 10,
    color: "#788378",
    fontWeight: "700",
  },
  locationValue: {
    fontSize: 15,
    color: "#263B2A",
    marginTop: 4,
    lineHeight: 21,
  },
  locationAction: {
    color: "#277642",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  locationCoordinates: {
    color: "#788378",
    fontSize: 11,
    marginTop: 3,
  },
  locationError: {
    color: "#B42318",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  search: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5EAE1",
    fontSize: 14,
    color: "#263B2A",
  },
  banner: {
    backgroundColor: "#DDEED6",
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#204A2C",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#46654A",
    marginTop: 8,
  },
  bannerEmoji: {
    fontSize: 30,
    marginTop: 14,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#243A28",
  },
  productCount: {
    fontSize: 12,
    color: "#778277",
  },
  categoryList: {
    paddingRight: 8,
  },
  category: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginLeft: 12,
    marginBottom: 20,
    width: 78,
    height: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EDE5",
  },
  selectedCategory: {
    backgroundColor: "#277642",
    borderColor: "#277642",
  },
  categoryEmoji: {
    fontSize: 27,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 8,
    color: "#293B2C",
  },
  selectedCategoryName: {
    color: "#FFFFFF",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E9EDE6",
  },
  productImage: {
    backgroundColor: "#F0F6EB",
    height: 105,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: {
    fontSize: 48,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#293B2C",
    marginTop: 12,
  },
  productDetail: {
    fontSize: 12,
    color: "#7C877C",
    marginTop: 5,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    gap: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: "#245A32",
  },
  addButton: {
    backgroundColor: "#277642",
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 9,
  },
  addedButton: {
    backgroundColor: "#1E5631",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  emptySearch: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 38,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#243A28",
    marginTop: 12,
  },
  emptyText: {
    textAlign: "center",
    paddingTop: 8,
    color: "#687568",
    fontSize: 13,
  },
  resetButton: {
    backgroundColor: "#277642",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  bottomSpace: {
    height: 20,
  },
});
