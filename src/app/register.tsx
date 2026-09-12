
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  getAuth,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "@react-native-firebase/auth";

const auth = getAuth();

type Step = "phone" | "otp" | "mpin" | "confirm";

export default function Register() {
  const [step, setStep] = useState<Step>("phone");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");

  const [confirmation, setConfirmation] =
    useState<ConfirmationResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------
  // SEND OTP
  // --------------------------------
  const sendOtp = async () => {
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const phoneNumber = `+91${phone}`;

      console.log("Sending OTP to:", phoneNumber);

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber
      );

      setConfirmation(result);
      setStep("otp");

      console.log("OTP sent successfully");
    } catch (err: any) {
      console.log("OTP error:", err);

      setError(
        err?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // VERIFY OTP
  // --------------------------------
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    if (!confirmation) {
      setError("OTP session expired. Please request OTP again.");
      setStep("phone");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Verifying OTP...");

      const result = await confirmation.confirm(otp);

      console.log("Phone verified successfully");

      const user = result.user;

      console.log("Firebase UID:", user.uid);

      setStep("mpin");
    } catch (err: any) {
      console.log("OTP verification error:", err);

      setError(
        err?.message ||
          "Invalid OTP. Please check the OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // MPIN
  // --------------------------------
  const continueMpin = () => {
    if (mpin.length !== 6) {
      setError("MPIN must contain 6 digits");
      return;
    }

    setError("");
    setStep("confirm");
  };

  // --------------------------------
  // COMPLETE REGISTRATION
  // --------------------------------
  const completeRegistration = async () => {
    if (confirmMpin.length !== 6) {
      setError("Enter your 6-digit MPIN again");
      return;
    }

    if (mpin !== confirmMpin) {
      setError("MPINs do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * Firebase phone authentication is already completed.
       *
       * Get Firebase ID token.
       *
       * Later you will send this token to your
       * Spring Boot backend.
       */

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Firebase authentication session not found");
        return;
      }

      const firebaseToken = await currentUser.getIdToken();

      console.log("Firebase token received");

      /*
       * TODO:
       *
       * Send registration data to Spring Boot.
       *
       * Example:
       *
       * const response = await fetch(
       *   "http://YOUR-PC-IP:8080/auth/register",
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *       "Authorization": `Bearer ${firebaseToken}`,
       *     },
       *     body: JSON.stringify({
       *       phone,
       *       mpin,
       *     }),
       *   }
       * );
       *
       */

      console.log({
        phone,
        mpin,
        firebaseToken,
      });

      Alert.alert(
        "Registration successful",
        "Your account has been created."
      );

    } catch (err: any) {
      console.log("Registration error:", err);

      setError(
        err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // CONTINUE BUTTON
  // --------------------------------
  const handleContinue = async () => {
    if (loading) return;

    if (step === "phone") {
      await sendOtp();
      return;
    }

    if (step === "otp") {
      await verifyOtp();
      return;
    }

    if (step === "mpin") {
      continueMpin();
      return;
    }

    if (step === "confirm") {
      await completeRegistration();
    }
  };

  // --------------------------------
  // STEP TITLE
  // --------------------------------
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

  // --------------------------------
  // STEP DESCRIPTION
  // --------------------------------
  const getDescription = () => {
    switch (step) {
      case "phone":
        return "Enter your mobile number to get started.";

      case "otp":
        return `Enter the OTP sent to +91 ${phone}`;

      case "mpin":
        return "Create a 6-digit MPIN for secure login.";

      case "confirm":
        return "Enter your MPIN again to confirm.";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>NEXUS</Text>

          <Text style={styles.title}>
            {getTitle()}
          </Text>

          <Text style={styles.description}>
            {getDescription()}
          </Text>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressContainer}>
          {["phone", "otp", "mpin", "confirm"].map(
            (item, index) => {
              const steps = [
                "phone",
                "otp",
                "mpin",
                "confirm",
              ];

              const currentIndex =
                steps.indexOf(step);

              return (
                <View
                  key={item}
                  style={[
                    styles.progressBar,
                    index <= currentIndex &&
                      styles.progressActive,
                  ]}
                />
              );
            }
          )}
        </View>

        {/* FORM */}
        <View style={styles.form}>

          {/* PHONE */}
          {step === "phone" && (
            <>
              <Text style={styles.label}>
                Mobile number
              </Text>

              <View style={styles.phoneContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryText}>
                    🇮🇳 +91
                  </Text>
                </View>

                <TextInput
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(
                      text
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10)
                    );
                    setError("");
                  }}
                  placeholder="Mobile number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={styles.phoneInput}
                />
              </View>
            </>
          )}

          {/* OTP */}
          {step === "otp" && (
            <>
              <Text style={styles.label}>
                Verification code
              </Text>

              <TextInput
                value={otp}
                onChangeText={(text) => {
                  setOtp(
                    text
                      .replace(/[^0-9]/g, "")
                      .slice(0, 6)
                  );
                  setError("");
                }}
                placeholder="000000"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                style={styles.otpInput}
                textAlign="center"
                autoFocus
              />

              <TouchableOpacity
                onPress={() => {
                  setStep("phone");
                  setOtp("");
                  setConfirmation(null);
                  setError("");
                }}
                style={styles.changeNumber}
              >
                <Text style={styles.changeNumberText}>
                  Change mobile number
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* MPIN */}
          {step === "mpin" && (
            <>
              <Text style={styles.label}>
                Create MPIN
              </Text>

              <TextInput
                value={mpin}
                onChangeText={(text) => {
                  setMpin(
                    text
                      .replace(/[^0-9]/g, "")
                      .slice(0, 6)
                  );
                  setError("");
                }}
                placeholder="••••••"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                style={styles.mpinInput}
                textAlign="center"
                autoFocus
              />

              <Text style={styles.hint}>
                Use a 6-digit MPIN that you can remember.
              </Text>
            </>
          )}

          {/* CONFIRM MPIN */}
          {step === "confirm" && (
            <>
              <Text style={styles.label}>
                Confirm MPIN
              </Text>

              <TextInput
                value={confirmMpin}
                onChangeText={(text) => {
                  setConfirmMpin(
                    text
                      .replace(/[^0-9]/g, "")
                      .slice(0, 6)
                  );
                  setError("");
                }}
                placeholder="••••••"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                style={styles.mpinInput}
                textAlign="center"
                autoFocus
              />
            </>
          )}

          {/* ERROR */}
          {error.length > 0 && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          {/* CONTINUE */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.buttonText}>
                {step === "phone"
                  ? "Send OTP"
                  : step === "otp"
                  ? "Verify OTP"
                  : step === "mpin"
                  ? "Continue"
                  : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          {/* BACK */}
          {step !== "phone" && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setError("");

                if (step === "otp") {
                  setStep("phone");
                } else if (step === "mpin") {
                  setStep("otp");
                } else if (step === "confirm") {
                  setStep("mpin");
                }
              }}
              disabled={loading}
            >
              <Text style={styles.backText}>
                ← Back
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your account is protected with
          </Text>

          <Text style={styles.securityText}>
            Firebase Authentication
          </Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

// --------------------------------
// STYLES
// --------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  header: {
    alignItems: "center",
  },

  logo: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#2563EB",
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 320,
  },

  progressContainer: {
    flexDirection: "row",
    gap: 7,
    marginTop: 35,
    marginBottom: 30,
  },

  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
  },

  progressActive: {
    backgroundColor: "#2563EB",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 9,
  },

  phoneContainer: {
    flexDirection: "row",
    height: 58,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    overflow: "hidden",
  },

  countryCode: {
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },

  countryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#0F172A",
  },

  otpInput: {
    height: 64,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 10,
    color: "#0F172A",
  },

  mpinInput: {
    height: 64,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: 8,
    color: "#0F172A",
  },

  hint: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#64748B",
  },

  changeNumber: {
    alignItems: "center",
    marginTop: 18,
  },

  changeNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },

  errorContainer: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },

  button: {
    height: 58,
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  backText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
    marginTop: 30,
  },

  footerText: {
    fontSize: 12,
    color: "#94A3B8",
  },

  securityText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
});

