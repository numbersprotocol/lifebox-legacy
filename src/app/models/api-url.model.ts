import { API_URL,
    AQ_API_TOKEN, AQ_API_URL,
    WEATHER_API_URL, WEATHER_API_SUFFIX,
} from '../../environments/environment';


export const enum Endpoint {
    EMAIL = '/email/',
    ENVIRONMENT = '/environment/',
    FAST_LOGIN = '/fast_login/',
    IODOOR = '/io-door/',
    LOGIN_API = '/login_api/',
    SCHEMA = '/schema/',
    SIGNUP_API = '/signup_api/',
    STEPS = '/steps/',
    USERS = '/users/',
}

export class ApiUrl {

    constructor() { }

    static airQualityByCity(city: string) {
        return `${AQ_API_URL}/${city}/?token=${AQ_API_TOKEN}`;
    }

    static airQualityByCoordinate(latitude: number, longitude: number) {
        return `${AQ_API_URL}/geo:${latitude};${longitude}/?token=${AQ_API_TOKEN}`;
    }

    static email() {
        return `${API_URL}${Endpoint.EMAIL}`;
    }

    static envMeta() {
        return `${API_URL}${Endpoint.ENVIRONMENT}`;
    }

    static iodoorMeta() {
        return `${API_URL}${Endpoint.IODOOR}`;
    }

    static stepsMeta() {
        return `${API_URL}${Endpoint.STEPS}`;
    }

    static profile(uid: number) {
        return `${API_URL}${Endpoint.USERS}${uid}/`;
    }

    static quickLogin() {
        return `${API_URL}${Endpoint.FAST_LOGIN}`;
    }

    static loginApi() {
        return `${API_URL}${Endpoint.LOGIN_API}`;
    }

    static profileSchema(uid: number) {
        return `${API_URL}${Endpoint.USERS}${uid}${Endpoint.SCHEMA}`;
    }

    static signupApi() {
        return `${API_URL}${Endpoint.SIGNUP_API}`;
    }

    static weatherByCoordinate(latitude: number, longitude: number) {
        return `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}${WEATHER_API_SUFFIX}`;
    }

    static weatherByCity(city: string) {
        return `${WEATHER_API_URL}/weather?q=${city}${WEATHER_API_SUFFIX}`;
    }

    static weatherForecastByCity(city: string) {
        return `${WEATHER_API_URL}/forecast?q=${city}${WEATHER_API_SUFFIX}`;
    }

    static weatherForecastNextWeekByCity(city: string) {
        return `${WEATHER_API_URL}/forecast/daily?q=${city}${WEATHER_API_SUFFIX}&cnt=7`;
    }

}