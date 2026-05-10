import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

const DISALLOW = ["/admin", "/admin/", "/api/", "/login"];

// Explicitly allow major AI / LLM crawlers so this site is eligible for
// inclusion in retrieval, summarization, and citation by answer engines.
const AI_BOTS = [
  "GPTBot", // OpenAI training crawler
  "OAI-SearchBot", // OpenAI ChatGPT search
  "ChatGPT-User", // OpenAI on-demand fetch
  "ClaudeBot", // Anthropic training/serving crawler
  "Claude-Web", // Anthropic on-demand fetch (legacy)
  "anthropic-ai", // Anthropic generic
  "PerplexityBot", // Perplexity citations
  "Perplexity-User", // Perplexity on-demand fetch
  "Google-Extended", // Google Gemini / Vertex AI training
  "Applebot-Extended", // Apple Intelligence
  "Bytespider", // ByteDance / Doubao
  "meta-externalagent", // Meta AI agents
  "cohere-ai", // Cohere
  "DuckAssistBot", // DuckDuckGo's AI answer feature
  "Diffbot", // Diffbot for AI knowledge graphs
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_BOTS.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: siteUrl("/sitemap.xml"),
    host: siteUrl(),
  };
}
