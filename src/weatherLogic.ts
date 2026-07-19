// Shared Weather Logic (Reusable for Express server & Vercel serverless functions)

// High-quality mock weather database in Korean (calibrated for July summer season)
export function getMockWeatherData(query: string) {
  const normalized = query.toLowerCase().trim();
  let cityName = "서울";
  let country = "대한민국";
  let region = "서울";
  let tempC = 29.5;
  let conditionText = "맑음";
  let conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
  let conditionCode = 1000;
  const isDay = 1;
  const windKph = 8.5;
  const windDir = "ENE";
  let humidity = 68;
  let feelslikeC = 31.2;
  const uv = 7.0;
  let pm10 = 24;
  let pm2_5 = 11;

  if (normalized.includes("노형동") || normalized.includes("노형")) {
    cityName = "제주시 노형동";
    region = "제주특별자치도";
    tempC = 31.2;
    conditionText = "맑음";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    humidity = 64;
    feelslikeC = 33.5;
    pm10 = 15;
    pm2_5 = 7;
  } else if (normalized.includes("용담동") || normalized.includes("용담")) {
    cityName = "제주시 용담동";
    region = "제주특별자치도";
    tempC = 30.5;
    conditionText = "구름 조금";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    humidity = 70;
    feelslikeC = 32.8;
    pm10 = 19;
    pm2_5 = 9;
  } else if (normalized.includes("연동")) {
    cityName = "제주시 연동";
    region = "제주특별자치도";
    tempC = 31.0;
    conditionText = "맑음";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    humidity = 65;
    feelslikeC = 33.2;
    pm10 = 17;
    pm2_5 = 8;
  } else if (normalized.includes("아라동") || normalized.includes("아라")) {
    cityName = "제주시 아라동";
    region = "제주특별자치도";
    tempC = 28.5; // Ara-dong is higher altitude and cooler
    conditionText = "구름 조금";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    humidity = 78;
    feelslikeC = 30.2;
    pm10 = 12;
    pm2_5 = 6;
  } else if (normalized.includes("jeju") || normalized.includes("제주") || normalized.includes("서귀포")) {
    cityName = normalized.includes("서귀포") ? "서귀포시" : "제주시";
    region = "제주특별자치도";
    tempC = 30.2;
    conditionText = "구름 조금";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    conditionCode = 1003;
    humidity = 72;
    feelslikeC = 32.5;
    pm10 = 18;
    pm2_5 = 8;
  } else if (normalized.endsWith("동") || normalized.endsWith("읍") || normalized.endsWith("면") || normalized.endsWith("시") || normalized.endsWith("군")) {
    cityName = query;
    region = "대한민국 지역";
    tempC = 29.8;
    conditionText = "맑음";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    humidity = 66;
    feelslikeC = 31.5;
    pm10 = 25;
    pm2_5 = 11;
  } else if (normalized.includes("busan") || normalized.includes("부산")) {
    cityName = "부산";
    region = "부산광역시";
    tempC = 30.0;
    conditionText = "구름 조금";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    conditionCode = 1003;
    humidity = 72;
    feelslikeC = 32.0;
    pm10 = 35;
    pm2_5 = 15;
  } else if (normalized.includes("tokyo") || normalized.includes("도쿄")) {
    cityName = "도쿄";
    country = "일본";
    region = "도쿄";
    tempC = 31.1;
    conditionText = "맑음";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    conditionCode = 1000;
    humidity = 62;
    feelslikeC = 33.5;
    pm10 = 15;
    pm2_5 = 5;
  } else if (normalized.includes("london") || normalized.includes("런던")) {
    cityName = "런던";
    country = "영국";
    region = "런던";
    tempC = 22.0;
    conditionText = "구름 조금";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    conditionCode = 1003;
    humidity = 58;
    feelslikeC = 22.2;
    pm10 = 10;
    pm2_5 = 4;
  } else {
    // Fallback for general search
    cityName = query.charAt(0).toUpperCase() + query.slice(1);
    country = "지정 지역";
    tempC = 29.0;
    conditionText = "구름 조금";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    humidity = 67;
    feelslikeC = 30.6;
  }

  // Generate mock hours for today (every 3 hours starting from 00:00)
  const mockHours = Array.from({ length: 8 }, (_, idx) => {
    const hour = idx * 3;
    const hourStr = String(hour).padStart(2, "0") + ":00";
    const hTemp = tempC + Math.sin((hour - 12) / 6) * 4;
    const hCondText = conditionText;
    let hCondIcon = conditionIcon;
    if (hour < 6 || hour > 21) {
      hCondIcon = conditionIcon.replace("day", "night");
    }
    return {
      time: `2026-07-18 ${hourStr}`,
      time_epoch: 1784380800 + hour * 3600,
      temp_c: Math.round(hTemp * 10) / 10,
      condition: {
        text: hCondText,
        icon: hCondIcon
      }
    };
  });

  return {
    location: {
      name: cityName,
      region: region,
      country: country,
      lat: 37.5665,
      lon: 126.978,
      tz_id: "Asia/Seoul",
      localtime_epoch: 1784391164,
      localtime: "2026-07-18 18:12"
    },
    current: {
      last_updated_epoch: 1784391000,
      last_updated: "2026-07-18 18:10",
      temp_c: tempC,
      is_day: isDay,
      condition: {
        text: conditionText,
        icon: conditionIcon,
        code: conditionCode
      },
      wind_kph: windKph,
      wind_degree: 60,
      wind_dir: windDir,
      pressure_mb: 1012.0,
      precip_mm: 0.0,
      humidity: humidity,
      cloud: 20,
      feelslike_c: feelslikeC,
      uv: uv,
      air_quality: {
        co: 270.4,
        no2: 12.3,
        o3: 45.2,
        so2: 2.1,
        pm2_5: pm2_5,
        pm10: pm10,
        "us-epa-index": 1,
        "gb-defra-index": 1
      }
    },
    forecast: {
      forecastday: [
        {
          date: "2026-07-18",
          day: {
            maxtemp_c: tempC + 3.5,
            mintemp_c: tempC - 4.2,
            avgtemp_c: tempC,
            maxwind_kph: windKph * 1.5,
            totalprecip_mm: 0.0,
            totalsnow_cm: 0.0,
            avgvis_km: 10.0,
            avghumidity: humidity,
            daily_will_it_rain: 0,
            daily_chance_of_rain: 10,
            uv: uv,
            condition: {
              text: conditionText,
              icon: conditionIcon
            }
          },
          astro: {
            sunrise: "05:15 AM",
            sunset: "07:55 PM",
            moonrise: "09:30 AM",
            moonset: "11:20 PM"
          },
          hour: mockHours
        },
        {
          date: "2026-07-19",
          day: {
            maxtemp_c: tempC + 4.1,
            mintemp_c: tempC - 3.5,
            avgtemp_c: tempC + 0.5,
            maxwind_kph: windKph * 1.2,
            totalprecip_mm: 1.5,
            totalsnow_cm: 0.0,
            avgvis_km: 9.8,
            avghumidity: humidity + 5,
            daily_will_it_rain: 1,
            daily_chance_of_rain: 60,
            uv: uv - 1,
            condition: {
              text: "구름 많고 한때 비",
              icon: "//cdn.weatherapi.com/weather/64x64/day/176.png"
            }
          },
          astro: {
            sunrise: "05:16 AM",
            sunset: "07:54 PM"
          },
          hour: []
        },
        {
          date: "2026-07-20",
          day: {
            maxtemp_c: tempC + 2.0,
            mintemp_c: tempC - 5.0,
            avgtemp_c: tempC - 1.0,
            maxwind_kph: windKph * 1.1,
            totalprecip_mm: 0.0,
            totalsnow_cm: 0.0,
            avgvis_km: 10.0,
            avghumidity: humidity - 10,
            daily_will_it_rain: 0,
            daily_chance_of_rain: 5,
            uv: uv + 1,
            condition: {
              text: "맑음",
              icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
            }
          },
          astro: {
            sunrise: "05:17 AM",
            sunset: "07:53 PM"
          },
          hour: []
        }
      ]
    }
  };
}

