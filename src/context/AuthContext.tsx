"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "user" | "admin";
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (error) {
        // If profile doesn't exist yet, return basic user info from auth
        if (error.code === "PGRST116") {
          console.log("Profile not found, using auth data");
          return {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            firstName: supabaseUser.user_metadata?.first_name || "",
            lastName: supabaseUser.user_metadata?.last_name || "",
            phone: undefined,
            role: "user",
            createdAt: supabaseUser.created_at || new Date().toISOString(),
          };
        }
        console.error("Error fetching profile:", error.message || error);
        // Return basic info even on error
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          firstName: "",
          lastName: "",
          phone: undefined,
          role: "user",
          createdAt: supabaseUser.created_at || new Date().toISOString(),
        };
      }

      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || undefined,
        role: profile.role || "user",
        createdAt: profile.created_at,
      };
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      // Return basic info even on error
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        firstName: "",
        lastName: "",
        phone: undefined,
        role: "user",
        createdAt: supabaseUser.created_at || new Date().toISOString(),
      };
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchProfile(session.user);
          setUser(profile);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user);
        setUser(profile);
      }

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Login failed. Please try again." };
    }
  }, [supabase, fetchProfile]);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Update the profile with phone if provided
      if (authData.user && data.phone) {
        await supabase
          .from("profiles")
          .update({ phone: data.phone })
          .eq("id", authData.user.id);
      }

      if (authData.user) {
        const profile = await fetchProfile(authData.user);
        setUser(profile);
      }

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Registration failed. Please try again." };
    }
  }, [supabase, fetchProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        })
        .eq("id", user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setUser((prev) => prev ? { ...prev, ...data } : null);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to update profile" };
    }
  }, [user, supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateProfile,
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
