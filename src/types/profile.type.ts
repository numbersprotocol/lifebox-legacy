import { User } from './user.type'

export class Profile {
    user: User;
    birthday: string;
    gender: string;
    nationality: string;
    city: string;
    image: string;

    constructor() {
        this.user = new User();
    }
  }
