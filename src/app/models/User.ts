export interface User {
    id?: number;
    pseudo: string;
    email: string;
    role?: string;
    password?: string; 
    profileImg?: string;
    bio?: string,
    phone?:string,
    createdAt?: Date
}
