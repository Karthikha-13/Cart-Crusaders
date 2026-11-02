import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product } from "./CartContext";

export const PRODUCT_CATEGORIES: Product["category"][] = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Bakery",
  "Snacks",
];

export const CATEGORY_EMOJI: Record<Product["category"], string> = {
  Vegetables: "🥦",
  Fruits: "🍎",
  Dairy: "🥛",
  Bakery: "🍞",
  Snacks: "🍪",
};

const PRODUCT_EMOJI: Record<string, string> = {
  apple: "🍎",
  apples: "🍎",
  banana: "🍌",
  bananas: "🍌",
  strawberry: "🍓",
  strawberries: "🍓",
  blueberry: "🫐",
  blueberries: "🫐",
  blackberry: "🫐",
  blackberries: "🫐",
  raspberry: "🍓",
  raspberries: "🍓",
  cherry: "🍒",
  cherries: "🍒",
  grape: "🍇",
  grapes: "🍇",
  mango: "🥭",
  mangos: "🥭",
  orange: "🍊",
  oranges: "🍊",
  lemon: "🍋",
  lemons: "🍋",
  lime: "🍋",
  limes: "🍋",
  pineapple: "🍍",
  pineapples: "🍍",
  watermelon: "🍉",
  melon: "🍈",
  pear: "🍐",
  pears: "🍐",
  peach: "🍑",
  peaches: "🍑",
  avocado: "🥑",
  avocados: "🥑",
  coconut: "🥥",
  kiwi: "🥝",
  kiwis: "🥝",
  papaya: "🍈",
  pomegranate: "🍎",
  guava: "🍐",
  dragon: "🍈",
  plum: "🍑",
  lychee: "🍒",
  mosambi: "🍊",
  dates: "🫘",
  jackfruit: "🍈",
  broccoli: "🥦",
  carrot: "🥕",
  carrots: "🥕",
  cauliflower: "🥦",
  corn: "🌽",
  cucumber: "🥒",
  cucumbers: "🥒",
  eggplant: "🍆",
  aubergine: "🍆",
  pepper: "🫑",
  capsicum: "🫑",
  tomato: "🍅",
  tomatoes: "🍅",
  potato: "🥔",
  potatoes: "🥔",
  onion: "🧅",
  onions: "🧅",
  garlic: "🧄",
  lettuce: "🥬",
  spinach: "🥬",
  cabbage: "🥬",
  okra: "🥬",
  peas: "🫛",
  beans: "🫛",
  ginger: "🫚",
  pumpkin: "🎃",
  beetroot: "🫜",
  radish: "🫜",
  zucchini: "🥒",
  coriander: "🌿",
  mushroom: "🍄",
  mushrooms: "🍄",
  milk: "🥛",
  cheese: "🧀",
  butter: "🧈",
  yogurt: "🥛",
  yoghurt: "🥛",
  curd: "🥛",
  paneer: "🧀",
  ghee: "🧈",
  buttermilk: "🥛",
  lassi: "🥛",
  cream: "🥛",
  mozzarella: "🧀",
  cheddar: "🧀",
  parmesan: "🧀",
  probiotic: "🥛",
  bread: "🍞",
  baguette: "🥖",
  croissant: "🥐",
  cake: "🍰",
  muffin: "🧁",
  muffins: "🧁",
  rusk: "🍞",
  donut: "🍩",
  donuts: "🍩",
  cupcake: "🧁",
  cupcakes: "🧁",
  brownie: "🍫",
  brownies: "🍫",
  bagel: "🥯",
  bagels: "🥯",
  pita: "🫓",
  buns: "🍞",
  pav: "🍞",
  cookie: "🍪",
  cookies: "🍪",
  biscuit: "🍪",
  biscuits: "🍪",
  chips: "🥔",
  crisps: "🥔",
  popcorn: "🍿",
  chocolate: "🍫",
  candy: "🍬",
  sweets: "🍬",
  pretzel: "🥨",
  pretzels: "🥨",
  peanuts: "🥜",
  almond: "🥜",
  almonds: "🥜",
  cashew: "🥜",
  cashews: "🥜",
  nachos: "🌮",
  samosas: "🥟",
  crackers: "🍘",
  mixture: "🥨",
  samosa: "🥟",
  sev: "🍜",
  bhujia: "🥨",
  granola: "🥣",
  makhana: "🍿",
  puffs: "🍿",
  bar: "🍫",
  trail: "🥜",
  roasted: "🥜",
};

