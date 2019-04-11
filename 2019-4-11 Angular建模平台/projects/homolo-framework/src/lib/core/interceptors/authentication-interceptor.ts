import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class AuthenticationInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && event.status === 302) {
                    console.log('HttpResponse::event =', event, ';');
                } else { }
                return event;
            }))
            .pipe(catchError((err: any, caught) => {
                if (err.url && err.url.endsWith('/login.jsp')) {
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 403) {
                        window.location.href = '/login';
                        console.log('err.error =', err.error, ';');
                    }
                    return throwError(err);
                }
            }));
    }
}


