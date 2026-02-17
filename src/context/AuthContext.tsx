"use client";

import { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailPendingVerification: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { signIn, signOut } = useAuthActions();
  const convexUser = useQuery(api.users.current);
  const updateProfileMutation = useMutation(api.users.updateProfile);
  const sendOTPMutation = useMutation(api.otp.sendCode);
  const verifyOTPMutation = useMutation(api.otp.verifyCode);

  // Map Convex user to our User interface
  const user: User | null = convexUser
    ? {
      id: convexUser._id,
      email: convexUser.email || "",
      firstName: convexUser.name?.split(" ")[0] || "",
      lastName: convexUser.name?.split(" ").slice(1).join(" ") || "",
      phone: convexUser.phone || undefined,
      role: (convexUser.role as "user" | "admin") || "user",
      createdAt: new Date(convexUser._creationTime).toISOString(),
      emailVerified: !!convexUser.emailVerificationTime,
    }
    : null;

  // Loading: convexUser is undefined (not yet loaded) vs null (not authenticated)
  const isLoading = convexUser === undefined;
  // User is only fully authenticated if their email is verified
  const isAuthenticated = !!user && user.emailVerified;
  // True when user has a session but hasn't verified their email yet
  const isEmailPendingVerification = !!user && !user.emailVerified;
  const isAdmin = user?.role === "admin";

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const formData = new FormData();
        formData.set("email", email);
        formData.set("password", password);
        formData.set("flow", "signIn");
        await signIn("password", formData);
        return { success: true };
      } catch (error: unknown) {
        const raw = error instanceof Error ? error.message : "";
        let message: string;
        if (/InvalidSecret|invalid.*password|incorrect/i.test(raw)) {
          message = "Incorrect password. Please try again.";
        } else if (/Could not find|not found|no user|no account/i.test(raw)) {
          message = "No account found with this email. Please sign up first.";
        } else if (/too many|rate.?limit/i.test(raw)) {
          message = "Too many login attempts. Please wait a moment and try again.";
        } else {
          message = "Login failed. Please check your email and password.";
        }
        return { success: false, error: message };
      }
    },
    [signIn]
  );


  const register = useCallback(
    async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
      try {
        const formData = new FormData();
        formData.set("email", data.email);
        formData.set("password", data.password);
        formData.set("name", `${data.firstName} ${data.lastName}`);
        formData.set("role", "user");
        formData.set("flow", "signUp");
        await signIn("password", formData);
        return { success: true };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
        return { success: false, error: message };
      }
    },
    [signIn]
  );

  const logout = useCallback(async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  }, [signOut]);

  const updateProfile = useCallback(
    async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
      if (!user) {
        return { success: false, error: "Not authenticated" };
      }

      try {
        const name =
          data.firstName || data.lastName
            ? `${data.firstName ?? user.firstName} ${data.lastName ?? user.lastName}`
            : undefined;

        await updateProfileMutation({
          name,
          phone: data.phone,
        });

        return { success: true };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to update profile";
        return { success: false, error: message };
      }
    },
    [user, updateProfileMutation]
  );

  const sendOTP = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await sendOTPMutation({ email });
        return { success: true };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to send verification code";
        return { success: false, error: message };
      }
    },
    [sendOTPMutation]
  );

  const verifyOTP = useCallback(
    async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await verifyOTPMutation({ email, code });
        if (!result.success) {
          return { success: false, error: result.error || "Invalid code" };
        }
        return { success: true };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to verify code";
        return { success: false, error: message };
      }
    },
    [verifyOTPMutation]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isEmailPendingVerification,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
