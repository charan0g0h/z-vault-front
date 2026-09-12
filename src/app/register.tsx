import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import auth, {
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";

type Step = "phone" | "otp" | "mpin" | "confirm";

export default function RegisterScreen() {
  const [step, setStep] = useState<Step>("phone");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");

  function otpHandler() {
    
  }

  const [confirmation, setConfirmation] =
  useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const handleContinue = async () => {
  if (step === "phone") {
    if (phone.length !== 10) {
      return;
    }

    try {
      const phoneNumber = `+91${phone}`;

      const confirmationResult =
        await auth().signInWithPhoneNumber(phoneNumber);

      setConfirmation(confirmationResult);
      setStep("otp");

      console.log("OTP sent");
    } catch (error) {
      console.error("OTP error:", error);
    }

    return;
  }

  if (step === "otp") {
    if (otp.length !== 6 || !confirmation) {
      return;
    }

    try {
      const userCredential = await confirmation.confirm(otp);

      console.log("Firebase user:", userCredential.user.uid);

      setStep("mpin");
    } catch (error) {
      console.error("Invalid OTP:", error);
    }

    return;
  }

  if (step === "mpin") {
    if (mpin.length === 6) {
      setStep("confirm");
    }

    return;
  }

  if (step === "confirm") {
    if (confirmMpin === mpin && confirmMpin.length === 6) {
      console.log({
        phone,
        mpin,
      });

      // Call your Spring Boot /auth/register here
    }
  }
};

  const getTitle = () => {
    switch (step) {
      case "phone":
        return "Create your account";

      case "otp":
        return "Verify your number";

      case "mpin":
        return "Create your MPIN";

      case "confirm":
        return "Confirm your MPIN";
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case "phone":
        return "Enter your mobile number to get started.";

      case "otp":
        return `Enter the OTP sent to +91 ${phone}`;

      case "mpin":
        return "Create a secure 6-digit MPIN.";

      case "confirm":
        return "Enter your MPIN again to confirm.";
    }
  };

  const renderInput = () => {
    if (step === "phone") {
      return (
        <View style={styles.phoneContainer}>
          <Text style={styles.countryCode}>+91</Text>

          <TextInput
            value={phone}
            onChangeText={(text) =>
              setPhone(text.replace(/[^0-9]/g, "").slice(0, 10))
            }
            placeholder="Mobile number"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            style={styles.phoneInput}
          />
        </View>
      );
    }

    if (step === "otp") {
      return (
        <TextInput
          value={otp}
          onChangeText={(text) =>
            setOtp(text.replace(/[^0-9]/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          textAlign="center"
        />
      );
    }

    if (step === "mpin") {
      return (
        <TextInput
          value={mpin}
          onChangeText={(text) =>
            setMpin(text.replace(/[^0-9]/g, "").slice(0, 6))
          }
          placeholder="••••••"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          style={styles.mpinInput}
          textAlign="center"
        />
      );
    }

    return (
      <TextInput
        value={confirmMpin}
        onChangeText={(text) =>
          setConfirmMpin(text.replace(/[^0-9]/g, "").slice(0, 6))
        }
        placeholder="••••••"
        placeholderTextColor="#94A3B8"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        style={styles.mpinInput}
        textAlign="center"
      />
    );
  };

  const isValid =
    step === "phone"
      ? phone.length === 10
      : step === "otp"
      ? otp.length === 6
      : step === "mpin"
      ? mpin.length === 6
      : confirmMpin.length === 6 && confirmMpin === mpin;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => {
              if (step === "phone") {
                router.back();
              } else if (step === "otp") {
                setStep("phone");
              } else if (step === "mpin") {
                setStep("otp");
              } else {
                setStep("mpin");
              }
            }}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.topBrand}>Z-VAULT</Text>

          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>
              {step === "phone"
                ? "1/4"
                : step === "otp"
                ? "2/4"
                : step === "mpin"
                ? "3/4"
                : "4/4"}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progress,
              {
                width:
                  step === "phone"
                    ? "25%"
                    : step === "otp"
                    ? "50%"
                    : step === "mpin"
                    ? "75%"
                    : "100%",
              },
            ]}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Z</Text>
          </View>

          <Text style={styles.title}>{getTitle()}</Text>

          <Text style={styles.subtitle}>{getSubtitle()}</Text>

          <View style={styles.form}>{renderInput()}</View>

          {step === "otp" && (
            <Pressable>
              <Text style={styles.resend}>Resend OTP</Text>
            </Pressable>
          )}

          {step === "confirm" &&
            confirmMpin.length === 6 &&
            confirmMpin !== mpin && (
              <Text style={styles.error}>MPINs do not match</Text>
            )}

          <Pressable
            disabled={!isValid}
            onPress={handleContinue}
            style={[
              styles.continueButton,
              isValid && styles.continueButtonActive,
            ]}
          >
            <Text
              style={[
                styles.continueText,
                isValid && styles.continueTextActive,
              ]}
            >
              {step === "confirm" ? "Create account" : "Continue"}
            </Text>
          </Pressable>
        </View>

        {/* Login */}
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            Already have an account?
          </Text>

          <Pressable onPress={() => router.replace("/")}>
            <Text style={styles.loginLink}> Sign in</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  keyboard: {
    flex: 1,
    paddingHorizontal: 24,
  },

  topBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  backText: {
    fontSize: 30,
    color: "#0F172A",
    marginTop: -4,
  },

  topBrand: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#111827",
  },

  stepIndicator: {
    width: 42,
    alignItems: "flex-end",
  },

  stepText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  progressBackground: {
    height: 3,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
  },

  progress: {
    height: 3,
    backgroundColor: "#111827",
    borderRadius: 2,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.7,
  },

  subtitle: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 330,
  },

  form: {
    marginTop: 30,
  },

  phoneContainer: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
  },

  countryCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    paddingLeft: 17,
    paddingRight: 12,
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#0F172A",
  },

  input: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: 5,
  },

  mpinInput: {
    height: 64,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 10,
  },

  resend: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 15,
  },

  error: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
  },

  continueButton: {
    height: 56,
    borderRadius: 17,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  continueButtonActive: {
    backgroundColor: "#111827",
  },

  continueText: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "700",
  },

  continueTextActive: {
    color: "#FFFFFF",
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 25,
  },

  bottomText: {
    color: "#64748B",
    fontSize: 14,
  },

  loginLink: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "700",
  },
});