// Translate / Map Korean regional and neighborhood searches to queries supported by WeatherAPI.com
export function mapKoreanQueryToEnglish(query: string): { apiQuery: string; displayName: string } {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  // 1. Jeju neighborhoods (제주 동/읍/면/리) & English "jeju"
  const jejuKeywords = [
    "제주", "노형", "용담", "아라", "연동", "외도", "화북", "삼양", "이도", "일도", "삼도", "오라", "도두", "봉개", "건입",
    "애월", "한림", "조천", "구좌", "한경", "대정", "남원", "성산", "안덕", "표선", "jeju",
    "도남", "오등", "회천", "용강", "영평", "월평", "해안", "내도", "이호", "서귀", "동홍", "서홍", "토평", "상효", "하효", "신효", "보목",
    "법환", "서호", "호근", "강정", "도순", "영남", "대포", "하원", "색달", "상예", "하예", "송산", "정방", "중앙", "천지", "효돈", "영천",
    "대륜", "대천", "중문", "예래", "우도", "추자"
  ];
  const isJeju = jejuKeywords.some(keyword => lower.includes(keyword.toLowerCase()));
  if (isJeju) {
    // Force "Jeju, South Korea" to prevent WeatherAPI from returning "Jeju, Maharashtra, India"
    return { apiQuery: "Jeju, South Korea", displayName: trimmed };
  }

  // If already pure English or starts with letters, return as is (but "jeju" is handled above first)
  if (/^[a-zA-Z]/.test(trimmed)) {
    return { apiQuery: trimmed, displayName: trimmed };
  }

  // 2. Map standard major Korean cities
  const cityMap: Record<string, string> = {
    "서울": "Seoul",
    "부산": "Busan",
    "인천": "Incheon",
    "대구": "Daegu",
    "대전": "Daejeon",
    "광주": "Gwangju",
    "울산": "Ulsan",
    "세종": "Sejong",
    "수원": "Suwon",
    "성남": "Seongnam",
    "분당": "Bundang",
    "고양": "Goyang",
    "일산": "Ilsan",
    "용인": "Yongin",
    "부천": "Bucheon",
    "안산": "Ansan",
    "남양주": "Namyangju",
    "안양": "Anyang",
    "화성": "Hwaseong",
    "평택": "Pyeongtaek",
    "의정부": "Uijeongbu",
    "시흥": "Siheung",
    "파주": "Paju",
    "김포": "Gimpo",
    "광명": "Gwangmyeong",
    "군포": "Gunpo",
    "광주(경기)": "Gwangju, Gyeonggi",
    "이천": "Icheon",
    "오산": "Osan",
    "하남": "Hanam",
    "양주": "Yangju",
    "구리": "Guri",
    "안성": "Anseong",
    "포천": "Pocheon",
    "의왕": "Uiwang",
    "여주": "Yeoju",
    "춘천": "Chuncheon",
    "원주": "Wonju",
    "강릉": "Gangneung",
    "동해": "Donghae",
    "태백": "Taebaek",
    "속초": "Sokcho",
    "삼척": "Samcheok",
    "청주": "Cheongju",
    "충주": "Chungju",
    "제천": "Jecheon",
    "천안": "Cheonan",
    "공주": "Gongju",
    "보령": "Boryeong",
    "아산": "Asan",
    "서산": "Seosan",
    "논산": "Nonsan",
    "계룡": "Gyeryong",
    "당진": "Dangjin",
    "전주": "Jeonju",
    "군산": "Gunsan",
    "익산": "Iksan",
    "정읍": "Jeongeup",
    "남원": "Namwon",
    "김제": "Gimje",
    "목포": "Mokpo",
    "여수": "Yeosu",
    "순천": "Suncheon",
    "나주": "Naju",
    "광양": "Gwangyang",
    "포항": "Pohang",
    "경주": "Gyeongju",
    "김천": "Gimcheon",
    "안동": "Andong",
    "구미": "Gumi",
    "영주": "Yeongju",
    "영천": "Yeongcheon",
    "상주": "Sangju",
    "문경": "Mungyeong",
    "경산": "Gyeongsan",
    "창원": "Changwon",
    "진주": "Jinju",
    "통영": "Tongyeong",
    "사천": "Sacheon",
    "김해": "Gimhae",
    "밀양": "Miryang",
    "거제": "Geoje",
    "양산": "Yangsan"
  };

  for (const [kr, en] of Object.entries(cityMap)) {
    if (lower.includes(kr)) {
      return { apiQuery: en, displayName: trimmed };
    }
  }

  // 3. Fallback for sub-districts (e.g., ending with 동, 읍, 면, 리, 구)
  // If the query ends in a local district but does not have a matched city, keep it as query so WeatherAPI can attempt look up
  // (Our backend will gracefully fall back to "Jeju, South Korea" or "Seoul" if it fails with 400)
  if (lower.endsWith("동") || lower.endsWith("구") || lower.endsWith("읍") || lower.endsWith("면") || lower.endsWith("리")) {
    return { apiQuery: trimmed, displayName: trimmed };
  }

  return { apiQuery: trimmed, displayName: trimmed };
}

