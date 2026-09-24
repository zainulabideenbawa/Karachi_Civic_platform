import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ixnanzigsimevlysthxg.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bmFuemlnc2ltZXZseXN0aHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjk1MjMsImV4cCI6MjEwNTg0NTUyM30.lNAvcsuS5Hgd1i2ug_TYM2j3aJAdvC3Ih1aG5hCMHE4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cast an affected vote on an issue (Me Too)
 */
export async function recordAffectedVote(issueId: string, userId: string, weight: number = 1.0) {
  try {
    const { data, error } = await supabase.rpc("cast_affected_vote", {
      p_issue_id: issueId,
      p_user_id: userId,
      p_weight: weight,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error recording affected vote in Supabase:", err);
    return null;
  }
}

/**
 * Cast citizen confirmation vote (Fixed vs Not Fixed)
 */
export async function recordConfirmationVote(
  issueId: string,
  userId: string,
  vote: "fixed" | "not_fixed",
  reason?: string
) {
  try {
    const { data, error } = await supabase.rpc("cast_confirmation_vote", {
      p_issue_id: issueId,
      p_user_id: userId,
      p_vote: vote,
      p_reason: reason || null,
      p_weight: 1.0,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error recording confirmation in Supabase:", err);
    return null;
  }
}

/**
 * Trigger Supabase edge function to recalculate scores
 */
export async function triggerScoreRecalculation() {
  try {
    const res = await fetch("https://ixnanzigsimevlysthxg.supabase.co/functions/v1/recalculate-scores", {
      method: "POST",
    });
    return await res.json();
  } catch (err) {
    console.error("Error triggering recalculate-scores edge function:", err);
    return null;
  }
}
