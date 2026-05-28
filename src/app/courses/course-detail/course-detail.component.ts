import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { Course } from '../../core/models/course.model';

@Component({ selector: 'app-course-detail', templateUrl: './course-detail.component.html', styleUrls: ['./course-detail.component.scss'] })
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course;
  isLoading = true;
  successMessage = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.courseService.getCourseById(id).pipe(takeUntil(this.destroy$)).subscribe(
      data => { this.course = data; this.isLoading = false; },
      () => { this.isLoading = false; this.router.navigate(['/courses']); }
    );
  }

  enroll() {
    const user = this.authService.getCurrentUser();
    if (!user) { this.router.navigate(['/auth/login']); return; }
    this.enrollmentService.enroll(user.id, this.course.id).subscribe(
      () => { this.successMessage = 'Successfully enrolled!'; this.errorMessage = ''; },
      () => { this.errorMessage = 'Enrollment failed. Try again.'; }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
