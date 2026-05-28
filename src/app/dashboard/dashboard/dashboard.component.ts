import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { Enrollment } from '../../core/models/enrollment.model';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class DashboardComponent implements OnInit, OnDestroy {
  enrolledCourses: Course[] = [];
  enrollments: Enrollment[] = [];
  userName = '';
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) { return; }
    this.userName = user.name;

    forkJoin([
      this.enrollmentService.getEnrollments(user.id),
      this.courseService.getCourses()
    ]).pipe(takeUntil(this.destroy$)).subscribe(([enrollments, courses]) => {
      this.enrollments = enrollments;
      this.enrolledCourses = courses.filter(c => enrollments.some(e => e.courseId === c.id));
      this.isLoading = false;
    }, () => { this.isLoading = false; });
  }

  unenroll(courseId: number) {
    const enrollment = this.enrollments.find(e => e.courseId === courseId);
    if (!enrollment) { return; }
    this.enrollmentService.unenroll(enrollment.id).subscribe(() => {
      this.enrolledCourses = this.enrolledCourses.filter(c => c.id !== courseId);
      this.enrollments = this.enrollments.filter(e => e.id !== enrollment.id);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
