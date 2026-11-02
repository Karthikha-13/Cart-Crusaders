import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextValue = {
  isLoading: boolean;
  userEmail: string | null;
  role: "user" | "admin" | null;
  storageError: string | null;
  signIn: (email: string) => Promise<void>;
  signInAdmin: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "@cart_crusaders_user_email";
const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "admin123";

type StoredSession = {
  role: "user" | "admin";
  email?: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (active && savedEmail) {
          try {
            const session: unknown = JSON.parse(savedEmail);

            if (
              typeof session === "object" &&
              session !== null &&
              "role" in session &&
              (session.role === "user" || session.role === "admin")
            ) {
              const stored = session as StoredSession;
              setRole(stored.role);
              setUserEmail(stored.role === "admin" ? null : stored.email ?? null);
            } else if (savedEmail.trim()) {
              setRole("user");
              setUserEmail(savedEmail);
            }
          } catch {
            if (savedEmail.trim()) {
              setRole("user");
              setUserEmail(savedEmail);
            }
          }
        }
      } catch (error) {
        console.error("Failed to restore login state:", error);
        if (active) {
          setStorageError("Could not restore your saved login. Please try again.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const signIn = async (email: string) => {
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ role: "user", email } satisfies StoredSession),
    );
    setUserEmail(email);
    setRole("user");
    setStorageError(null);
  };

  const signInAdmin = async (username: string, password: string) => {
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      throw new Error("Invalid admin username or password.");
    }

    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ role: "admin" } satisfies StoredSession),
    );
    setUserEmail(null);
    setRole("admin");
    setStorageError(null);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUserEmail(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userEmail,
        role,
        storageError,
        signIn,
        signInAdmin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
