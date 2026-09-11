import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const [mpin, setMpin] = useState("");

  const handleDigit = (digit: string) => {
    if (mpin.length < 6) {
      setMpin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setMpin((prev) => prev.slice(0, -1));
  };

  const handleLogin = () => {
    if (mpin.length !== 6) return;

    console.log("Login with MPIN:", mpin);

    // Later:
    // API call → Spring Boot
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Brand */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Z</Text>
          </View>

          <Text style={styles.brand}>Z-VAULT</Text>
          <Text style={styles.tagline}>Your money. Your control.</Text>
        </View>

        {/* Login */}
        <View style={styles.loginSection}>
          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Enter your 6-digit MPIN to continue
          </Text>

          {/* MPIN dots */}
          <View style={styles.dots}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index < mpin.length && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* Forgot MPIN */}
          <Pressable style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot MPIN?</Text>
          </Pressable>

          {/* Number pad */}
          <View style={styles.keypad}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
              (digit) => (
                <Pressable
                  key={digit}
                  style={({ pressed }) => [
                    styles.key,
                    pressed && styles.keyPressed,
                  ]}
                  onPress={() => handleDigit(digit)}
                >
                  <Text style={styles.keyText}>{digit}</Text>
                </Pressable>
              )
            )}

            <View style={styles.emptyKey} />

            <Pressable
              style={({ pressed }) => [
                styles.key,
                pressed && styles.keyPressed,
              ]}
              onPress={() => handleDigit("0")}
            >
              <Text style={styles.keyText}>0</Text>
            </Pressable>

            <Pressable
              style={styles.key}
              onPress={handleDelete}
            >
              <Text style={styles.deleteText}>⌫</Text>
            </Pressable>
          </View>

          {/* Login button */}
          <Pressable
            disabled={mpin.length !== 6}
            onPress={handleLogin}
            style={[
              styles.loginButton,
              mpin.length === 6 && styles.loginButtonActive,
            ]}
          >
            <Text
              style={[
                styles.loginButtonText,
                mpin.length === 6 && styles.loginButtonTextActive,
              ]}
            >
              Continue
            </Text>
          </Pressable>
        </View>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            New to Z-Vault?
          </Text>

          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}> Create account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: "#F8FAFC",
  },

  keyboard: {
    flex: 1,
    paddingHorizontal: 24,
  },

  header: {
    alignItems: "center",
    paddingTop: 25,
    
  },

  logo: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  brand: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#111827",
  },

  tagline: {
    marginTop: 4,
    fontSize: 12,
    color: "#94A3B8",
  },

  loginSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 14,
  },

  dots: {
    flexDirection: "row",
    gap: 13,
    marginTop: 30,
    marginBottom: 10,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
  },

  activeDot: {
    backgroundColor: "#111827",
  },

  forgot: {
    marginBottom: 25,
  },

  forgotText: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "600",
  },

  keypad: {
    width: "100%",
    maxWidth: 330,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  key: {
    width: 88,
    height: 55,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  keyPressed: {
    backgroundColor: "#E2E8F0",
    transform: [{ scale: 0.96 }],
  },

  keyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F172A",
  },

  emptyKey: {
    width: 88,
    height: 55,
  },

  deleteText: {
    fontSize: 24,
    color: "#64748B",
  },

  loginButton: {
    width: "100%",
    maxWidth: 330,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  loginButtonActive: {
    backgroundColor: "#111827",
  },

  loginButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#94A3B8",
  },

  loginButtonTextActive: {
    color: "#FFFFFF",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 25,
  },

  registerText: {
    color: "#64748B",
    fontSize: 14,
  },

  registerLink: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 14,
  },
});