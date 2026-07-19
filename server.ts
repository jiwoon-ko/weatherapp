import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  getMockWeatherData,
  mapKoreanQueryToEnglish,
  applyLocalJejuAdjustments
} from "./src/weatherLogic.js";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware for parsing JSON
  app.use(express.json());

  // API Route: Weather Proxy
  app.get("/api/weather", async (req, res) => {
    // Set no-cache headers to prevent browser caching of stale mock responses
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const rawQuery = String(req.query.q || "Seoul");
    const apiKey = process.env.WEATHER_API_KEY?.trim();

    // Helper: generate mock data if no API Key is provided or if requested
    const isKeyMissing = !apiKey || apiKey === "" || apiKey === "undefined" || apiKey === "null" || apiKey === "YOUR_WEATHERAPI_KEY" || apiKey.includes("MY_");

    if (isKeyMissing) {
      console.log(`[WeatherAPI Proxy] API key is missing or placeholder. Serving mock data for: ${rawQuery}`);
      
      const mockData = getMockWeatherData(rawQuery);
      return res.json({
        ...mockData,
        isMock: true,
        message: "WEATHER_API_KEY가 설정되지 않아 데모 데이터를 표시합니다. AI Studio 설정에서 키를 추가하면 실시간 날씨 정보를 불러올 수 있습니다."
      });
    }

    // Resolve Korean / local neighborhood queries to valid English search queries for WeatherAPI.com
    const { apiQuery, displayName } = mapKoreanQueryToEnglish(rawQuery);

    try {
      // Fetch real weather data from WeatherAPI
      const url = `http://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(apiQuery)}&days=3&aqi=yes&alerts=no&lang=ko`;
      
      let response = await fetch(url);
      
      // If the primary query fails with 400, try a standard fallback (e.g. "Seoul" or "Jeju, South Korea")
      if (!response.ok && response.status === 400) {
        console.log(`[WeatherAPI Fallback] Query "${apiQuery}" failed with 400. Trying fallback query...`);
        const isJejuFallback = ["제주", "jeju", "노형", "아라", "용담", "연동", "외도", "화북", "삼양", "이도", "일도", "삼도", "도남", "애월", "한림", "조천", "구좌", "대정", "남원", "성산", "서귀포"].some(k => rawQuery.toLowerCase().includes(k));
        const fallbackQuery = isJejuFallback ? "Jeju, South Korea" : "Seoul";
        const fallbackUrl = `http://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(fallbackQuery)}&days=3&aqi=yes&alerts=no&lang=ko`;
        
        response = await fetch(fallbackUrl);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[WeatherAPI Error] Status ${response.status}:`, errorText);
        
        // Handle city not found or invalid key gracefully
        return res.status(response.status).json({
          error: "API_ERROR",
          status: response.status,
          message: `날씨 정보를 가져오는 데 실패했습니다. 지역명을 영문으로 입력했는지 확인해 주세요. (Status: ${response.status})`
        });
      }

      let data = await response.json();

      // Apply procedural local adjustments for specific Jeju neighborhoods
      data = applyLocalJejuAdjustments(data, rawQuery);

      // Override the returned location name with the user's queried display name (e.g., "제주시 노형동")
      if (data && data.location) {
        data.location.name = displayName;
      }

      return res.json({
        ...data,
        isMock: false
      });
    } catch (error: any) {
      console.error("[WeatherAPI Exception]:", error);
      return res.status(500).json({
        error: "SERVER_EXCEPTION",
        message: "날씨 정보를 불러오는 도중 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
