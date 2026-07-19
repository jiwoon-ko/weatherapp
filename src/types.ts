/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface AirQuality {
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm2_5?: number;
  pm10?: number;
  "us-epa-index"?: number;
  "gb-defra-index"?: number;
}

export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f?: number;
  is_day: number;
  condition: WeatherCondition;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  uv: number;
  air_quality?: AirQuality;
}

export interface ForecastHour {
  time_epoch: number;
  time: string;
  temp_c: number;
  is_day?: number;
  condition: WeatherCondition;
  wind_kph?: number;
  humidity?: number;
  chance_of_rain?: number;
}

export interface ForecastDayInfo {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  uv: number;
  condition: WeatherCondition;
}

export interface AstroInfo {
  sunrise: string;
  sunset: string;
  moonrise?: string;
  moonset?: string;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: ForecastDayInfo;
  astro: AstroInfo;
  hour: ForecastHour[];
}

export interface WeatherForecast {
  forecastday: ForecastDay[];
}

export interface WeatherData {
  location: WeatherLocation;
  current: WeatherCurrent;
  forecast: WeatherForecast;
  isMock?: boolean;
  message?: string;
}

export interface WeatherError {
  error: string;
  message: string;
  status?: number;
}
