// Database types for Supabase

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          discount: number | null;
          category: string;
          image_url: string | null;
          hover_image_url: string | null;
          sizes: string[];
          colors: string[];
          stock: number;
          sold_out: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          discount?: number | null;
          category: string;
          image_url?: string | null;
          hover_image_url?: string | null;
          sizes?: string[];
          colors?: string[];
          stock?: number;
          sold_out?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          discount?: number | null;
          category?: string;
          image_url?: string | null;
          hover_image_url?: string | null;
          sizes?: string[];
          colors?: string[];
          stock?: number;
          sold_out?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          payment_status: "pending" | "paid" | "failed" | "refunded";
          payment_reference: string | null;
          subtotal: number;
          shipping: number;
          total: number;
          shipping_address: {
            first_name: string;
            last_name: string;
            phone: string;
            street: string;
            city: string;
            state: string;
            country: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_reference?: string | null;
          subtotal: number;
          shipping: number;
          total: number;
          shipping_address: {
            first_name: string;
            last_name: string;
            phone: string;
            street: string;
            city: string;
            state: string;
            country: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_reference?: string | null;
          subtotal?: number;
          shipping?: number;
          total?: number;
          shipping_address?: {
            first_name: string;
            last_name: string;
            phone: string;
            street: string;
            city: string;
            state: string;
            country: string;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: number;
          quantity: number;
          size: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: number;
          quantity: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          product_price?: number;
          quantity?: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
