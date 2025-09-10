// Supabase Edge Function: chat-module
// - Utilise OPENAI_API_KEY côté serveur
// - Prend en compte un champ facultatif `knowledge` envoyé par le front
// - Sinon, récupère des infos utiles (targets, deals, evaluations) pour l'utilisateur

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Json = Record<string, any>;

interface RequestBody {
  message: string;
  context?: Json;
  knowledge?: string; // données textes fournies par l'utilisateur
  stream?: boolean;
}

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// CORS headers for browser access
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabaseClient(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
  });
}

async function fetchUserId(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

async function fetchContextFromDb(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const [targetsRes, dealsRes, evalsRes, tgimKnowledgeRes] = await Promise.all([
    supabase
      .from("targets")
      .select("id,name,sector,location,main_figures,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("deals")
      .select("id,name,status,target_id,detail,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("evaluations")
      .select(
        "id,company_name,min_valuation,max_valuation,risk_score,report,created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("tgim_knowledge")
      .select("category,title,content,keywords")
      .order("category", { ascending: true }),
  ]);

  return {
    targets: targetsRes.data || [],
    deals: dealsRes.data || [],
    evaluations: evalsRes.data || [],
    tgimKnowledge: tgimKnowledgeRes.data || [],
  } as Json;
}

function buildSystemPrompt(dbCtx: Json | null, knowledge?: string) {
  const parts: string[] = [];
  parts.push(
    "Tu es l'assistant IA de TGIM (Thank God it is Monday!), une plateforme française spécialisée dans la reprise d'entreprise. Tu es expert en acquisition de PME, négociation M&A, storytelling et financement. Réponds en français, avec clarté, concision et étapes actionnables.",
  );

  // Toujours inclure les connaissances TGIM
  if (dbCtx?.tgimKnowledge?.length) {
    parts.push("== CONNAISSANCES TGIM ==");
    const knowledgeByCategory = dbCtx.tgimKnowledge.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    Object.entries(knowledgeByCategory).forEach(([category, items]: [string, any]) => {
      parts.push(`\n### ${category.toUpperCase()}`);
      items.forEach((item: any) => {
        parts.push(`**${item.title}**: ${item.content}`);
      });
    });
  }

  if (knowledge && knowledge.trim()) {
    parts.push("\n== DONNÉES FOURNIES PAR L'UTILISATEUR ==");
    parts.push(knowledge.trim());
  } else if (dbCtx) {
    parts.push("\n== DONNÉES UTILISATEUR ==");
    const { targets, deals, evaluations } = dbCtx;
    if (targets?.length) {
      parts.push(
        `Cibles récentes: ${targets
          .slice(0, 3)
          .map((t: any) => `${t.name} (${t.sector || "secteur n/d"})`)
          .join(" | ")}`,
      );
    }
    if (deals?.length) {
      parts.push(
        `Deals récents: ${deals
          .slice(0, 3)
          .map((d: any) => `${d.name || d.id} [${d.status || "n/d"}]`)
          .join(" | ")}`,
      );
    }
    if (evaluations?.length) {
      parts.push(
        `Évaluations: ${evaluations
          .slice(0, 3)
          .map(
            (e: any) =>
              `${e.company_name || "société n/d"}: ${e.min_valuation ?? "?"}€–${
                e.max_valuation ?? "?"
              }€, risque ${e.risk_score ?? "?"}/100`,
          )
          .join(" | ")}`,
      );
    }
  }

  parts.push(
    "\nStructure ta réponse: 1) Analyse 2) Stratégie 3) Arguments 4) Actions concrètes 5) Risques/opportunités. Utilise les connaissances TGIM pour donner des conseils pertinents sur la reprise d'entreprise.",
  );
  return parts.join("\n");
}

async function callOpenAI(systemPrompt: string, userMessage: string) {
  if (!OPENAI_API_KEY) {
    return {
      response:
        "Mode démo (sans OpenAI). Stratégie: Approche collaborative. Actions: préparer une contre-proposition, comparer aux multiples du secteur, planifier une réunion.",
      metadata: { mode: "mock" },
    };
  }

  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 800,
    stream: false,
  };

  const resp = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`OpenAI error ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content || "Réponse indisponible.";
  return { response: content, metadata: { model: body.model, tokens: data?.usage, mode: "openai" } };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders } });
  }
  try {
    const supabase = getSupabaseClient(req);
    const { message, context, knowledge }: RequestBody = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message manquant" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const userId = await fetchUserId(supabase);
    let dbContext: Json | null = null;

    if (!knowledge && userId) {
      dbContext = await fetchContextFromDb(supabase, userId);
    }

    const systemPrompt = buildSystemPrompt(dbContext, knowledge);
    const ai = await callOpenAI(systemPrompt, message);

    return new Response(JSON.stringify(ai), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (e) {
    console.error("chat-module error:", e);
    return new Response(
      JSON.stringify({ error: "Server error", detail: String(e?.message || e) }),
      { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 500 },
    );
  }
});



