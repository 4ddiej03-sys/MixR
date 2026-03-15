// utils/useMixRSubscription.js
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const FREE_LIMIT = 10;

export function useMixRSubscription(user) {
  const [isPro, setIsPro]         = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [hasAccess, setHasAccess] = useState(false); // Has Mix-R access at all
  const [aiCallsUsed, setAiCalls] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    async function check() {
      try {
        // Ensure row exists
        await supabase
          .from("user_data")
          .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });

        const { data } = await supabase
          .from("user_data")
          .select("is_pro, ai_calls_used, member_number, mixr_access")
          .eq("user_id", user.id)
          .single();

        if (!data) { setLoading(false); return; }

        setAiCalls(data.ai_calls_used || 0);

        // Founder (#1) gets everything free forever
        if (data.member_number === 1) {
          setIsFounder(true);
          setIsPro(true);
          setHasAccess(true);
        // Has explicit Mix-R access (signed up on Mix-R or bundle subscriber)
        } else if (data.mixr_access) {
          setHasAccess(true);
          if (data.is_pro) setIsPro(true);
        }
        // Che AF only users → hasAccess stays false → shows AccessGate

      } catch (err) {
        console.error("Mix-R subscription check failed:", err);
      }
      setLoading(false);
    }
    check();
  }, [user]);

  async function grantMixRAccess() {
    if (!user) return;
    await supabase
      .from("user_data")
      .update({ mixr_access: true })
      .eq("user_id", user.id);
    setHasAccess(true);
  }

  async function incrementCalls() {
    if (!user || isPro || isFounder) return;
    const next = aiCallsUsed + 1;
    setAiCalls(next);
    await supabase
      .from("user_data")
      .update({ ai_calls_used: next })
      .eq("user_id", user.id);
  }

  const canUseAI  = isFounder || isPro || aiCallsUsed < FREE_LIMIT;
  const callsLeft = isFounder || isPro ? "∞" : Math.max(0, FREE_LIMIT - aiCallsUsed);

  return {
    isPro, isFounder, hasAccess, canUseAI,
    callsLeft, aiCallsUsed, loading,
    incrementCalls, grantMixRAccess,
  };
}
