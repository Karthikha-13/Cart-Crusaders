import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#277642",
        tabBarInactiveTintColor: "#899389",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E8EDE5",
          height: 65,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              color={typeof color === "string" ? color : "#277642"}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="grid-outline"
              color={typeof color === "string" ? color : "#277642"}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="cart-outline"
              color={typeof color === "string" ? color : "#277642"}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="receipt-outline"
              size={size}
              color={typeof color === "string" ? color : "#277642"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="payments"
        options={{
          title: "Payments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="card-outline"
              size={size}
              color={typeof color === "string" ? color : "#277642"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
