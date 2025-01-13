export interface User {
    id?: number;
    pseudo: string;
    email: string;
    role?: string;
    password?: string; 
    photo?: string;
    bio?: string,
    phone?:string,
    createdAt?: Date,
    postCount?: number;
}