const PRODUCT_EMOJI_KEYWORDS = Object.keys(PRODUCT_EMOJI).sort(
  (first, second) => second.length - first.length,
);

const PRODUCT_EMOJI_PHRASES: Record<string, string> = {
  "cheese nachos": "🌮",
  "cheese puffs": "🍿",
  "salted pretzels": "🥨",
  "mini samosas": "🥟",
  "roasted makhana": "🍿",
  "granola bar": "🥣",
  "chocolate chip cookies": "🍪",
};

const PRODUCT_EMOJI_PHRASE_KEYS = Object.keys(PRODUCT_EMOJI_PHRASES).sort(
  (first, second) => second.length - first.length,
);

export function getProductEmoji(
  name: string,
  category: Product["category"],
): string {
  const normalizedName = name.toLowerCase();
  const matchingPhrase = PRODUCT_EMOJI_PHRASE_KEYS.find((phrase) =>
    normalizedName.includes(phrase),
  );
  if (matchingPhrase) {
    return PRODUCT_EMOJI_PHRASES[matchingPhrase];
  }

  const productWords: string[] =
    normalizedName.match(/[a-z0-9]+/g) ?? [];
  const matchingKeyword = PRODUCT_EMOJI_KEYWORDS.find((keyword) =>
    productWords.includes(keyword),
  );

  return (
    (matchingKeyword && PRODUCT_EMOJI[matchingKeyword]) ??
    CATEGORY_EMOJI[category]
  );
}

const PRODUCT_STORAGE_KEY = "@cart_crusaders_products";

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Apples",
    detail: "500 g",
    price: 120,
    emoji: "🍎",
    category: "Fruits",
  },
  {
    id: "2",
    name: "Organic Bananas",
    detail: "6 pieces",
    price: 60,
    emoji: "🍌",
    category: "Fruits",
  },
  {
    id: "3",
    name: "Fresh Broccoli",
    detail: "1 piece",
    price: 45,
    emoji: "🥦",
    category: "Vegetables",
  },
  {
    id: "4",
    name: "Farm Milk",
    detail: "500 ml",
    price: 35,
    emoji: "🥛",
    category: "Dairy",
  },
  {
    id: "5",
    name: "Fresh Bread",
    detail: "1 loaf",
    price: 40,
    emoji: "🍞",
    category: "Bakery",
  },
  {
    id: "6",
    name: "Cookies",
    detail: "200 g",
    price: 55,
    emoji: "🍪",
    category: "Snacks",
  },
];