// Procedurally apply realistic meteorological offsets to specific Jeju neighborhoods
export function applyLocalJejuAdjustments(data: any, rawQuery: string): any {
  if (!data || !data.current) return data;

  const lower = rawQuery.toLowerCase().trim();
  let tempOffset = 0;
  let humidityOffset = 0;
  let windOffset = 0;
  let pm10Offset = 0;
  let pm25Offset = 0;

  if (lower.includes("노형동") || lower.includes("노형")) {
    tempOffset = 0.5;
    humidityOffset = -3;
    windOffset = -1.0;
    pm10Offset = 3;
    pm25Offset = 2;
  } else if (lower.includes("용담동") || lower.includes("용담")) {
    tempOffset = 0.2;
    humidityOffset = 4;
    windOffset = 5.5;
    pm10Offset = 1;
    pm25Offset = 1;
  } else if (lower.includes("연동")) {
    tempOffset = 0.4;
    humidityOffset = -2;
    windOffset = -0.5;
    pm10Offset = 4;
    pm25Offset = 2;
  } else if (lower.includes("아라동") || lower.includes("아라")) {
    tempOffset = -1.8;
    humidityOffset = 12;
    windOffset = 2.0;
    pm10Offset = -5;
    pm25Offset = -3;
  } else {
    // No specific neighborhood found
    return data;
  }

  // Apply to current weather
  if (data.current) {
    if (typeof data.current.temp_c === "number") {
      data.current.temp_c = Number((data.current.temp_c + tempOffset).toFixed(1));
      data.current.temp_f = Number((data.current.temp_c * 1.8 + 32).toFixed(1));
    }
    if (typeof data.current.feelslike_c === "number") {
      data.current.feelslike_c = Number((data.current.feelslike_c + tempOffset).toFixed(1));
      data.current.feelslike_f = Number((data.current.feelslike_c * 1.8 + 32).toFixed(1));
    }
    if (typeof data.current.humidity === "number") {
      data.current.humidity = Math.max(10, Math.min(100, data.current.humidity + humidityOffset));
    }
    if (typeof data.current.wind_kph === "number") {
      data.current.wind_kph = Math.max(0, Number((data.current.wind_kph + windOffset).toFixed(1)));
      data.current.wind_mph = Number((data.current.wind_kph * 0.621371).toFixed(1));
    }

    if (data.current.air_quality) {
      if (typeof data.current.air_quality.pm10 === "number") {
        data.current.air_quality.pm10 = Math.max(5, Math.round(data.current.air_quality.pm10 + pm10Offset));
      }
      if (typeof data.current.air_quality.pm2_5 === "number") {
        data.current.air_quality.pm2_5 = Math.max(3, Math.round(data.current.air_quality.pm2_5 + pm25Offset));
      }
    }
  }

  // Apply to forecast days
  if (data.forecast && Array.isArray(data.forecast.forecastday)) {
    data.forecast.forecastday.forEach((fday: any) => {
      if (fday.day) {
        if (typeof fday.day.maxtemp_c === "number") {
          fday.day.maxtemp_c = Number((fday.day.maxtemp_c + tempOffset).toFixed(1));
          fday.day.maxtemp_f = Number((fday.day.maxtemp_c * 1.8 + 32).toFixed(1));
        }
        if (typeof fday.day.mintemp_c === "number") {
          fday.day.mintemp_c = Number((fday.day.mintemp_c + tempOffset).toFixed(1));
          fday.day.mintemp_f = Number((fday.day.mintemp_c * 1.8 + 32).toFixed(1));
        }
        if (typeof fday.day.avgtemp_c === "number") {
          fday.day.avgtemp_c = Number((fday.day.avgtemp_c + tempOffset).toFixed(1));
          fday.day.avgtemp_f = Number((fday.day.avgtemp_c * 1.8 + 32).toFixed(1));
        }
        if (typeof fday.day.avghumidity === "number") {
          fday.day.avghumidity = Math.max(10, Math.min(100, fday.day.avghumidity + humidityOffset));
        }
        if (typeof fday.day.maxwind_kph === "number") {
          fday.day.maxwind_kph = Math.max(0, Number((fday.day.maxwind_kph + windOffset).toFixed(1)));
          fday.day.maxwind_mph = Number((fday.day.maxwind_kph * 0.621371).toFixed(1));
        }
      }
      
      // Also adjust hourly if present
      if (Array.isArray(fday.hour)) {
        fday.hour.forEach((h: any) => {
          if (typeof h.temp_c === "number") {
            h.temp_c = Number((h.temp_c + tempOffset).toFixed(1));
            h.temp_f = Number((h.temp_c * 1.8 + 32).toFixed(1));
          }
          if (typeof h.feelslike_c === "number") {
            h.feelslike_c = Number((h.feelslike_c + tempOffset).toFixed(1));
            h.feelslike_f = Number((h.feelslike_c * 1.8 + 32).toFixed(1));
          }
          if (typeof h.humidity === "number") {
            h.humidity = Math.max(10, Math.min(100, h.humidity + humidityOffset));
          }
          if (typeof h.wind_kph === "number") {
            h.wind_kph = Math.max(0, Number((h.wind_kph + windOffset).toFixed(1)));
            h.wind_mph = Number((h.wind_kph * 0.621371).toFixed(1));
          }
        });
      }
    });
  }

  return data;
}
