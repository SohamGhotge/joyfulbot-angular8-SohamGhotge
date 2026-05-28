import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, catchError } from 'rxjs/operators';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { Course } from '../../core/models/course.model';

@Component({ selector: 'app-course-list', templateUrl: './course-list.component.html', styleUrls: ['./course-list.component.scss'] })
export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  courses$: Observable<Course[]>;
  searchForm: FormGroup;
  isLoading = true;
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({ query: [''] });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const q = params['q'] || '';
      this.searchForm.get('query').setValue(q, { emitEvent: false });
      this.loadCourses(q);
    });

    this.searchForm.get('query').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.router.navigate([], { queryParams: { q: query || null }, queryParamsHandling: 'merge' });
      this.loadCourses(query);
    });
  }

  loadCourses(query: string) {
    this.isLoading = true;
    const request = query ? this.courseService.searchCourses(query) : this.courseService.getCourses();
    this.courses$ = request.pipe(
      catchError(() => of([]))
    );
    this.courses$.pipe(takeUntil(this.destroy$)).subscribe(
      data => { this.courses = data; this.isLoading = false; },
      () => { this.isLoading = false; }
    );
  }

  onEnroll(course: Course) {
    const user = this.authService.getCurrentUser();
    if (!user) { this.router.navigate(['/auth/login']); return; }
    this.enrollmentService.enroll(user.id, course.id).subscribe(
      () => { this.successMessage = `Successfully enrolled in ${course.title}!`; setTimeout(() => this.successMessage = '', 3000); },
      () => {}
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
