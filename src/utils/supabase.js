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

export async function loadUserData(userId) {
  const { data, error } = await supabase
    .from("user_data")
    .select("drinks, favorites, shopping_list, pantry, is_pro, ai_calls_used, member_number")
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  // Map drinks → recipes key so App.jsx works seamlessly
  if (data) {
    return {
      ...data,
      recipes: data.drinks || [],
    };
  }
  return data;
}

export async function saveUserData(userId, payload) {
  // Map recipes → drinks column for Mix-R
  const { recipes, ...rest } = payload;
  const { error } = await supabase
    .from("user_data")
    .upsert({
      user_id: userId,
      ...rest,
      drinks: recipes,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}
