// utils/supabase.js — Mix-R
// IMPORTANT: Mix-R uses the "drinks" column ONLY
// It NEVER reads or writes the "recipes" column — that belongs to Che AF only
// Both apps share the same Supabase database but use completely separate columns:
//   Che AF  → recipes column
//   Mix-R   → drinks column
//   Shared  → favorites, shopping_list, pantry

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Mix-R loads ONLY from the "drinks" column — never "recipes"
export async function loadUserData(userId) {
  const { data, error } = await supabase
    .from("user_data")
    .select("drinks, favorites, shopping_list, pantry, is_pro, ai_calls_used, member_number, mixr_access")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  if (data) {
    return {
      recipes:       data.drinks        || [],  // internally called recipes but sourced from drinks column
      favorites:     data.favorites     || [],
      shopping_list: data.shopping_list || [],
      pantry:        data.pantry        || [],
      is_pro:        data.is_pro,
      ai_calls_used: data.ai_calls_used,
      member_number: data.member_number,
      mixr_access:   data.mixr_access,
    };
  }
  return data;
}

// Mix-R saves ONLY to the "drinks" column — never "recipes"
export async function saveUserData(userId, payload) {
  const { recipes, favorites, shopping_list, pantry } = payload;

  const { error } = await supabase
    .from("user_data")
    .upsert({
      user_id:       userId,
      drinks:        recipes,       // ✅ Mix-R drinks → drinks column only
      favorites:     favorites     || [],
      shopping_list: shopping_list || [],
      pantry:        pantry        || [],
      updated_at:    new Date().toISOString(),
      // ✅ "recipes" column intentionally never written — belongs to Che AF
    });

  if (error) throw error;
}
