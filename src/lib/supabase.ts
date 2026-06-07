import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://erwdxawoyrelyjkpgngs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zoHSousnbZPtmr5A-xbLLQ_v81HOqLm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      wilayas: {
        Row: { id: number; code: string; name_arabic: string; name_french: string; name_english: string };
      };
      baladiyas: {
        Row: { id: number; wilaya_id: number; name_arabic: string; name_french: string };
      };
      specialties: {
        Row: { id: number; name_arabic: string; name_french: string; name_english: string };
      };
      doctors: {
        Row: {
          id: number; name: string; specialty_id: number; wilaya_id: number; baladiya_id: number;
          address: string; phone: string; fee: number; rating: number; reviews_count: number;
          years_experience: number; patients_count: number; satisfaction_rate: number;
          about: string; tags: string[]; image_url: string; is_verified: boolean;
          lat: number; lng: number; created_at: string;
        };
      };
      profiles: {
        Row: { id: string; full_name: string; phone: string; wilaya_id: number; blood_type: string; avatar_url: string };
      };
      blood_donors: {
        Row: { id: number; user_id: string; name: string; blood_type: string; wilaya_id: number; baladiya_id: number; phone: string; is_available: boolean; hide_name: boolean; lat: number; lng: number };
      };
      pharmacies: {
        Row: { id: number; name: string; wilaya_id: number; baladiya_id: number; address: string; phone: string; on_call_24h: boolean; night_shift: boolean; lat: number; lng: number };
      };
      hospitals: {
        Row: { id: number; name: string; type: string; wilaya_id: number; baladiya_id: number; address: string; phone: string; services: string[]; beds_count: number; lat: number; lng: number };
      };
      equipment_donors: {
        Row: { id: number; user_id: string; equipment_type: string; condition: string; wilaya_id: number; baladiya_id: number; phone: string; description: string; image_url: string; is_available: boolean; lat: number; lng: number };
      };
      appointments: {
        Row: { id: number; user_id: string; doctor_id: number; appointment_date: string; appointment_time: string; visit_type: string; status: string; notes: string; created_at: string };
      };
      reviews: {
        Row: { id: number; user_id: string; doctor_id: number; rating: number; review_text: string; created_at: string };
      };
      notifications: {
        Row: { id: number; user_id: string; title: string; message: string; is_read: boolean; type: string; created_at: string };
      };
    };
  };
};
