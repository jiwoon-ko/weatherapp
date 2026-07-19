import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Navigation,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Thermometer,
  Compass,
  Calendar,
  Sparkles,
  Clock,
  AlertTriangle,
  RefreshCw,
  Sunset,
  Sunrise,
  Gauge,
  MapPin,
  Check,
  Star,
  Shirt,
  X,
  Plus
} from "lucide-react";
import { WeatherData, WeatherError } from "./types";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Seoul");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WeatherError | null>(null);
  const [locating, setLocating] = useState(false);

  // Load favorites from local storage or set defaults
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("weather_favorites");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // High quality default favorite cities containing Jeju neighborhoods
    return ["서울", "제주시 노형동", "제주시 용담동", "부산", "도쿄"];
  });

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("weather_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite location
  const toggleFavorite = (city: string) => {
    if (!city || city.trim() === "") return;
    const trimmed = city.trim();
    const exists = favorites.some((fav) => fav.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setFavorites((prev) => prev.filter((fav) => fav.toLowerCase() !== trimmed.toLowerCase()));
    } else {
      setFavorites((prev) => [...prev, trimmed]);
    }
  };

  // Remove favorite location
  const removeFavorite = (city: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.toLowerCase() !== city.toLowerCase()));
  };

  // Fetch weather data
  const fetchWeather = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError({
          error: data.error || "FETCH_FAILED",
          message: data.message || "날씨 정보를 불러오는 데 실패했습니다."
        });
        setWeatherData(null);
      } else {
        setWeatherData(data);
        setCurrentCity(data.location.name);
      }
    } catch (err) {
      console.error(err);
      setError({
        error: "NETWORK_ERROR",
        message: "네트워크 연결이 원활하지 않습니다. 서버 상태를 확인해 주세요."
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeather(currentCity);
  }, []);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery.trim());
    }
  };

  // Fetch current user location weather
  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
        setLocating(false);
      },
      (err) => {
        console.error(err);
        let msg = "위치 정보를 가져올 수 없습니다. 권한을 허용했는지 확인해 주세요.";
        if (err.code === 1) {
          msg = "위치 정보 접근 권한이 거부되었습니다. 설정에서 허용해 주세요.";
        }
        alert(msg);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Dynamic Weather tips generator based on current metrics
  const getWeatherTips = (data: WeatherData) => {
    const tips = [];
    const current = data.current;
    const isRain = current.condition.text.includes("비") || current.precip_mm > 0;
    const temp = current.temp_c;
    const uv = current.uv;
    const humidity = current.humidity;
    const pm10 = current.air_quality?.pm10 || 0;

    if (isRain) {
      tips.push({
        id: "rain",
        text: "현재 비가 내리고 있거나 내릴 예정입니다. 외출 시 꼭 우산을 챙기세요!",
        color: "text-blue-400 bg-blue-950/40 border-blue-800/30"
      });
    }

    if (temp >= 28) {
      tips.push({
        id: "heat",
        text: "기온이 높고 무덥습니다. 충분한 수분을 섭취하고 무리한 야외 활동을 피하세요.",
        color: "text-amber-400 bg-amber-950/40 border-amber-800/30"
      });
    } else if (temp <= 5) {
      tips.push({
        id: "cold",
        text: "날씨가 많이 춥습니다. 감기 예방을 위해 따뜻한 겨울 외투를 착용해 주세요.",
        color: "text-sky-300 bg-sky-950/40 border-sky-800/30"
      });
    } else if (temp > 5 && temp <= 15) {
      tips.push({
        id: "breeze",
        text: "쌀쌀한 바람이 붑니다. 가디건이나 가벼운 자켓을 걸치는 것을 추천해요.",
        color: "text-emerald-300 bg-emerald-950/40 border-emerald-800/30"
      });
    }

    if (uv >= 6) {
      tips.push({
        id: "uv",
        text: "자외선 지수가 높습니다. 자외선 차단제(선크림)를 바르고 선글라스를 지참하세요.",
        color: "text-rose-400 bg-rose-950/40 border-rose-800/30"
      });
    }

    if (humidity >= 80 && temp >= 22) {
      tips.push({
        id: "humid",
        text: "습도가 높아 불쾌지수가 상승할 수 있습니다. 쾌적한 실내 환경 유지를 조언합니다.",
        color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/30"
      });
    }

    if (pm10 > 50) {
      tips.push({
        id: "air",
        text: "미세먼지 농도가 나쁨 수준입니다. 보건용 마스크를 착용하고 환기를 자제하세요.",
        color: "text-yellow-400 bg-yellow-950/40 border-yellow-800/30"
      });
    }

    // Default tip if nothing matches
    if (tips.length === 0) {
      tips.push({
        id: "good",
        text: "오늘 날씨는 대체로 선선하고 야외활동을 하기에 아주 좋은 환경입니다!",
        color: "text-green-400 bg-green-950/40 border-green-800/30"
      });
    }

    return tips;
  };

  // Convert English wind direction to Korean
  const getWindDirKorean = (dir: string) => {
    const mapping: Record<string, string> = {
      N: "북풍", NNE: "북북동풍", NE: "북동풍", ENE: "동북동풍",
      E: "동풍", ESE: "동남동풍", SE: "남동풍", SSE: "남남동풍",
      S: "남풍", SSW: "남남서풍", SW: "남서풍", WSW: "서남서풍",
      W: "서풍", WNW: "서북서풍", NW: "북서풍", NNW: "북북서풍"
    };
    return mapping[dir] || dir;
  };

  // Format PM10 and PM2.5 values and levels
  const getAirQualityLevel = (pm10: number, pm2_5: number) => {
    if (pm10 === 0 && pm2_5 === 0) return { label: "정보 없음", color: "text-gray-400 bg-gray-900/40 border-gray-800/30" };
    // Based on South Korean standards
    if (pm10 <= 30 && pm2_5 <= 15) return { label: "좋음 (Good)", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40" };
    if (pm10 <= 80 && pm2_5 <= 35) return { label: "보통 (Moderate)", color: "text-sky-400 bg-sky-950/40 border-sky-800/40" };
    if (pm10 <= 150 && pm2_5 <= 75) return { label: "나쁨 (Bad)", color: "text-orange-400 bg-orange-950/40 border-orange-800/40" };
    return { label: "매우 나쁨 (Very Bad)", color: "text-red-400 bg-red-950/40 border-red-800/40" };
  };

  // Get PM10 specific Korean status level & styling
  const getPM10KoreanLevelWithColor = (pm10: number) => {
    if (pm10 <= 30) return { label: "좋음", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (pm10 <= 80) return { label: "보통", color: "text-sky-300 bg-sky-500/10 border-sky-500/20" };
    if (pm10 <= 150) return { label: "나쁨", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
    return { label: "매우 나쁨", color: "text-red-400 bg-red-500/10 border-red-500/20" };
  };

  // Detailed clothing coordination (코디 팁) recommendation based on temperature
  const getOutfitRecommendation = (tempC: number) => {
    if (tempC >= 28) {
      return {
        level: "28°C 이상 (한여름 무더위)",
        clothes: "민소매, 반팔티, 반바지, 얇은 원피스, 린넨 의류",
        tip: "가장 무더운 날씨입니다. 땀 흡수와 배출이 잘 되고 통풍이 잘 되는 얇은 린넨이나 기능성 의류를 적극 추천드려요!"
      };
    } else if (tempC >= 23) {
      return {
        level: "23°C ~ 27°C (따뜻한 초여름)",
        clothes: "반팔티, 얇은 셔츠, 면바지, 반바지, 얇은 청바지",
        tip: "가볍고 캐주얼한 반팔티나 셔츠가 잘 어울리는 날씨예요. 실내 에어컨 냉방에 대비해 가벼운 린넨 자켓이나 얇은 가디건을 챙기면 더욱 좋습니다."
      };
    } else if (tempC >= 20) {
      return {
        level: "20°C ~ 22°C (포근하고 화창한 날씨)",
        clothes: "얇은 가디건, 긴팔 티셔츠, 블라우스, 슬랙스, 청바지",
        tip: "선선하고 기분 좋게 쾌적한 날씨입니다! 단품 긴팔티나 블라우스에 가벼운 가디건 혹은 자켓을 레이어드하는 연출이 완벽해요."
      };
    } else if (tempC >= 17) {
      return {
        level: "17°C ~ 19°C (선선한 봄/가을 환절기)",
        clothes: "자켓, 맨투맨, 가디건, 얇은 니트, 슬랙스, 청바지",
        tip: "활동하기 좋으나 아침저녁 일교차로 조금 쌀쌀할 수 있는 환절기입니다. 도톰한 맨투맨이나 가벼운 자켓, 트렌치코트가 유용합니다."
      };
    } else if (tempC >= 12) {
      return {
        level: "12°C ~ 16°C (서늘한 날씨)",
        clothes: "자켓, 트렌치코트, 야상, 청자켓, 가디건, 니트, 면바지, 청바지",
        tip: "공기가 제법 서늘해지는 시기입니다. 겉옷으로 데님 자켓, 야상, 가죽 재킷이나 트렌치코트를 든든하게 걸치고 안에는 니트를 받쳐 입는 센스가 필요해요."
      };
    } else if (tempC >= 9) {
      return {
        level: "9°C ~ 11°C (초겨울 기운)",
        clothes: "겨울 코트, 두꺼운 니트, 가죽 자켓, 기모 바지, 레이어드 의류",
        tip: "추위가 본격적으로 시작되는 날씨입니다. 두꺼운 겨울 코트나 야상 패딩을 슬슬 착용하시고, 포근한 니트나 가죽 재킷을 입어 체온을 탄탄히 보강하세요."
      };
    } else if (tempC >= 5) {
      return {
        level: "5°C ~ 8°C (겨울 추위)",
        clothes: "겨울 모직 코트, 가죽 자켓, 히트텍, 가죽의류, 기모 슬랙스, 레깅스",
        tip: "매서운 찬 바람이 붑니다. 모직 롱코트나 가벼운 패딩 점퍼 안에 기능성 발열 내의(히트텍)와 가디건을 함께 레이어드하여 세련되면서도 따뜻함을 유지하세요."
      };
    } else {
      return {
        level: "4°C 이하 (한겨울 한파)",
        clothes: "두꺼운 패딩, 롱패딩, 무스탕, 겨울 목도리, 장갑, 귀도리, 목폴라, 기모 팬츠",
        tip: "매우 혹독한 추위입니다! 롱패딩이나 두꺼운 보온 다운 자켓을 무조건 선택하시고, 목폴라와 함께 목도리, 장갑 등의 방한 소품을 겹겹이 코디해 감기를 예방하세요."
      };
    }
  };

  return (
    <div id="weather-app-container" className="min-h-screen text-white flex flex-col items-center p-4 md:p-10 weather-bg-gradient font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Atmospheric Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <main id="weather-dashboard-content" className="w-full max-w-5xl flex flex-col gap-6 z-10">
        
        {/* Header Branding */}
        <header id="app-header" className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl shadow-lg shadow-sky-500/20">
              <Sun className="h-6 w-6 text-white animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-sky-300 to-indigo-200 bg-clip-text text-transparent">
                오늘의 날씨 <span className="text-xs font-mono font-medium text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/30">Weather Live</span>
              </h1>
              <p className="text-xs text-slate-400">WeatherAPI 실시간 정보 및 예보 서비스</p>
            </div>
          </div>
          
          {/* Geolocation Button */}
          <button
            id="geolocation-btn"
            onClick={handleGeoLocation}
            disabled={locating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 active:scale-95 transition-all rounded-full cursor-pointer disabled:opacity-50"
          >
            {locating ? (
              <RefreshCw className="h-4 w-4 animate-spin text-sky-400" />
            ) : (
              <Navigation className="h-4 w-4 text-sky-400" />
            )}
            내 위치 날씨 확인
          </button>
        </header>

        {/* Search Bar & Favorites */}
        <section id="search-and-presets" className="flex flex-col gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                id="search-input"
                type="text"
                placeholder="동/읍/면 또는 도시명을 입력하세요 (예: 노형동, 용담동, 아라동, Seoul, Jeju...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-blue-500/80 focus:outline-none transition-all rounded-2xl text-sm placeholder-white/30 text-white font-sans backdrop-blur-md"
              />
            </div>
            <button
              id="search-submit-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-sm font-semibold transition-all rounded-2xl shadow-lg shadow-blue-950/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              검색
            </button>
          </form>

          {/* Favorites List Container */}
          <div id="favorites-list-container" className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-white/45 font-semibold flex items-center gap-1 mr-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              즐겨찾는 도시:
            </span>
            {favorites.length === 0 ? (
              <span className="text-white/30 italic text-[11px] py-1">즐겨찾는 지역이 아직 없습니다. 검색 후 별표(★)를 눌러 추가해 보세요!</span>
            ) : (
              favorites.map((fav) => {
                const isSelected = 
                  currentCity.toLowerCase() === fav.toLowerCase() || 
                  weatherData?.location.name.toLowerCase() === fav.toLowerCase() ||
                  (fav.toLowerCase().includes("jeju") && weatherData?.location.name.toLowerCase().includes("jeju")) ||
                  (weatherData && weatherData.location.name.toLowerCase().includes(fav.toLowerCase()));
                return (
                  <div
                    key={fav}
                    id={`favorite-badge-${fav}`}
                    className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/35"
                        : "bg-white/5 text-white/70 border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        fetchWeather(fav);
                      }}
                      className="font-semibold cursor-pointer text-left active:scale-95 transition-all flex items-center gap-1"
                    >
                      {isSelected && <Check className="h-3 w-3 text-blue-400" />}
                      {fav}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(fav);
                      }}
                      className="p-0.5 hover:bg-white/15 rounded-full text-white/40 hover:text-red-400 transition-all cursor-pointer"
                      title="즐겨찾기 해제"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
            
            {/* Quick Add current searched location to Favorites */}
            {weatherData && !favorites.some(fav => fav.toLowerCase() === weatherData.location.name.toLowerCase()) && (
              <button
                onClick={() => toggleFavorite(weatherData.location.name)}
                className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-white/50 hover:text-white transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Plus className="h-3 w-3" />
                현재 위치 추가
              </button>
            )}
          </div>
        </section>

        {/* Demo Mode Guide Badge */}
        {weatherData?.isMock && (
          <div id="demo-mode-warning" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-950/30 border border-amber-800/30 rounded-2xl animate-fade-in text-xs text-amber-200">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="font-semibold text-amber-300">현재 데모 모드(데모 데이터)로 실행 중입니다.</p>
                <p className="text-slate-400 mt-0.5">실시간 날씨를 조회하려면 우측 상단의 AI Studio **설정(Secrets)** 패널에서 **WEATHER_API_KEY**를 추가해 주세요.</p>
              </div>
            </div>
            <a
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/20 transition-all text-center self-start sm:self-center shrink-0"
            >
              WeatherAPI 무료 키 발급받기
            </a>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div id="error-card" className="flex flex-col items-center justify-center p-8 bg-slate-900/60 border border-red-900/20 rounded-3xl text-center gap-4">
            <div className="p-3 bg-red-950/40 rounded-full border border-red-900/30">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-200">데이터 조회 실패</h3>
              <p className="text-slate-400 max-w-md mt-1 text-sm">{error.message}</p>
            </div>
            <button
              id="error-retry-btn"
              onClick={() => fetchWeather(currentCity)}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl border border-slate-700 transition-all text-sm active:scale-95 cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div id="loading-spinner-container" className="flex flex-col items-center justify-center p-20 gap-4">
            <RefreshCw className="h-10 w-10 text-sky-400 animate-spin" />
            <p className="text-sm text-slate-400 font-medium animate-pulse">실시간 기상 정보를 가져오는 중...</p>
          </div>
        )}

        {/* Weather Dashboard Grid */}
        {!loading && weatherData && (
          <motion.div
            id="weather-dashboard-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            
            {/* COLUMN 1 & 2: CURRENT WEATHER & HOURLY SLIDER */}
            <div id="dashboard-col-left" className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Current Weather Card */}
              <div id="current-weather-card" className="weather-card-glass rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden shadow-xl shadow-slate-950/20">
                <div className="absolute right-0 top-0 w-48 h-48 bg-sky-500/5 blur-3xl rounded-full" />
                
                {/* City & Country / Last Updated */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sky-400 shrink-0" />
                    <div>
                      <h2 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                        {weatherData.location.name}
                        <button
                          onClick={() => toggleFavorite(weatherData.location.name)}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-all cursor-pointer flex items-center justify-center"
                          title={
                            favorites.some(fav => fav.toLowerCase() === weatherData.location.name.toLowerCase())
                              ? "즐겨찾기에서 제거"
                              : "즐겨찾기에 추가"
                          }
                        >
                          <Star
                            className={`h-5 w-5 transition-all active:scale-90 ${
                              favorites.some(fav => fav.toLowerCase() === weatherData.location.name.toLowerCase())
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-white/40 hover:text-white"
                            }`}
                          />
                        </button>
                        {weatherData.location.country && (
                          <span className="text-xs font-sans font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/30">
                            {weatherData.location.country}
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {weatherData.location.region ? `${weatherData.location.region} • ` : ""}
                        현지 시간: {weatherData.location.localtime.split(" ")[1]}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-800">
                    업데이트: {weatherData.current.last_updated.split(" ")[1]}
                  </span>
                </div>

                {/* Main Temperature & Big Icon */}
                <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-start">
                      <span className="text-[120px] md:text-[150px] font-extrabold leading-none tracking-tighter drop-shadow-2xl text-white">
                        {Math.round(weatherData.current.temp_c)}
                      </span>
                      <span className="text-5xl md:text-6xl font-light mt-4 md:mt-6 text-blue-400">°C</span>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <img
                        src={weatherData.current.condition.icon.startsWith("http") ? weatherData.current.condition.icon : `https:${weatherData.current.condition.icon}`}
                        alt={weatherData.current.condition.text}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 md:w-20 md:h-20 object-contain filter drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                      />
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white tracking-tight">{weatherData.current.condition.text}</span>
                        <span className="text-white/50 text-xs mt-1">
                          체감 {weatherData.current.feelslike_c}°C • 자외선 {weatherData.current.uv}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* High / Low details */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 self-stretch md:self-center justify-center">
                    <div>
                      <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">오늘 최고</span>
                      <span className="text-lg font-bold font-display text-rose-400">{weatherData.forecast.forecastday[0]?.day.maxtemp_c}°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">오늘 최저</span>
                      <span className="text-lg font-bold font-display text-sky-400">{weatherData.forecast.forecastday[0]?.day.mintemp_c}°C</span>
                    </div>
                  </div>
                </div>

                {/* Sub Weather Metrics (Wind, Humidity, Rain, Air Quality) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                  
                  {/* Wind speed & dir */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                      <Wind className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">바람</span>
                      <span className="text-sm font-bold text-white block truncate">{weatherData.current.wind_kph} km/h</span>
                      <span className="text-[9px] text-white/55 font-mono">{getWindDirKorean(weatherData.current.wind_dir)}</span>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">습도</span>
                      <span className="text-sm font-bold text-white block">{weatherData.current.humidity}%</span>
                    </div>
                  </div>

                  {/* Precipitation */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/20 rounded-xl text-yellow-400">
                      <CloudRain className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">강수량</span>
                      <span className="text-sm font-bold text-white block">{weatherData.current.precip_mm} mm</span>
                    </div>
                  </div>

                  {/* Air Quality (PM10) */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                      <Gauge className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">미세먼지</span>
                      <span className="text-sm font-bold text-white block font-mono truncate">
                        {weatherData.current.air_quality?.pm10 ? `${Math.round(weatherData.current.air_quality.pm10)} ㎍/㎥` : "정보 없음"}
                      </span>
                      {weatherData.current.air_quality?.pm10 !== undefined && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${getPM10KoreanLevelWithColor(weatherData.current.air_quality.pm10).color}`}>
                          {getPM10KoreanLevelWithColor(weatherData.current.air_quality.pm10).label}
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Additional Details (Astro - Sunrise / Sunset & Air Quality Index details) */}
                {weatherData.forecast.forecastday[0] && (
                  <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-6 text-xs text-white/80">
                      <div className="flex items-center gap-2">
                        <Sunrise className="h-4 w-4 text-amber-400" />
                        <span>일출 <strong className="font-mono ml-0.5 text-white">{weatherData.forecast.forecastday[0].astro.sunrise}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                        <Sunset className="h-4 w-4 text-orange-400" />
                        <span>일몰 <strong className="font-mono ml-0.5 text-white">{weatherData.forecast.forecastday[0].astro.sunset}</strong></span>
                      </div>
                    </div>
                    
                    {/* Air Quality Badge */}
                    {weatherData.current.air_quality && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-white/40">통합대기:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          getAirQualityLevel(
                            weatherData.current.air_quality.pm10 || 0,
                            weatherData.current.air_quality.pm2_5 || 0
                          ).color
                        }`}>
                          {getAirQualityLevel(
                            weatherData.current.air_quality.pm10 || 0,
                            weatherData.current.air_quality.pm2_5 || 0
                          ).label}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Hourly Forecast Slide Slider */}
              <div id="hourly-forecast-container" className="weather-card-glass rounded-3xl p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4.5 w-4.5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">오늘의 시간별 날씨 예보</h3>
                </div>

                {weatherData.forecast.forecastday[0]?.hour && weatherData.forecast.forecastday[0].hour.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {weatherData.forecast.forecastday[0].hour.map((h, i) => {
                      const timeStr = h.time.split(" ")[1]; // Get HH:MM
                      return (
                        <div
                          key={i}
                          id={`hour-item-${i}`}
                          className="flex flex-col items-center justify-between p-3.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-2xl min-w-[80px] shrink-0 text-center gap-2 group transition-all"
                        >
                          <span className="text-[11px] text-white/50 font-mono group-hover:text-white transition-all">{timeStr}</span>
                          <img
                            src={h.condition.icon.startsWith("http") ? h.condition.icon : `https:${h.condition.icon}`}
                            alt={h.condition.text}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-110 transition-all"
                          />
                          <span className="text-sm font-bold font-display text-white">{Math.round(h.temp_c)}°</span>
                          <span className="text-[9px] text-white/50 max-w-[65px] truncate block">{h.condition.text}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 text-center py-4">시간별 기상 예보 데이터가 없습니다.</p>
                )}
              </div>

            </div>

            {/* COLUMN 3: 3-DAY FORECAST & PERSONALIZED ADVICE */}
            <div id="dashboard-col-right" className="flex flex-col gap-6">
              
              {/* Daily Weather Guide (Aesthetic Tips) */}
              <div id="weather-advice-card" className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
                
                {/* 1. Weather Guide Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4.5 w-4.5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-blue-200">오늘의 기상 가이드</h3>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {getWeatherTips(weatherData).map((tip) => (
                      <div
                        key={tip.id}
                        className={`p-3.5 rounded-2xl border text-xs font-medium leading-relaxed shadow-sm ${tip.color}`}
                      >
                        {tip.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-white/10" />

                {/* 2. Clothing Coordination Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shirt className="h-4.5 w-4.5 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-indigo-200">온도 맞춤 추천 코디 팁</h3>
                  </div>
                  {(() => {
                    const advice = getOutfitRecommendation(weatherData.current.temp_c);
                    return (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2.5 text-xs">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">체감 기준</span>
                          <span className="font-bold text-indigo-300 font-sans text-[11px]">{advice.level}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider mb-1">추천 옷차림</span>
                          <p className="text-sm font-bold text-white leading-snug">{advice.clothes}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider mb-1">코디 상세 조언</span>
                          <p className="text-white/70 leading-relaxed font-normal">{advice.tip}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* 3-Day Forecast Panel */}
              <div id="three-day-forecast-card" className="weather-card-glass rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Calendar className="h-4.5 w-4.5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">3일 기상 일기예보</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {weatherData.forecast.forecastday.map((f, i) => {
                    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
                    const dateObj = new Date(f.date);
                    const dayLabel = daysOfWeek[dateObj.getDay()];
                    const isToday = i === 0;

                    return (
                      <div
                        key={f.date}
                        className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl transition-all"
                      >
                        {/* Day / Date info */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-white">
                            {isToday ? "오늘" : `${dayLabel}요일`}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">{f.date.slice(5)}</span>
                        </div>

                        {/* Condition icon & text */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <img
                            src={f.day.condition.icon.startsWith("http") ? f.day.condition.icon : `https:${f.day.condition.icon}`}
                            alt={f.day.condition.text}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-contain drop-shadow"
                          />
                          <div className="hidden sm:flex flex-col">
                            <span className="text-xs text-white/80 font-medium">{f.day.condition.text}</span>
                            {f.day.daily_chance_of_rain > 0 && (
                              <span className="text-[9px] text-blue-400 font-medium">강수 {f.day.daily_chance_of_rain}%</span>
                            )}
                          </div>
                        </div>

                        {/* Temp Range (Max / Min) */}
                        <div className="flex items-center gap-3 font-display">
                          <span className="text-sm font-bold text-rose-400">{Math.round(f.day.maxtemp_c)}°</span>
                          <span className="text-white/20">/</span>
                          <span className="text-sm font-bold text-sky-400">{Math.round(f.day.mintemp_c)}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </main>

      {/* Elegant minimalist footer */}
      <footer id="app-footer" className="mt-auto pt-12 pb-4 text-center text-white/20 text-[10px] font-mono">
        <p>© 2026 오늘의 날씨. Powered by WeatherAPI.com. Secured via Node.js Server Proxy.</p>
      </footer>

    </div>
  );
}
