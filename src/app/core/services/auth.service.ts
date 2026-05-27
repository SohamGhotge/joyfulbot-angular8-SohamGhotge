import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getUserFromStorage(): User | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${environment.apiUrl}/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length === 0) { throw new Error('Invalid credentials'); }
        const user = users[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', `token-${user.id}`);
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(err => throwError(err))
    );
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, userData).pipe(
      catchError(err => throwError(err))
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}
