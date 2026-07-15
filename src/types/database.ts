export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "admin" | "user";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: AppRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: AppRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          role?: AppRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      adhkars: {
        Row: {
          id: string;
          category_id: string;
          title: string;
          arabic_text: string;
          latin_transliteration: string | null;
          english_translation: string | null;
          recitation_context: string | null;
          target_count: number;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          title: string;
          arabic_text: string;
          latin_transliteration?: string | null;
          english_translation?: string | null;
          recitation_context?: string | null;
          target_count?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          title?: string;
          arabic_text?: string;
          latin_transliteration?: string | null;
          english_translation?: string | null;
          recitation_context?: string | null;
          target_count?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          adhkar_id: string;
          date: string;
          completed_count: number;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          adhkar_id: string;
          date?: string;
          completed_count?: number;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          adhkar_id?: string;
          date?: string;
          completed_count?: number;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      app_role: AppRole;
    };
  };
}

// Convenience types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Adhkar = Tables<"adhkars">;
export type UserProgress = Tables<"user_progress">;

// Joined types for common queries
export type CategoryWithCount = Category & {
  adhkar_count: number;
};

export type AdhkarWithProgress = Adhkar & {
  progress: UserProgress | null;
};

export type CategoryWithAdhkars = Category & {
  adhkars: Adhkar[];
};
