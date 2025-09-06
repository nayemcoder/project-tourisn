// src/lib/database.types.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string;
          full_name:  string | null;
          avatar_url: string | null;
          role:       'traveler' | 'local_guide' | 'business_owner' | 'admin';
          email:      string | null;
          password:   string | null;
          created_at: string;
        };
        Insert: {
          id?:         string;
          full_name?:  string | null;
          avatar_url?: string | null;
          role:        'traveler' | 'local_guide' | 'business_owner' | 'admin';
          email?:      string | null;
          password?:   string | null;
          created_at?: string;
        };
        Update: {
          id?:         string;
          full_name?:  string | null;
          avatar_url?: string | null;
          role?:       'traveler' | 'local_guide' | 'business_owner' | 'admin';
          email?:      string | null;
          password?:   string | null;
          created_at?: string;
        };
      };
    };
    Views:           Record<string, never>;
    Functions:       Record<string, never>;
    Enums:           Record<string, never>;
    CompositeTypes:  Record<string, never>;
  };
}