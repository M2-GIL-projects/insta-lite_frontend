import { User } from "./User";

export interface Picture {
    id: number;
    title: string;
    url: string;
    post: string;
    private: boolean;
    isPrivate: boolean;
  }
  
  export interface Video {
    url: string;
    thumbnail: string;
    extension: string;
    post: string;
    isPrivate: boolean;
  }
  
  export interface Like {
    id: number;
    post: string;
  }
  
  export interface Comment {
    id: number;
    post: string;
    content: string;
    createdAt: Date;
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
    isPrivate: boolean;
  }


  