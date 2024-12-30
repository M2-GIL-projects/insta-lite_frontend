import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor() { }

  private comments = [
    { id: 1, userId: 2, contentId: 1, contentType: 'image', text: 'Beautiful sunset!', createdAt: new Date() },
    { id: 2, userId: 1, contentId: 3, contentType: 'video', text: 'Great travel vlog!', createdAt: new Date() }
  ];

  getComments(contentId: number, contentType: string): Observable<any[]> {
    return of(this.comments.filter(c => c.contentId === contentId && c.contentType === contentType));
  }

  addComment(comment: any): Observable<any> {
    const newComment = { ...comment, id: this.comments.length + 1, createdAt: new Date() };
    this.comments.push(newComment);
    return of(newComment);
  }
}
