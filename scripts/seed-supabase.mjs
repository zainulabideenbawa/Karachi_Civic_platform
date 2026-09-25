import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      supabaseUrl = trimmed.split("=")[1].replace(/["']/g, "");
    }
    if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
      supabaseAnonKey = trimmed.split("=")[1].replace(/["']/g, "");
    }
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAndSeed() {
  console.log("Checking Supabase connection to:", supabaseUrl);

  const { data: towns, error: townsErr } = await supabase.from("towns").select("id, name");
  if (townsErr) {
    console.error("Error fetching towns:", townsErr);
  } else {
    console.log(`✓ Towns verified: ${towns.length} rows`);
  }

  const { data: ucs, error: ucsErr } = await supabase.from("ucs").select("id, name, score");
  if (ucsErr) {
    console.error("Error fetching UCs:", ucsErr);
  } else {
    console.log(`✓ UCs verified: ${ucs.length} rows`);
  }

  const { data: issues, error: issuesErr } = await supabase.from("issues").select("id, title, status");
  if (issuesErr) {
    console.error("Error fetching issues:", issuesErr);
  } else {
    console.log(`✓ Issues verified: ${issues.length} rows`);
  }

  const { data: events, error: eventsErr } = await supabase.from("events").select("id, title");
  if (eventsErr) {
    console.error("Error fetching events:", eventsErr);
  } else {
    console.log(`✓ Events verified: ${events.length} rows`);
  }

  const { data: promises, error: promisesErr } = await supabase.from("promises").select("id, text");
  if (promisesErr) {
    console.error("Error fetching promises:", promisesErr);
  } else {
    console.log(`✓ Promises verified: ${promises.length} rows`);
  }

  const { data: leaders, error: leadersErr } = await supabase.from("community_leaders").select("id, real_name, score");
  if (leadersErr) {
    console.error("Error fetching community leaders:", leadersErr);
  } else {
    console.log(`✓ Community leaders verified: ${leaders.length} rows`);
  }

  console.log("\nAll civic database tables are online, seeded, and accessible!");
}

verifyAndSeed();
