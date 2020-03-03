export interface QuickLoginPayload {
    uid: number;
    token: string;
}

export interface LoginPayload {
    address: string;
    signature: string;
    token: string;
}

export interface ProfilePayload {
    user: User;
    birthday: string;
    gender: string;
    nationality: string;
    city: string;
    image: string;
}

export interface SignupPayload {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
}

export interface User {
    email: string;
    last_name: string;
    first_name: string;
}
