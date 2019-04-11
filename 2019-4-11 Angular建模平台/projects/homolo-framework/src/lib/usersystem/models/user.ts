import { Role } from './role';

export class User {
    userId: string;
    personId: string;
    userName: string;
    nickName: string;
    email: string;
    mobile: string;
    avatar: string;
    anonymous: boolean;
    roles: Array<Role>;
    constructor(userId: string, personId: string, userName: string, nickName: string, email: string,
                avatar: string, mobile: string, anonymous = true, roles: Array<Role>) {
        this.userId = userId;
        this.personId = personId;
        this.userName = userName;
        this.email = email;
        this.nickName = nickName;
        this.avatar = avatar;
        this.mobile = mobile;
        this.anonymous = anonymous;
        this.roles = roles;
    }
}