const additionalProducts: Product[] = ([
  // Vegetables: 24 additional products (25 total including Fresh Broccoli).
  { name: "Fresh Tomatoes", detail: "500 g", price: 30, category: "Vegetables" },
  { name: "Potatoes", detail: "1 kg", price: 40, category: "Vegetables" },
  { name: "Red Onions", detail: "1 kg", price: 45, category: "Vegetables" },
  { name: "Carrots", detail: "500 g", price: 35, category: "Vegetables" },
  { name: "Cucumber", detail: "500 g", price: 30, category: "Vegetables" },
  { name: "Fresh Spinach", detail: "1 bunch", price: 25, category: "Vegetables" },
  { name: "Cauliflower", detail: "1 piece", price: 40, category: "Vegetables" },
  { name: "Green Cabbage", detail: "1 piece", price: 35, category: "Vegetables" },
  { name: "Green Capsicum", detail: "500 g", price: 50, category: "Vegetables" },
  { name: "Brinjal", detail: "500 g", price: 35, category: "Vegetables" },
  { name: "Fresh Okra", detail: "500 g", price: 40, category: "Vegetables" },
  { name: "Green Peas", detail: "500 g", price: 60, category: "Vegetables" },
  { name: "Green Beans", detail: "500 g", price: 45, category: "Vegetables" },
  { name: "Garlic", detail: "250 g", price: 35, category: "Vegetables" },
  { name: "Fresh Ginger", detail: "200 g", price: 30, category: "Vegetables" },
  { name: "Crisp Lettuce", detail: "1 head", price: 55, category: "Vegetables" },
  { name: "Sweet Corn", detail: "2 pieces", price: 40, category: "Vegetables" },
  { name: "Pumpkin", detail: "500 g", price: 30, category: "Vegetables" },
  { name: "Beetroot", detail: "500 g", price: 35, category: "Vegetables" },
  { name: "Radish", detail: "1 bunch", price: 25, category: "Vegetables" },
  { name: "Zucchini", detail: "500 g", price: 65, category: "Vegetables" },
  { name: "Button Mushrooms", detail: "200 g", price: 70, category: "Vegetables" },
  { name: "Sweet Potatoes", detail: "500 g", price: 45, category: "Vegetables" },
  { name: "Coriander Leaves", detail: "1 bunch", price: 15, category: "Vegetables" },

  // Fruits: 23 additional products (25 total including apples and bananas).
  { name: "Alphonso Mangoes", detail: "1 kg", price: 180, category: "Fruits" },
  { name: "Juicy Oranges", detail: "1 kg", price: 90, category: "Fruits" },
  { name: "Seedless Grapes", detail: "500 g", price: 85, category: "Fruits" },
  { name: "Fresh Strawberries", detail: "250 g", price: 120, category: "Fruits" },
  { name: "Watermelon", detail: "1 piece", price: 70, category: "Fruits" },
  { name: "Pineapple", detail: "1 piece", price: 65, category: "Fruits" },
  { name: "Ripe Papaya", detail: "1 piece", price: 55, category: "Fruits" },
  { name: "Pomegranate", detail: "500 g", price: 110, category: "Fruits" },
  { name: "Fresh Guava", detail: "500 g", price: 50, category: "Fruits" },
  { name: "Green Pears", detail: "500 g", price: 95, category: "Fruits" },
  { name: "Sweet Peaches", detail: "500 g", price: 130, category: "Fruits" },
  { name: "Kiwi", detail: "3 pieces", price: 100, category: "Fruits" },
  { name: "Lemons", detail: "6 pieces", price: 35, category: "Fruits" },
  { name: "Tender Coconut", detail: "1 piece", price: 50, category: "Fruits" },
  { name: "Avocado", detail: "2 pieces", price: 140, category: "Fruits" },
  { name: "Red Cherries", detail: "200 g", price: 160, category: "Fruits" },
  { name: "Blueberries", detail: "125 g", price: 190, category: "Fruits" },
  { name: "Dragon Fruit", detail: "1 piece", price: 95, category: "Fruits" },
  { name: "Black Plum", detail: "500 g", price: 75, category: "Fruits" },
  { name: "Fresh Lychee", detail: "500 g", price: 120, category: "Fruits" },
  { name: "Sweet Mosambi", detail: "1 kg", price: 85, category: "Fruits" },
  { name: "Dried Dates", detail: "250 g", price: 110, category: "Fruits" },
  { name: "Ripe Jackfruit", detail: "500 g", price: 80, category: "Fruits" },

  // Dairy: 24 additional products (25 total including Farm Milk).
  { name: "Fresh Curd", detail: "500 g", price: 40, category: "Dairy" },
  { name: "Malai Paneer", detail: "200 g", price: 90, category: "Dairy" },
  { name: "Cheddar Cheese Slices", detail: "200 g", price: 125, category: "Dairy" },
  { name: "Salted Butter", detail: "100 g", price: 58, category: "Dairy" },
  { name: "Plain Yogurt", detail: "400 g", price: 55, category: "Dairy" },
  { name: "Pure Ghee", detail: "200 ml", price: 155, category: "Dairy" },
  { name: "Buttermilk", detail: "500 ml", price: 30, category: "Dairy" },
  { name: "Sweet Lassi", detail: "250 ml", price: 35, category: "Dairy" },
  { name: "Fresh Cream", detail: "250 ml", price: 75, category: "Dairy" },
  { name: "Mozzarella Cheese", detail: "200 g", price: 135, category: "Dairy" },
  { name: "Parmesan Cheese", detail: "100 g", price: 160, category: "Dairy" },
  { name: "Probiotic Yogurt", detail: "100 g", price: 35, category: "Dairy" },
  { name: "Toned Milk", detail: "1 L", price: 60, category: "Dairy" },
  { name: "Low Fat Milk", detail: "500 ml", price: 32, category: "Dairy" },
  { name: "Chocolate Milk", detail: "200 ml", price: 30, category: "Dairy" },
  { name: "Strawberry Yogurt", detail: "100 g", price: 40, category: "Dairy" },
  { name: "Greek Yogurt", detail: "200 g", price: 90, category: "Dairy" },
  { name: "Cottage Cheese", detail: "200 g", price: 85, category: "Dairy" },
  { name: "Cheese Spread", detail: "180 g", price: 95, category: "Dairy" },
  { name: "Unsalted Butter", detail: "100 g", price: 58, category: "Dairy" },
  { name: "Vanilla Ice Cream", detail: "500 ml", price: 120, category: "Dairy" },
  { name: "Chocolate Ice Cream", detail: "500 ml", price: 135, category: "Dairy" },
  { name: "Milk Powder", detail: "500 g", price: 220, category: "Dairy" },
  { name: "Fresh Buttermilk", detail: "1 L", price: 55, category: "Dairy" },

  // Bakery: 24 additional products (25 total including Fresh Bread).
  { name: "Whole Wheat Bread", detail: "400 g", price: 50, category: "Bakery" },
  { name: "Multigrain Bread", detail: "400 g", price: 65, category: "Bakery" },
  { name: "Burger Buns", detail: "4 pieces", price: 45, category: "Bakery" },
  { name: "Pav Buns", detail: "6 pieces", price: 35, category: "Bakery" },
  { name: "Butter Croissant", detail: "2 pieces", price: 75, category: "Bakery" },
  { name: "French Baguette", detail: "1 piece", price: 85, category: "Bakery" },
  { name: "Chocolate Muffins", detail: "2 pieces", price: 70, category: "Bakery" },
  { name: "Chocolate Cake", detail: "500 g", price: 350, category: "Bakery" },
  { name: "Vanilla Cake", detail: "500 g", price: 320, category: "Bakery" },
  { name: "Wheat Rusk", detail: "200 g", price: 55, category: "Bakery" },
  { name: "Garlic Bread", detail: "1 loaf", price: 90, category: "Bakery" },
  { name: "Sandwich Loaf", detail: "400 g", price: 48, category: "Bakery" },
  { name: "Glazed Donuts", detail: "2 pieces", price: 80, category: "Bakery" },
  { name: "Vanilla Cupcakes", detail: "2 pieces", price: 75, category: "Bakery" },
  { name: "Pizza Base", detail: "2 pieces", price: 60, category: "Bakery" },
  { name: "Pita Bread", detail: "4 pieces", price: 65, category: "Bakery" },
  { name: "Dinner Rolls", detail: "6 pieces", price: 55, category: "Bakery" },
  { name: "Butter Biscuits", detail: "200 g", price: 50, category: "Bakery" },
  { name: "Fudge Brownies", detail: "2 pieces", price: 95, category: "Bakery" },
  { name: "Cinnamon Rolls", detail: "2 pieces", price: 100, category: "Bakery" },
  { name: "Fruit Cake", detail: "400 g", price: 280, category: "Bakery" },
  { name: "Breadsticks", detail: "150 g", price: 65, category: "Bakery" },
  { name: "Sesame Bagels", detail: "2 pieces", price: 85, category: "Bakery" },
  { name: "Chocolate Chip Cookies", detail: "200 g", price: 90, category: "Bakery" },

  // Snacks: 24 additional products (25 total including Cookies).
  { name: "Classic Potato Chips", detail: "100 g", price: 30, category: "Snacks" },
  { name: "Masala Chips", detail: "100 g", price: 30, category: "Snacks" },
  { name: "Salted Popcorn", detail: "100 g", price: 45, category: "Snacks" },
  { name: "Dark Chocolate Bar", detail: "100 g", price: 110, category: "Snacks" },
  { name: "Roasted Peanuts", detail: "200 g", price: 55, category: "Snacks" },
  { name: "Almonds", detail: "200 g", price: 240, category: "Snacks" },
  { name: "Cashews", detail: "200 g", price: 260, category: "Snacks" },
  { name: "Trail Mix", detail: "200 g", price: 180, category: "Snacks" },
  { name: "Salted Pretzels", detail: "150 g", price: 75, category: "Snacks" },
  { name: "Cheese Nachos", detail: "150 g", price: 85, category: "Snacks" },
  { name: "Salted Crackers", detail: "200 g", price: 45, category: "Snacks" },
  { name: "Masala Biscuits", detail: "200 g", price: 50, category: "Snacks" },
  { name: "Spicy Mixture", detail: "200 g", price: 60, category: "Snacks" },
  { name: "Crispy Sev", detail: "200 g", price: 55, category: "Snacks" },
  { name: "Mini Samosas", detail: "6 pieces", price: 80, category: "Snacks" },
  { name: "Aloo Bhujia", detail: "200 g", price: 65, category: "Snacks" },
  { name: "Fruit Candy", detail: "150 g", price: 40, category: "Snacks" },
  { name: "Granola Bar", detail: "6 pieces", price: 120, category: "Snacks" },
  { name: "Roasted Makhana", detail: "100 g", price: 95, category: "Snacks" },
  { name: "Banana Chips", detail: "150 g", price: 60, category: "Snacks" },
  { name: "Cheese Puffs", detail: "100 g", price: 40, category: "Snacks" },
  { name: "Chocolate Cookies", detail: "200 g", price: 70, category: "Snacks" },
  { name: "Spicy Roasted Chana", detail: "200 g", price: 50, category: "Snacks" },
  { name: "Caramel Popcorn", detail: "100 g", price: 60, category: "Snacks" },
 ] satisfies Omit<Product, "id" | "emoji">[]).map((product) => ({
  ...product,
  id: `seed-${product.category.toLowerCase()}-${product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`,
  emoji: getProductEmoji(product.name, product.category),
}));

