import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../core/models/course.model';

@Component({ selector: 'app-course-card', templateUrl: './course-card.component.html', styleUrls: ['./course-card.component.scss'] })
export class CourseCardComponent {
  @Input() course: Course;
  @Output() enrolled = new EventEmitter<Course>();

  onEnroll() {
    this.enrolled.emit(this.course);
  }
}
