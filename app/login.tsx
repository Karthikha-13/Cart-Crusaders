import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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

export default function LoginScreen() {
  const { signIn, signInAdmin, storageError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isAdminLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Enter a password to continue.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isAdminLogin) {
        await signInAdmin(email.trim(), password);
        router.replace("/admin");
      } else {
        await signIn(normalizedEmail);
        router.replace("/(tabs)");
      }
    } catch (error) {
      if (isAdminLogin) {
        if (
          error instanceof Error &&
          error.message === "Invalid admin username or password."
        ) {
          setErrorMessage(error.message);
        } else {
          console.error("Failed to save admin login state:", error);
          setErrorMessage("Could not save your admin login. Please try again.");
        }
      } else {
        console.error("Failed to save login state:", error);
        setErrorMessage("Could not save your login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
        >
          <View style={styles.brandMark}>
            <Text style={styles.brandEmoji}>🛒</Text>
          </View>
          <Text style={styles.brand}>Cart Crusaders</Text>
          <Text style={styles.title}>
            {isAdminLogin ? "Admin sign in" : "Welcome back"}
          </Text>
          <Text style={styles.subtitle}>
            {isAdminLogin
              ? "Sign in to manage the grocery catalog."
              : "Sign in to shop fresh groceries delivered to your door."}
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>
              {isAdminLogin ? "Admin username" : "Email address"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isAdminLogin ? "Admin" : "you@example.com"}
              placeholderTextColor="#899389"
              value={email}
              onChangeText={setEmail}
              keyboardType={isAdminLogin ? "default" : "email-address"}
              autoCapitalize={isAdminLogin ? "words" : "none"}
              autoComplete={isAdminLogin ? "off" : "email"}
              textContentType={isAdminLogin ? "none" : "emailAddress"}
              returnKeyType="next"
            />

            <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder={
                isAdminLogin ? "Admin password" : "Enter your password"
              }
              placeholderTextColor="#899389"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={isAdminLogin ? "off" : "password"}
              textContentType={isAdminLogin ? "none" : "password"}
              returnKeyType="done"
              onSubmitEditing={() => void handleSignIn()}
            />

            {(errorMessage || storageError) && (
              <Text accessibilityRole="alert" style={styles.error}>
                {errorMessage || storageError}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={() => void handleSignIn()}
              disabled={isSubmitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchLogin}
            onPress={() => {
              setIsAdminLogin((current) => !current);
              setEmail("");
              setPassword("");
              setErrorMessage(null);
            }}
            activeOpacity={0.75}
          >
            <Text style={styles.switchLoginText}>
              {isAdminLogin ? "← Back to user login" : "Sign in as admin"}
            </Text>
          </TouchableOpacity>
          {/* {isAdminLogin ? (
            <Text style={styles.demoNote}>Credentials: Admin / admin123</Text>
          ) : (
            <Text style={styles.demoNote}>
              Demo login: use any valid email and a non-empty password.
            </Text>
          )} */}
          {/* <Text style={styles.disclaimer}>
            This test sign-in is stored on this device and does not verify an
            account with a server.
          </Text> */}
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  brandMark: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#DDEED6",
  },
  brandEmoji: {
    fontSize: 34,
  },
  brand: {
    marginTop: 12,
    color: "#277642",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  title: {
    marginTop: 30,
    color: "#183D2B",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#6B786E",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  card: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAE2",
  },
  label: {
    marginBottom: 8,
    color: "#26382B",
    fontSize: 13,
    fontWeight: "700",
  },
  passwordLabel: {
    marginTop: 18,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E8DE",
    backgroundColor: "#FBFCFA",
    color: "#26382B",
    fontSize: 15,
  },
  error: {
    marginTop: 12,
    color: "#B42318",
    fontSize: 13,
    lineHeight: 19,
  },
  button: {
    minHeight: 52,
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#277642",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  demoNote: {
    marginTop: 20,
    color: "#46654A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  switchLogin: {
    marginTop: 22,
    alignSelf: "center",
    padding: 8,
  },
  switchLoginText: {
    color: "#277642",
    fontSize: 14,
    fontWeight: "700",
  },
  disclaimer: {
    marginTop: 8,
    color: "#788378",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
