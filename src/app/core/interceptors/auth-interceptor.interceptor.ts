import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loggingService.error(`HTTP Error: ${error.status} - ${error.message}`);
        return throwError(error);
      })
    );
  }
}
