export interface AirQualityResponse {
    status: string;
    data: AirQualityResponseData;
}

export interface AirQualityResponseData {
    aqi: number;
    idx: number;
    attributions: Array<{}>;
    city: AirQualityResponseCity;
    dominentpol: string;
    iaqi: {};
    time: {};
    debug: {};
}

export interface AirQualityResponseCity {
    geo: Array<number>;
    name: string;
    url: string;
}
export interface Email {
    email: string;
}

export interface EmailResponse extends Array<Email> { }
export interface QuickLoginResponse {
    success?: boolean;
    error?: string;
}

export interface LoginApiResponse {
    data: string;
    success: boolean;
}

export interface LoginResponse {
    success: boolean;
    uid: number;
}

export interface SignupResponse {
    success: boolean;
    error?: string;
}

export interface WeatherResponse {
    coord: WeatherResponseCoord;
    weather: Array<{}>;
    base: string;
    main: WeatherResponseMain;
    wind: WeatherResponseWind;
    clouds: {};
    dt: number;
    sys: {};
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface WeatherResponseCoord {
    lat: number;
    lon: number;
}

export interface WeatherResponseMain {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
}

export interface WeatherResponseWind {
    speed: number;
    deg: number;
}

export interface FastLoginResponse {
    uid: number;
    token: string;
    web3_token: string;
}
