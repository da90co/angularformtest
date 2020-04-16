import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({providedIn: "root"})
export class PostService {
error = new Subject<string>();

constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};

        this.http
        // < > which data type we're getting, optional but recommended for better intellisense and TS
          .post<{ name:string }>(
            'https://test-project-1c50e.firebaseio.com/posts.json',
            postData
          )
          .subscribe(responseData => {
            console.log(responseData);
          }, error => {
              this.error.next(error.message)
          });
    }

    fetchPosts() {
        return this.http.get<{[key: string]: Post}>("https://test-project-1c50e.firebaseio.com/posts.json")
        .pipe(map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({...responseData[key], id: key })
            }
          }
          return postsArray;
        }), catchError(errorRes => {
            //generic error handling task, e.g. sending to analytics or log it
            return throwError(errorRes);
        }))
      }

    deletePosts() {
        //informs the component by using return
        return this.http.delete("https://test-project-1c50e.firebaseio.com/posts.json");
    }
}