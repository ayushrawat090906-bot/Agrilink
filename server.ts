import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini AI client initialization with telemetry User-Agent
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "AgriLink", timestamp: new Date().toISOString() });
});

// AI Agricultural Market & Demand Advisor Endpoint
app.post("/api/ai/forecast-advisor", async (req, res) => {
  try {
    const { cropName, region, currentDemandKg, expectedDemandKg, changePercent, userQuery } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback with detailed domain-specific insights if key is not set
      return res.json({
        advice: `Based on regional mandi trends for ${cropName || "Tomato"} in ${region || "Western India"}, demand is anticipated to change by ${changePercent || "+29"}%. Farmers and FPOs are advised to aggregate produce into Grade-A lots to capture premium institutional buyer rates, coordinate cold chain logistics via regional aggregation hubs, and avoid distress selling in local mandis.`,
        keyDrivers: [
          "Monsoon-induced supply fluctuations in southern growing belts",
          "Surge in urban institutional procurement (HORECA & Quick-Commerce)",
          "Optimal harvesting window in regional farmer clusters over the next 10-15 days"
        ],
        actionPlan: "Coordinate with local FPOs for cluster-level sorting and graded packaging before dispatch."
      });
    }

    const ai = getAiClient();
    const prompt = `You are AgriLink's Senior Agri-Economist and Supply-Chain Specialist in India.
Context:
Crop: ${cropName || "Tomato"}
Region: ${region || "Maharashtra / Western India"}
Current Market Demand: ${currentDemandKg || "12,000"} kg
Expected Demand: ${expectedDemandKg || "15,500"} kg (${changePercent || "+29"}% trend)
User Question/Focus: ${userQuery || "Provide actionable aggregation advice for small farmers and FPOs to maximize realization."}

Provide a concise, high-value advisory with:
1. Market Context & Demand Outlook (2-3 sentences)
2. 3 Specific Actionable Recommendations for Farmers & FPOs (e.g. grading, aggregation schedule, cold storage)
3. Pricing & Negotiation Insight for Bulk Buyer contracts.
Keep tone practical, encouraging, and focused on reducing supply chain waste and bypassing unnecessary middlemen.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.json({
      advice: response.text || "Market demand is strong. Focus on cluster aggregation for bulk buyers.",
      status: "success"
    });
  } catch (error: any) {
    console.error("Gemini Advisor Error:", error);
    res.status(500).json({
      error: "Unable to generate AI analysis at this moment",
      fallback: "Aggregate farm produce into 500kg+ clusters to meet bulk buyer specs and secure 25-35% higher price realization."
    });
  }
});

async function startServer() {
  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgriLink Server running on http://localhost:${PORT}`);
  });
}

startServer();
