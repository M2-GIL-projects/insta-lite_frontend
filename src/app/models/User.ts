export interface User {
    id?: string;
    pseudo: string;
    email: string;
    role?: string;
    password?: string; 
    profileImg?: string;
    bio?: string,
    phone?:string,
    joinDate?:Date
}