initialProducts.push(...additionalProducts);

type ProductCatalogContextValue = {
  products: Product[];
  isLoading: boolean;
  storageError: string | null;
  addProduct: (product: Omit<Product, "id" | "emoji">) => Promise<void>;
};

const ProductCatalogContext = createContext<
  ProductCatalogContextValue | undefined
>(undefined);

function isProductList(value: unknown): value is Product[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string" &&
        "name" in item &&
        typeof item.name === "string" &&
        "detail" in item &&
        typeof item.detail === "string" &&
        "price" in item &&
        typeof item.price === "number" &&
        "emoji" in item &&
        typeof item.emoji === "string" &&
        "category" in item &&
        PRODUCT_CATEGORIES.includes(item.category as Product["category"]),
    )
  );
}

export function ProductCatalogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const restoreProducts = async () => {
      try {
        const savedProducts = await AsyncStorage.getItem(PRODUCT_STORAGE_KEY);

        if (savedProducts) {
          const parsedProducts: unknown = JSON.parse(savedProducts);

          if (!isProductList(parsedProducts)) {
            throw new Error("Saved product catalog has an invalid format.");
          }

          if (active) {
            const productsWithCorrectIcons = parsedProducts.map((product) => ({
              ...product,
              emoji: getProductEmoji(product.name, product.category),
            }));

            const mergedProducts = new Map(
              initialProducts.map((product) => [product.id, product]),
            );
            productsWithCorrectIcons.forEach((product) =>
              mergedProducts.set(product.id, product),
            );
            const completeCatalog = Array.from(mergedProducts.values());

            setProducts(completeCatalog);

            if (
              JSON.stringify(parsedProducts) !== JSON.stringify(completeCatalog)
            ) {
              await AsyncStorage.setItem(
                PRODUCT_STORAGE_KEY,
                JSON.stringify(completeCatalog),
              );
            }
          }
        } else {
          await AsyncStorage.setItem(
            PRODUCT_STORAGE_KEY,
            JSON.stringify(initialProducts),
          );
        }
      } catch (error) {
        console.error("Failed to load product catalog:", error);
        if (active) {
          setStorageError(
            "Could not load saved products. Admin changes may not be saved.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void restoreProducts();

    return () => {
      active = false;
    };
  }, []);

  const addProduct = async (product: Omit<Product, "id" | "emoji">) => {
    const nextProducts = [
      ...products,
      {
        ...product,
        id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        emoji: getProductEmoji(product.name, product.category),
      },
    ];

    await AsyncStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(nextProducts),
    );
    setProducts(nextProducts);
    setStorageError(null);
  };

  return (
    <ProductCatalogContext.Provider
      value={{ products, isLoading, storageError, addProduct }}
    >
      {children}
    </ProductCatalogContext.Provider>
  );
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);

  if (!context) {
    throw new Error(
      "useProductCatalog must be used inside ProductCatalogProvider",
    );
  }

  return context;
}
