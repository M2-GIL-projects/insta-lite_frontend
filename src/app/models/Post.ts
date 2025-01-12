import { User } from "./User";

export interface Picture {
    id: number;
    title: string;
    url: string;
    post: string;
    private: boolean;
  }
  
  export interface Video {
    id?:number;
    url: string;
    thumbnail: string;
    extension: string;
    post?: Post;
    isPrivate: boolean;
  }
  
  export interface Like {
    id: number;
    post: string;
    user: User;
  }
  
  export interface Comment {
    id: number;
    post: string;
    content: string;
    createdAt: Date;
    user: User;
  }
  
  export interface Post {
    id: number;
    content: string;
    pictures?: Picture[];
    videos?: Video[];
    user: User;
    likes?: Like[];
    comments?: Comment[];
    createdAt?: Date;
    private: boolean;
  }


  