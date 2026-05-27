import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enrollment } from '../models/enrollment.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private http: HttpClient) {}

  enroll(userId: number, courseId: number): Observable<Enrollment> {
    const payload: Partial<Enrollment> = { userId, courseId, enrolledAt: new Date().toISOString().split('T')[0] };
    return this.http.post<Enrollment>(this.apiUrl, payload).pipe(catchError(err => throwError(err)));
  }

  getEnrollments(userId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}?userId=${userId}`).pipe(catchError(err => throwError(err)));
  }

  unenroll(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(err => throwError(err)));
  }
}
